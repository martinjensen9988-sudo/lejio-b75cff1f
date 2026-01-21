import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 30 second timeout for AI verification
const AI_TIMEOUT_MS = 30000;

async function verifyWithAI(
  frontImageUrl: string, 
  backImageUrl: string | null, 
  lovableApiKey: string
): Promise<{ result: any; timedOut: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this driver's license image and extract the following information:
1. Full name on the license
2. License number
3. Issue date
4. Expiry date
5. Country of issue
6. License categories/classes
7. Is this a valid driver's license? (true/false)
8. Any concerns or issues with the license (expired, damaged, suspected forgery, etc.)

Return the response as a JSON object with these fields:
{
  "full_name": string,
  "license_number": string,
  "issue_date": string (YYYY-MM-DD format),
  "expiry_date": string (YYYY-MM-DD format),
  "country": string,
  "categories": string[],
  "is_valid": boolean,
  "concerns": string[],
  "confidence_score": number (0-100)
}`
              },
              {
                type: "image_url",
                image_url: { url: frontImageUrl }
              },
              ...(backImageUrl ? [{
                type: "image_url",
                image_url: { url: backImageUrl }
              }] : [])
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.statusText}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    console.log("[LICENSE] AI response:", content);

    // Parse the AI response
    let verificationResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verificationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("[LICENSE] Failed to parse AI response:", parseError);
      verificationResult = {
        is_valid: false,
        concerns: ["Could not automatically verify license"],
        confidence_score: 0,
      };
    }

    return { result: verificationResult, timedOut: false };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.log("[LICENSE] AI verification timed out after 30 seconds");
      return { 
        result: {
          is_valid: false,
          concerns: ["Verification timed out - sent to admin for manual review"],
          confidence_score: 0,
        }, 
        timedOut: true 
      };
    }
    
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { licenseId, frontImageUrl, backImageUrl } = await req.json();

    console.log(`[LICENSE] Starting verification for license: ${licenseId}`);

    // Immediately return response, continue processing in background
    const responsePromise = new Promise<Response>(async (resolve) => {
      try {
        // Call AI with timeout
        const { result: verificationResult, timedOut } = await verifyWithAI(
          frontImageUrl,
          backImageUrl,
          lovableApiKey
        );

        let status: string;
        
        if (timedOut) {
          // Timeout - send to admin for manual review
          status = "pending_admin_review";
          console.log("[LICENSE] Verification timed out, escalating to admin");
        } else {
          // Determine verification status based on AI result
          status = verificationResult.is_valid && 
                     verificationResult.confidence_score >= 70 &&
                     verificationResult.concerns.length === 0
            ? "verified"
            : verificationResult.confidence_score >= 50
              ? "pending_review"
              : "rejected";
        }

        // Update the license record
        const { error: updateError } = await supabase
          .from("driver_licenses")
          .update({
            verification_status: status,
            ai_verification_result: verificationResult,
            license_number: verificationResult.license_number || null,
            expiry_date: verificationResult.expiry_date || null,
            issue_date: verificationResult.issue_date || null,
            verified_at: status === "verified" ? new Date().toISOString() : null,
          })
          .eq("id", licenseId);

        if (updateError) {
          console.error("[LICENSE] Update error:", updateError);
        }

        console.log(`[LICENSE] Verification complete: ${status}`);

        resolve(new Response(
          JSON.stringify({ 
            success: true, 
            status,
            result: verificationResult,
            timedOut,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ));
      } catch (error: any) {
        console.error("[LICENSE] Error in background task:", error);
        
        // On error, set to pending_admin_review so booking can still proceed
        await supabase
          .from("driver_licenses")
          .update({
            verification_status: "pending_admin_review",
            ai_verification_result: { error: error.message, concerns: ["AI verification failed - sent to admin"] },
          })
          .eq("id", licenseId);

        resolve(new Response(
          JSON.stringify({ 
            success: true, 
            status: "pending_admin_review",
            timedOut: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        ));
      }
    });

    return await responsePromise;
  } catch (error: any) {
    console.error("[LICENSE] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
