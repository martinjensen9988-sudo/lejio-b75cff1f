import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log("Auth logout function triggered");

  try {
    // Simply confirm logout (token is handled by client)
    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Logged out successfully" }),
    };
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
