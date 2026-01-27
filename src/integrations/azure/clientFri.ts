/**
 * Azure PostgreSQL Client for Lejio Fri (Lessor Platform)
 * Connects to: Azure Database for PostgreSQL
 * 
 * Usage:
 * - Direct PostgreSQL queries via pg Client
 * - All lessor_* tables stored in Azure
 * - Auth still handled by Supabase (hybrid approach)
 */

import { Client } from 'pg';

let azurePgFri: Client | null = null;

/**
 * Initialize Azure PostgreSQL connection
 * Should be called once on app startup
 */
export async function initializeAzureDb() {
  if (azurePgFri) return; // Already connected

  const connectionString = import.meta.env.VITE_DATABASE_URL_FRI;

  if (!connectionString) {
    console.error(
      '❌ VITE_DATABASE_URL_FRI not set. Lejio Fri will not work.',
      'Add to .env.local: VITE_DATABASE_URL_FRI=postgresql://...'
    );
    return;
  }

  azurePgFri = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Azure requires SSL
    },
  });

  try {
    await azurePgFri.connect();
    console.log('✅ Connected to Azure PostgreSQL (Lejio Fri)');
  } catch (error) {
    console.error('❌ Failed to connect to Azure PostgreSQL:', error);
    azurePgFri = null;
  }
}

/**
 * Get Azure client instance
 * Call initializeAzureDb() first
 */
export function getAzureDb(): Client {
  if (!azurePgFri) {
    throw new Error('Azure PostgreSQL not initialized. Call initializeAzureDb() first.');
  }
  return azurePgFri;
}

/**
 * Query wrapper for Azure PostgreSQL
 */
export async function queryAzure(sql: string, params: any[] = []) {
  const client = getAzureDb();
  try {
    const result = await client.query(sql, params);
    return result;
  } catch (error) {
    console.error('Azure query error:', { sql, params, error });
    throw error;
  }
}

/**
 * Disconnect from Azure (for cleanup)
 */
export async function disconnectAzure() {
  if (azurePgFri) {
    await azurePgFri.end();
    azurePgFri = null;
    console.log('✅ Disconnected from Azure PostgreSQL');
  }
}
