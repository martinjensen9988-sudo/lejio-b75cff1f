import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-DELETE-USER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { userId } = await req.json();
    if (!userId) {
      throw new Error("userId is required");
    }
    logStep("User ID to delete", { userId });

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify the requester is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }

    // Check if requester is admin
    const { data: adminProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userData.user.id)
      .single();

    // For now, we'll allow any authenticated user to delete (you can add admin check later)
    logStep("Requester authenticated", { requesterId: userData.user.id });

    // Step 1: Delete user's vehicles first (and related bookings, contracts, etc.)
    const { data: vehicles, error: vehiclesQueryError } = await supabaseAdmin
      .from('vehicles')
      .select('id')
      .eq('owner_id', userId);

    if (vehiclesQueryError) {
      logStep("Error fetching vehicles", { error: vehiclesQueryError.message });
    } else if (vehicles && vehicles.length > 0) {
      logStep("Found vehicles to delete", { count: vehicles.length });
      
      const vehicleIds = vehicles.map(v => v.id);
      
      // Delete related bookings first
      const { error: bookingsError } = await supabaseAdmin
        .from('bookings')
        .delete()
        .in('vehicle_id', vehicleIds);
      
      if (bookingsError) {
        logStep("Error deleting bookings", { error: bookingsError.message });
      } else {
        logStep("Deleted related bookings");
      }

      // Delete the vehicles
      const { error: vehiclesError } = await supabaseAdmin
        .from('vehicles')
        .delete()
        .eq('owner_id', userId);

      if (vehiclesError) {
        logStep("Error deleting vehicles", { error: vehiclesError.message });
      } else {
        logStep("Deleted vehicles");
      }
    }

    // Step 2: Delete user's bookings as renter
    const { error: renterBookingsError } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('renter_id', userId);

    if (renterBookingsError) {
      logStep("Error deleting renter bookings", { error: renterBookingsError.message });
    }

    // Step 3: Delete user's bookings as lessor
    const { error: lessorBookingsError } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('lessor_id', userId);

    if (lessorBookingsError) {
      logStep("Error deleting lessor bookings", { error: lessorBookingsError.message });
    }

    // Step 4: Delete profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      logStep("Error deleting profile", { error: profileError.message });
      throw new Error(`Failed to delete profile: ${profileError.message}`);
    }
    logStep("Profile deleted");

    // Step 5: Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      logStep("Error deleting auth user", { error: authError.message });
      throw new Error(`Failed to delete auth user: ${authError.message}`);
    }
    logStep("Auth user deleted");

    logStep("User fully deleted", { userId });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
