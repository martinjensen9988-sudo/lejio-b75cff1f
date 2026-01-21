import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function decodeBase64ToUint8Array(base64: string): Uint8Array {
  const cleaned = base64.includes(",") ? base64.split(",")[1] : base64;
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Backend not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify the caller via their Authorization header
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { vehicleId, imageBase64, contentType, fileExt } = await req.json();
    if (!vehicleId || !imageBase64) {
      return new Response(
        JSON.stringify({ error: "Missing vehicleId or image" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const service = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const userId = userData.user.id;

    // Authorization: owner OR admin/support roles
    const [{ data: vehicle }, { data: roles }]: any = await Promise.all([
      service.from("vehicles").select("owner_id").eq("id", vehicleId).maybeSingle(),
      service
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .in("role", ["support", "admin", "super_admin"]),
    ]);

    const isAdmin = Array.isArray(roles) && roles.length > 0;
    const ownerId = vehicle?.owner_id as string | undefined;
    const isOwner = !!ownerId && ownerId === userId;

    if (!isOwner && !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bytes = decodeBase64ToUint8Array(imageBase64);
    const ext = typeof fileExt === "string" && fileExt.trim() ? fileExt.trim() : "jpg";
    const safeContentType = typeof contentType === "string" && contentType.startsWith("image/")
      ? contentType
      : "image/jpeg";

    const objectPath = `${vehicleId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await service.storage
      .from("vehicle-images")
      .upload(objectPath, bytes, { upsert: true, contentType: safeContentType });

    if (uploadErr) {
      console.error("upload-vehicle-image upload error", uploadErr);
      return new Response(
        JSON.stringify({ error: "Upload failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: urlData } = service.storage.from("vehicle-images").getPublicUrl(objectPath);

    return new Response(
      JSON.stringify({ success: true, publicUrl: urlData.publicUrl, objectPath }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in upload-vehicle-image:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
