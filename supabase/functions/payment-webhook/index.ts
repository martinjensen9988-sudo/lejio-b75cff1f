import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature, x-quickpay-checksum-sha256",
};

type PaymentGateway = 'stripe' | 'quickpay' | 'pensopay' | 'reepay' | 'onpay';

interface WebhookEvent {
  gateway: PaymentGateway;
  eventType: string;
  transactionId: string;
  status: 'completed' | 'failed' | 'cancelled' | 'refunded';
  subscriptionId?: string;
  metadata?: Record<string, string>;
}

// Verify Stripe webhook signature using Web Crypto API
async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const elements = signature.split(',');
    const timestamp = elements.find(e => e.startsWith('t='))?.substring(2);
    const v1Signature = elements.find(e => e.startsWith('v1='))?.substring(3);
    
    if (!timestamp || !v1Signature) return false;
    
    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return expectedSignature === v1Signature;
  } catch (e) {
    console.error('Stripe signature verification failed:', e);
    return false;
  }
}

// Verify Quickpay checksum using Web Crypto API
async function verifyQuickpayChecksum(payload: string, checksum: string, apiKey: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(apiKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expectedChecksum = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return expectedChecksum === checksum;
  } catch (e) {
    console.error('Quickpay checksum verification failed:', e);
    return false;
  }
}

// Parse Stripe webhook
function parseStripeWebhook(body: any): WebhookEvent | null {
  const eventType = body.type;
  const data = body.data?.object;
  
  if (!data) return null;
  
  let status: WebhookEvent['status'] = 'completed';
  let parsedEventType = eventType;
  
  switch (eventType) {
    case 'checkout.session.completed':
      status = 'completed';
      break;
    case 'checkout.session.expired':
      status = 'cancelled';
      break;
    case 'payment_intent.payment_failed':
      status = 'failed';
      break;
    case 'charge.refunded':
      status = 'refunded';
      break;
    case 'invoice.payment_succeeded':
      parsedEventType = 'subscription_payment';
      status = 'completed';
      break;
    case 'customer.subscription.deleted':
      parsedEventType = 'subscription_cancelled';
      status = 'cancelled';
      break;
    default:
      return null;
  }
  
  return {
    gateway: 'stripe',
    eventType: parsedEventType,
    transactionId: data.id,
    status,
    subscriptionId: data.subscription,
    metadata: data.metadata,
  };
}

// Parse Quickpay webhook
function parseQuickpayWebhook(body: any): WebhookEvent | null {
  const accepted = body.accepted;
  const state = body.state;
  
  let status: WebhookEvent['status'] = 'completed';
  if (!accepted) status = 'failed';
  if (state === 'cancelled') status = 'cancelled';
  if (state === 'refunded') status = 'refunded';
  
  return {
    gateway: 'quickpay',
    eventType: body.type || 'payment',
    transactionId: body.id?.toString(),
    status,
    metadata: { order_id: body.order_id },
  };
}

// Parse PensoPay webhook (similar to Quickpay)
function parsePensopayWebhook(body: any): WebhookEvent | null {
  return {
    gateway: 'pensopay',
    eventType: body.type || 'payment',
    transactionId: body.id?.toString(),
    status: body.accepted ? 'completed' : 'failed',
    metadata: { order_id: body.order_id },
  };
}

// Parse Reepay webhook
function parseReepayWebhook(body: any): WebhookEvent | null {
  const eventType = body.event_type;
  let status: WebhookEvent['status'] = 'completed';
  
  switch (eventType) {
    case 'invoice_settled':
    case 'invoice_authorized':
      status = 'completed';
      break;
    case 'invoice_failed':
      status = 'failed';
      break;
    case 'invoice_cancelled':
      status = 'cancelled';
      break;
    case 'invoice_refunded':
      status = 'refunded';
      break;
    case 'subscription_cancelled':
      status = 'cancelled';
      break;
    default:
      break;
  }
  
  return {
    gateway: 'reepay',
    eventType,
    transactionId: body.invoice || body.id,
    status,
    subscriptionId: body.subscription,
    metadata: { customer: body.customer },
  };
}

// Parse OnPay webhook
function parseOnpayWebhook(body: any): WebhookEvent | null {
  const status = body.data?.status;
  let mappedStatus: WebhookEvent['status'] = 'completed';
  
  switch (status) {
    case 'active':
    case 'captured':
      mappedStatus = 'completed';
      break;
    case 'declined':
    case 'failed':
      mappedStatus = 'failed';
      break;
    case 'cancelled':
      mappedStatus = 'cancelled';
      break;
    case 'refunded':
      mappedStatus = 'refunded';
      break;
    default:
      break;
  }
  
  return {
    gateway: 'onpay',
    eventType: body.type || 'payment',
    transactionId: body.data?.uuid || body.data?.transaction_number,
    status: mappedStatus,
    metadata: { order_id: body.data?.order_id },
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const gateway = url.searchParams.get('gateway') as PaymentGateway;
    
    if (!gateway) {
      console.error('No gateway specified');
      return new Response(JSON.stringify({ error: 'Gateway parameter required' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    console.log(`Received ${gateway} webhook:`, JSON.stringify(body).slice(0, 500));

    // Parse webhook based on gateway
    let event: WebhookEvent | null = null;
    
    switch (gateway) {
      case 'stripe':
        event = parseStripeWebhook(body);
        break;
      case 'quickpay':
        event = parseQuickpayWebhook(body);
        break;
      case 'pensopay':
        event = parsePensopayWebhook(body);
        break;
      case 'reepay':
        event = parseReepayWebhook(body);
        break;
      case 'onpay':
        event = parseOnpayWebhook(body);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown gateway' }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (!event) {
      console.log('Event not relevant, skipping');
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('Parsed event:', event);

    // Find the transaction by gateway_transaction_id
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .select('*, booking:bookings(*)')
      .eq('gateway_transaction_id', event.transactionId)
      .maybeSingle();

    if (txError) {
      console.error('Error finding transaction:', txError);
    }

    // Map event status to transaction status
    const txStatus = event.status === 'completed' ? 'completed' 
      : event.status === 'failed' ? 'failed'
      : event.status === 'cancelled' ? 'cancelled'
      : event.status === 'refunded' ? 'refunded'
      : 'pending';

    if (transaction) {
      // Update transaction status
      await supabase
        .from('payment_transactions')
        .update({ 
          status: txStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      console.log(`Updated transaction ${transaction.id} to status: ${txStatus}`);

      // Update booking status if payment completed
      if (event.status === 'completed' && transaction.booking_id) {
        await supabase
          .from('bookings')
          .update({ 
            status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.booking_id);

        console.log(`Updated booking ${transaction.booking_id} to confirmed`);
      }

      // Handle refund - update booking status
      if (event.status === 'refunded' && transaction.booking_id) {
        await supabase
          .from('bookings')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.booking_id);

        console.log(`Updated booking ${transaction.booking_id} to cancelled (refunded)`);
      }
    }

    // Handle subscription events
    if (event.subscriptionId) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('gateway_subscription_id', event.subscriptionId)
        .maybeSingle();

      if (subscription) {
        let subscriptionStatus = subscription.status;
        
        if (event.eventType === 'subscription_cancelled') {
          subscriptionStatus = 'cancelled';
        } else if (event.status === 'completed') {
          subscriptionStatus = 'active';
        }

        await supabase
          .from('subscriptions')
          .update({ 
            status: subscriptionStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        console.log(`Updated subscription ${subscription.id} to status: ${subscriptionStatus}`);

        // Log subscription payment as transaction
        if (event.eventType === 'subscription_payment' && event.status === 'completed') {
          await supabase.from('payment_transactions').insert({
            booking_id: subscription.booking_id,
            lessor_id: subscription.lessor_id,
            renter_id: subscription.renter_id,
            gateway: event.gateway,
            gateway_transaction_id: event.transactionId,
            subscription_id: subscription.id,
            amount: subscription.amount,
            currency: subscription.currency,
            status: 'completed',
            type: 'subscription_payment',
            description: `Månedlig betaling for abonnement`,
          });

          console.log('Logged subscription payment transaction');
        }
      }
    }

    return new Response(JSON.stringify({ received: true, processed: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
