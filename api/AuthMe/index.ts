import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

async function authMe(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Auth me function triggered");

  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return {
        status: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "No authorization header" }),
      };
    }

    // Extract token from "Bearer token"
    const token = authHeader.replace("Bearer ", "");
    
    try {
      // Decode token
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      
      return {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          id: decoded.lessor_id,
          email: decoded.email,
        }),
      };
    } catch {
      return {
        status: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }
  } catch (error) {
    context.error("Auth error:", error);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

app.http("AuthMe", {
  methods: ["GET", "POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: authMe,
});
