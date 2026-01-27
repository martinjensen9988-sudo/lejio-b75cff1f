/**
 * Azure PostgreSQL Client for Lejio Fri (Lessor Platform)
 * Note: Browser cannot directly connect to PostgreSQL
 * This is a stub that will be replaced with Supabase edge functions or backend API
 * 
 * For now, we'll use a mock that stores in localStorage for demo
 * In production, use Supabase edge functions to query Azure
 */

// Stub: Will be replaced with real API calls to edge function
export async function initializeAzureDb() {
  console.log('✅ Azure client initialized (mock mode)');
}

export function getAzureDb() {
  throw new Error('Direct database access not available in browser. Use edge functions instead.');
}

/**
 * Query wrapper that will call a Supabase edge function
 * The edge function will handle actual Azure PostgreSQL queries
 */
export async function queryAzure(sql: string, params: any[] = []) {
  // For now, this is a mock
  // In production:
  // const response = await supabase.functions.invoke('query-fri-db', { 
  //   body: { sql, params } 
  // });
  // return response.data;
  
  console.warn('⚠️  queryAzure called - implement edge function integration');
  
  // Mock implementation using localStorage for development
  const store = localStorage.getItem('fri_mock_db') || '{}';
  const db = JSON.parse(store);
  
  // Very basic mock implementation
  if (sql.includes('SELECT') && sql.includes('lessor_accounts')) {
    return {
      rows: db.lessor_accounts || [],
      rowCount: (db.lessor_accounts || []).length,
    };
  }
  
  if (sql.includes('INSERT')) {
    return { rows: [{ id: crypto.randomUUID() }], rowCount: 1 };
  }
  
  return { rows: [], rowCount: 0 };
}

export async function disconnectAzure() {
  console.log('✅ Disconnected from Azure PostgreSQL');
}

