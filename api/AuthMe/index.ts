import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log("Auth me function triggered");

  try {
    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      context.res = {
        status: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "No authorization header" }),
      };
      return;
    }

    // Extract token from "Bearer token"
    const token = authHeader.replace("Bearer ", "");
    
    try {
      // Decode token
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      
      context.res = {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          id: decoded.lessor_id,
          email: decoded.email,
        }),
      };
    } catch {
      context.res = {
        status: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }
  } catch (error) {
    context.log.error("Auth error:", error);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export default httpTrigger;
