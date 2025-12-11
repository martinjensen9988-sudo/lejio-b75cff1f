import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PaymentGateway = 'stripe' | 'quickpay' | 'pensopay' | 'reepay' | 'onpay' | 'none';

interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency?: string;
  type: 'one_time' | 'subscription';
  returnUrl?: string;
}

interface GatewayConfig {
  gateway: PaymentGateway;
  apiKey: string;
  merchantId: string;
}

interface PaymentResult {
  paymentUrl: string;
  transactionId: string;
  subscriptionId?: string;
}

// Gateway-specific payment creation
async function createStripePayment(config: GatewayConfig, request: PaymentRequest, customerEmail: string) {
  const stripe = await import("https://esm.sh/stripe@14.21.0");
  const stripeClient = new stripe.default(config.apiKey, {
    apiVersion: '2023-10-16',
  });

  if (request.type === 'subscription') {
    // Create a checkout session for subscription
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency: request.currency?.toLowerCase() || 'dkk',
          product_data: {
            name: `Månedlig leje - Booking ${request.bookingId.slice(0, 8)}`,
          },
          unit_amount: Math.round(request.amount * 100),
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      }],
      success_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=success',
      cancel_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=cancelled',
      metadata: {
        booking_id: request.bookingId,
      },
    });

    return {
      paymentUrl: session.url,
      transactionId: session.id,
      subscriptionId: session.subscription,
    };
  } else {
    // One-time payment
    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency: request.currency?.toLowerCase() || 'dkk',
          product_data: {
            name: `Leje - Booking ${request.bookingId.slice(0, 8)}`,
          },
          unit_amount: Math.round(request.amount * 100),
        },
        quantity: 1,
      }],
      success_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=success',
      cancel_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=cancelled',
      metadata: {
        booking_id: request.bookingId,
      },
    });

    return {
      paymentUrl: session.url,
      transactionId: session.id,
    };
  }
}

async function createQuickpayPayment(config: GatewayConfig, request: PaymentRequest, customerEmail: string) {
  // Quickpay API integration
  const authHeader = `Basic ${btoa(`:${config.apiKey}`)}`;
  
  // Create payment
  const paymentResponse = await fetch('https://api.quickpay.net/payments', {
    method: 'POST',
    headers: {
      'Accept-Version': 'v10',
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: request.bookingId.replace(/-/g, '').slice(0, 20),
      currency: request.currency || 'DKK',
    }),
  });

  if (!paymentResponse.ok) {
    const error = await paymentResponse.text();
    console.error('Quickpay create payment error:', error);
    throw new Error(`Quickpay error: ${error}`);
  }

  const payment = await paymentResponse.json();

  // Create payment link
  const linkResponse = await fetch(`https://api.quickpay.net/payments/${payment.id}/link`, {
    method: 'PUT',
    headers: {
      'Accept-Version': 'v10',
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(request.amount * 100),
      continue_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=success',
      cancel_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=cancelled',
      customer_email: customerEmail,
    }),
  });

  if (!linkResponse.ok) {
    const error = await linkResponse.text();
    console.error('Quickpay create link error:', error);
    throw new Error(`Quickpay link error: ${error}`);
  }

  const link = await linkResponse.json();

  return {
    paymentUrl: link.url,
    transactionId: payment.id.toString(),
  };
}

async function createPensopayPayment(config: GatewayConfig, request: PaymentRequest, customerEmail: string) {
  // PensoPay uses same API as Quickpay (they are related)
  const authHeader = `Basic ${btoa(`:${config.apiKey}`)}`;
  
  const paymentResponse = await fetch('https://api.pensopay.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: request.bookingId.replace(/-/g, '').slice(0, 20),
      currency: request.currency || 'DKK',
      amount: Math.round(request.amount * 100),
    }),
  });

  if (!paymentResponse.ok) {
    const error = await paymentResponse.text();
    console.error('PensoPay error:', error);
    throw new Error(`PensoPay error: ${error}`);
  }

  const payment = await paymentResponse.json();

  return {
    paymentUrl: payment.link?.url || payment.payment_link,
    transactionId: payment.id?.toString(),
  };
}

async function createReepayPayment(config: GatewayConfig, request: PaymentRequest, customerEmail: string) {
  // Reepay API
  const authHeader = `Basic ${btoa(`${config.apiKey}:`)}`;
  
  if (request.type === 'subscription') {
    // Create subscription session
    const response = await fetch('https://checkout-api.reepay.com/v1/session/subscription', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        configuration: {
          accept_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=success',
          cancel_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=cancelled',
        },
        subscription: {
          plan: 'monthly_rental',
          customer: {
            email: customerEmail,
            handle: request.bookingId,
          },
        },
        order: {
          handle: request.bookingId,
          amount: Math.round(request.amount * 100),
          currency: request.currency || 'DKK',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Reepay error:', error);
      throw new Error(`Reepay error: ${error}`);
    }

    const session = await response.json();
    return {
      paymentUrl: session.url,
      transactionId: session.id,
      subscriptionId: session.subscription,
    };
  } else {
    // One-time charge session
    const response = await fetch('https://checkout-api.reepay.com/v1/session/charge', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        configuration: {
          accept_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=success',
          cancel_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=cancelled',
        },
        order: {
          handle: request.bookingId,
          amount: Math.round(request.amount * 100),
          currency: request.currency || 'DKK',
          customer: {
            email: customerEmail,
            handle: `customer_${request.bookingId}`,
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Reepay error:', error);
      throw new Error(`Reepay error: ${error}`);
    }

    const session = await response.json();
    return {
      paymentUrl: session.url,
      transactionId: session.id,
    };
  }
}

async function createOnpayPayment(config: GatewayConfig, request: PaymentRequest, customerEmail: string) {
  // OnPay API
  const response = await fetch('https://api.onpay.io/v1/transaction', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(request.amount * 100),
      currency: request.currency || 'DKK',
      order_id: request.bookingId.slice(0, 36),
      accept_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=success',
      decline_url: request.returnUrl || 'https://lejio.dk/my-rentals?payment=cancelled',
      type: 'payment',
      "3dsecure": true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OnPay error:', error);
    throw new Error(`OnPay error: ${error}`);
  }

  const transaction = await response.json();
  return {
    paymentUrl: transaction.data?.payment_window_url || transaction.payment_url,
    transactionId: transaction.data?.uuid || transaction.id,
  };
}

// Gateway switch
async function processPayment(
  gateway: PaymentGateway,
  config: GatewayConfig,
  request: PaymentRequest,
  customerEmail: string
): Promise<PaymentResult> {
  console.log(`Processing ${request.type} payment via ${gateway} for ${request.amount} ${request.currency || 'DKK'}`);

  switch (gateway) {
    case 'stripe':
      return createStripePayment(config, request, customerEmail);
    case 'quickpay':
      return createQuickpayPayment(config, request, customerEmail);
    case 'pensopay':
      return createPensopayPayment(config, request, customerEmail);
    case 'reepay':
      return createReepayPayment(config, request, customerEmail);
    case 'onpay':
      return createOnpayPayment(config, request, customerEmail);
    default:
      throw new Error(`Unsupported gateway: ${gateway}`);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { bookingId, returnUrl }: { bookingId: string; returnUrl?: string } = await req.json();

    console.log(`Processing payment for booking: ${bookingId}`);

    // Fetch booking with vehicle and lessor profile
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(*),
        lessor:profiles!bookings_lessor_id_fkey1(*)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Booking not found:', bookingError);
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const vehicle = booking.vehicle;
    const lessor = booking.lessor;

    if (!lessor) {
      return new Response(JSON.stringify({ error: 'Lessor profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if lessor has payment gateway configured
    const gateway = lessor.payment_gateway as PaymentGateway;
    if (!gateway || gateway === 'none') {
      // P2P mode - LEJIO handles payment
      console.log('No gateway configured, using P2P mode');
      return new Response(JSON.stringify({ 
        success: true, 
        mode: 'p2p',
        message: 'Betaling håndteres af LEJIO' 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!lessor.gateway_api_key) {
      return new Response(JSON.stringify({ error: 'Gateway API key not configured' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config: GatewayConfig = {
      gateway,
      apiKey: lessor.gateway_api_key,
      merchantId: lessor.gateway_merchant_id || '',
    };

    // Determine payment type based on vehicle settings
    const paymentType = vehicle.payment_schedule === 'monthly' ? 'subscription' : 'one_time';

    const paymentRequest: PaymentRequest = {
      bookingId,
      amount: booking.total_price,
      currency: 'DKK',
      type: paymentType,
      returnUrl,
    };

    // Process payment
    const result = await processPayment(
      gateway,
      config,
      paymentRequest,
      booking.renter_email
    );

    console.log('Payment created:', result);

    // Log transaction
    await supabase.from('payment_transactions').insert({
      booking_id: bookingId,
      lessor_id: booking.lessor_id,
      renter_id: booking.renter_id,
      gateway,
      gateway_transaction_id: result.transactionId,
      amount: booking.total_price,
      currency: 'DKK',
      status: 'pending',
      type: paymentType === 'subscription' ? 'subscription_start' : 'payment',
      description: `Betaling for booking ${bookingId.slice(0, 8)}`,
    });

    // If subscription, create subscription record
    if (paymentType === 'subscription' && result.subscriptionId) {
      await supabase.from('subscriptions').insert({
        booking_id: bookingId,
        vehicle_id: vehicle.id,
        lessor_id: booking.lessor_id,
        renter_id: booking.renter_id,
        gateway,
        gateway_subscription_id: result.subscriptionId,
        amount: vehicle.monthly_price || booking.total_price,
        currency: 'DKK',
        interval: 'month',
        status: 'pending',
      });
    }

    return new Response(JSON.stringify({
      success: true,
      paymentUrl: result.paymentUrl,
      transactionId: result.transactionId,
      subscriptionId: result.subscriptionId,
      paymentType,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error processing payment:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);