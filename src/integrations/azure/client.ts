// Azure SQL Database client for Lejio Fri
// Replaces Supabase client with Azure SQL + Managed Identity

import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { createClient } from "@supabase/supabase-js";

// Environment configuration
const SQL_SERVER = import.meta.env.VITE_SQL_SERVER || "lejio-fri.database.windows.net";
const SQL_DATABASE = import.meta.env.VITE_SQL_DATABASE || "lejio-fri";
const STORAGE_ACCOUNT = import.meta.env.VITE_STORAGE_ACCOUNT;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7071/api";
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || "development";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "";

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
export const azureApi: {
  request<T>(endpoint: string, options?: RequestInit): Promise<T>;
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  put<T>(endpoint: string, data?: any): Promise<T>;
  patch<T>(endpoint: string, data?: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
} = {
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
// Supabase client for main Lejio platform. Fri bruger Azure API via azureApi.
export const supabase = createClient<any>(
  SUPABASE_URL,
  SUPABASE_KEY,
);

export const dbClient: ReturnType<typeof createClient> = supabase;

export default dbClient;
