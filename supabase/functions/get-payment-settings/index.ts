import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Decryption utilities using Web Crypto API
async function getEncryptionKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret.padEnd(32, '0').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('lejio-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function decrypt(encryptedText: string, encryptionKey: CryptoKey): Promise<string> {
  if (!encryptedText) return '';
  
  try {
    // Base64 decode
    const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    
    // Extract IV (first 12 bytes) and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('[GET-PAYMENT-SETTINGS] Decryption failed, returning empty string');
    return '';
  }
}

// Mask API key for display (show only last 4 characters)
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '••••••••';
  return '••••••••' + key.slice(-4);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const encryptionSecret = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionSecret) {
      console.error('[GET-PAYMENT-SETTINGS] ENCRYPTION_KEY not found in environment');
      // Return empty settings instead of throwing - settings just won't be decrypted
      return new Response(
        JSON.stringify({ settings: null, warning: 'Payment settings unavailable - encryption not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create client with user's auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('[GET-PAYMENT-SETTINGS] No valid authorization header');
      return new Response(
        JSON.stringify({ settings: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify token and get claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims?.sub) {
      console.error('[GET-PAYMENT-SETTINGS] Auth error:', claimsError?.message);
      return new Response(
        JSON.stringify({ settings: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Use service role client for database operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create a user-like object for compatibility
    const user = { id: userId };

    console.log('[GET-PAYMENT-SETTINGS] Fetching settings for user:', user.id);

    // Fetch data using the existing admin client

    const { data, error } = await supabaseAdmin
      .from('lessor_payment_settings')
      .select('*')
      .eq('lessor_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[GET-PAYMENT-SETTINGS] Database error:', error);
      throw error;
    }

    if (!data) {
      return new Response(
        JSON.stringify({ settings: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get encryption key and decrypt sensitive fields
    const encryptionKey = await getEncryptionKey(encryptionSecret);
    
    const decryptedApiKey = data.gateway_api_key 
      ? await decrypt(data.gateway_api_key, encryptionKey) 
      : null;
    const decryptedMerchantId = data.gateway_merchant_id 
      ? await decrypt(data.gateway_merchant_id, encryptionKey) 
      : null;

    // Check if we should return full or masked values
    const url = new URL(req.url);
    const includeFull = url.searchParams.get('include_full') === 'true';

    const responseData = {
      id: data.id,
      lessor_id: data.lessor_id,
      payment_gateway: data.payment_gateway,
      bank_account: data.bank_account,
      // Return masked values for display, full values only when explicitly requested
      gateway_api_key: includeFull ? decryptedApiKey : (decryptedApiKey ? maskApiKey(decryptedApiKey) : null),
      gateway_merchant_id: includeFull ? decryptedMerchantId : (decryptedMerchantId ? maskApiKey(decryptedMerchantId) : null),
      // Include flags to indicate if values exist
      has_api_key: !!decryptedApiKey,
      has_merchant_id: !!decryptedMerchantId
    };

    console.log('[GET-PAYMENT-SETTINGS] Settings retrieved successfully');

    return new Response(
      JSON.stringify({ settings: responseData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[GET-PAYMENT-SETTINGS] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
