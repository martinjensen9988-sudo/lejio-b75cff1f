import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

async function authLogout(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Auth logout function triggered");

  try {
    // Simply confirm logout (token is handled by client)
    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Logged out successfully" }),
    };
  } catch (error) {
    context.error("Auth error:", error);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

app.http("AuthLogout", {
  methods: ["GET", "POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: authLogout,
});
