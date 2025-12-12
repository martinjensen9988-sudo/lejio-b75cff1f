import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContractRequest {
  bookingId: string;
  vehicleValue?: number;
  renterLicenseNumber?: string;
  depositAmount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { bookingId, vehicleValue, renterLicenseNumber, depositAmount }: ContractRequest = await req.json();

    if (!bookingId) {
      return new Response(JSON.stringify({ error: 'Booking ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Creating contract for booking: ${bookingId}`);

    // Fetch booking with vehicle data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Booking fetch error:', bookingError);
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user is the lessor
    if (booking.lessor_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch lessor profile
    const { data: lessorProfile, error: lessorError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (lessorError) {
      console.error('Lessor profile error:', lessorError);
    }

    // Generate contract number
    const { data: contractNumber, error: numError } = await supabase
      .rpc('generate_contract_number');

    if (numError) {
      console.error('Contract number error:', numError);
      return new Response(JSON.stringify({ error: 'Failed to generate contract number' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const vehicle = booking.vehicle;
    const calculatedVehicleValue = vehicleValue || 150000; // Default value if not provided

    // Create contract record
    const contractData = {
      booking_id: bookingId,
      vehicle_id: booking.vehicle_id,
      lessor_id: user.id,
      renter_id: booking.renter_id,
      contract_number: contractNumber,
      contract_type: lessorProfile?.user_type === 'professionel' ? 'business' : 'standard',
      
      // Vehicle details
      vehicle_registration: vehicle.registration,
      vehicle_make: vehicle.make,
      vehicle_model: vehicle.model,
      vehicle_year: vehicle.year,
      vehicle_vin: vehicle.vin,
      vehicle_value: calculatedVehicleValue,
      
      // Rental terms
      start_date: booking.start_date,
      end_date: booking.end_date,
      daily_price: vehicle.daily_price || 499,
      included_km: vehicle.included_km || 100,
      extra_km_price: vehicle.extra_km_price || 2.50,
      total_price: booking.total_price,
      deposit_amount: depositAmount || 2500,
      
      // Lessor details
      lessor_name: lessorProfile?.full_name || user.email,
      lessor_email: lessorProfile?.email || user.email,
      lessor_phone: lessorProfile?.phone,
      lessor_address: lessorProfile?.address ? 
        `${lessorProfile.address}, ${lessorProfile.postal_code} ${lessorProfile.city}` : null,
      lessor_company_name: lessorProfile?.company_name,
      lessor_cvr: lessorProfile?.cvr_number,
      
      // Renter details
      renter_name: booking.renter_name || 'Afventer lejer',
      renter_email: booking.renter_email || '',
      renter_phone: booking.renter_phone,
      renter_license_number: renterLicenseNumber,
      
      // Insurance
      insurance_company: lessorProfile?.insurance_company,
      insurance_policy_number: lessorProfile?.insurance_policy_number,
      deductible_amount: 5000,
      
      // Vanvidskørsel
      vanvidskørsel_accepted: false,
      vanvidskørsel_liability_amount: calculatedVehicleValue,
      
      // Roadside assistance
      roadside_assistance_provider: lessorProfile?.roadside_assistance_provider || null,
      roadside_assistance_phone: lessorProfile?.roadside_assistance_phone || null,
      
      // Fuel policy
      fuel_policy_enabled: lessorProfile?.fuel_policy_enabled || false,
      fuel_missing_fee: lessorProfile?.fuel_missing_fee || 0,
      fuel_price_per_liter: lessorProfile?.fuel_price_per_liter || 0,
      
      status: 'pending_renter_signature',
    };

    const { data: contract, error: insertError } = await supabase
      .from('contracts')
      .insert(contractData)
      .select()
      .single();

    if (insertError) {
      console.error('Contract insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to create contract', details: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Contract created: ${contract.id}`);

    return new Response(JSON.stringify({ contract }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-contract function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
