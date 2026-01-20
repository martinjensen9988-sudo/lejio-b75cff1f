import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Encryption utilities using Web Crypto API
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

async function encrypt(text: string, encryptionKey: CryptoKey): Promise<string> {
  if (!text) return '';
  
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    encoder.encode(text)
  );
  
  // Combine IV and encrypted data, then base64 encode
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const encryptionSecret = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionSecret) {
      throw new Error('ENCRYPTION_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Check for authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No authorization header');
    }

    // Create client for auth validation
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify token and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims?.sub) {
      console.error('[SAVE-PAYMENT-SETTINGS] Auth error:', claimsError?.message);
      throw new Error('Not authenticated');
    }

    const user = { id: claimsData.claims.sub };

    const { payment_gateway, gateway_api_key, gateway_merchant_id, bank_account } = await req.json();
    
    console.log('[SAVE-PAYMENT-SETTINGS] Saving settings for user:', user.id);

    // Get encryption key
    const encryptionKey = await getEncryptionKey(encryptionSecret);

    // Encrypt sensitive fields
    const encryptedApiKey = gateway_api_key ? await encrypt(gateway_api_key, encryptionKey) : null;
    const encryptedMerchantId = gateway_merchant_id ? await encrypt(gateway_merchant_id, encryptionKey) : null;

    // Use service role for database operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if record exists
    const { data: existing } = await supabaseAdmin
      .from('lessor_payment_settings')
      .select('id')
      .eq('lessor_id', user.id)
      .maybeSingle();

    let error;
    if (existing) {
      // Update existing record
      const result = await supabaseAdmin
        .from('lessor_payment_settings')
        .update({
          payment_gateway,
          gateway_api_key: encryptedApiKey,
          gateway_merchant_id: encryptedMerchantId,
          bank_account,
          updated_at: new Date().toISOString()
        })
        .eq('lessor_id', user.id);
      error = result.error;
    } else {
      // Insert new record
      const result = await supabaseAdmin
        .from('lessor_payment_settings')
        .insert({
          lessor_id: user.id,
          payment_gateway,
          gateway_api_key: encryptedApiKey,
          gateway_merchant_id: encryptedMerchantId,
          bank_account
        });
      error = result.error;
    }

    if (error) {
      console.error('[SAVE-PAYMENT-SETTINGS] Database error:', error);
      throw error;
    }

    console.log('[SAVE-PAYMENT-SETTINGS] Settings saved successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SAVE-PAYMENT-SETTINGS] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
