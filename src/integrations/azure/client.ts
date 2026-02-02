// Azure SQL Database client for Lejio Fri
// Replaces Supabase client with Azure SQL + Managed Identity

import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

// Environment configuration
const SQL_SERVER = import.meta.env.VITE_SQL_SERVER || "lejio-fri.database.windows.net";
const SQL_DATABASE = import.meta.env.VITE_SQL_DATABASE || "lejio-fri";
const STORAGE_ACCOUNT = import.meta.env.VITE_STORAGE_ACCOUNT;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7071/api";
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || "development";

// Initialize Azure Blob Storage client
let blobClient: BlobServiceClient | null = null;

export async function initializeAzureClients() {
  try {
    // Use DefaultAzureCredential for managed identity
    const credential = new DefaultAzureCredential();
    
    // Initialize Blob Storage client
    if (STORAGE_ACCOUNT) {
      blobClient = new BlobServiceClient(
        `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
        credential
      );
      console.log("✅ Azure Blob Storage client initialized");
    }
  } catch (error) {
    console.error("Failed to initialize Azure clients:", error);
  }
}

// API Client for communication with Azure Functions backend
export const azureApi = {
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${error.message || response.statusText}`);
    }

    return response.json();
  },

  async get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  },

  async post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  },
};

// File upload to Azure Blob Storage
export async function uploadFile(
  containerName: string,
  fileName: string,
  file: File
): Promise<string> {
  if (!blobClient) {
    throw new Error("Azure Blob Storage client not initialized");
  }

  try {
    const containerClient = blobClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.upload(file, file.size);
    
    return blockBlobClient.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
}

// Download file from Azure Blob Storage
export async function downloadFile(containerName: string, fileName: string): Promise<Blob> {
  if (!blobClient) {
    throw new Error("Azure Blob Storage client not initialized");
  }

  try {
    const containerClient = blobClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const downloadBlockBlobResponse = await blockBlobClient.download();
    return downloadBlockBlobResponse.readableStreamBody as unknown as Blob;
  } catch (error) {
    console.error("File download failed:", error);
    throw error;
  }
}

// Configuration export
export const azureConfig = {
  sqlServer: SQL_SERVER,
  database: SQL_DATABASE,
  storageAccount: STORAGE_ACCOUNT,
  apiUrl: API_URL,
  environment: ENVIRONMENT,
};

// Migration helper: Create Azure client compatible with Supabase-style usage
export const supabase = {
  auth: {
    signInWithOAuth: async (options: any) => {
      // Redirect to Azure AD login
      const { provider } = options;
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const authEndpoint = `${API_URL}/auth/login?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUrl)}`;
      window.location.href = authEndpoint;
      return { error: null };
    },
    
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      try {
        const response = await azureApi.post<any>("/auth/login", credentials);
        return { data: response, error: null };
      } catch (error: any) {
        return { data: null, error };
      }
    },

    signOut: async () => {
      try {
        await azureApi.post("/auth/logout");
        return { error: null };
      } catch (error: any) {
        return { error };
      }
    },

    getSession: async () => {
      try {
        const session = await azureApi.get<any>("/auth/session");
        return { data: { session }, error: null };
      } catch (error: any) {
        return { data: { session: null }, error };
      }
    },

    onAuthStateChange: (callback: any) => {
      // Listen for auth changes via event listener or polling
      // For now, return a no-op subscription
      return {
        data: { subscription: null },
        unsubscribe: () => {},
      };
    },
  },

  // Placeholder for database operations - migrate to REST API calls
  from: (tableName: string) => ({
    select: async (columns?: string) => {
      const query = `SELECT ${columns || "*"} FROM ${tableName}`;
      return azureApi.post("/db/query", { query });
    },
    insert: async (data: any[]) => {
      return azureApi.post(`/db/${tableName}`, { records: data });
    },
    update: async (data: any) => {
      return azureApi.put(`/db/${tableName}`, data);
    },
    delete: async () => {
      return azureApi.delete(`/db/${tableName}`);
    },
  }),

  storage: {
    from: (bucketName: string) => ({
      upload: async (fileName: string, file: File) => {
        const url = await uploadFile(bucketName, fileName, file);
        return { data: { path: fileName }, error: null };
      },
      download: async (fileName: string) => {
        const blob = await downloadFile(bucketName, fileName);
        return { data: blob, error: null };
      },
      getPublicUrl: (fileName: string) => ({
        data: { publicUrl: `${azureConfig.apiUrl}/blob/${bucketName}/${fileName}` },
      }),
    }),
  },
};

export default supabase;
