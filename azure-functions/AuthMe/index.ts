import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Auth me function triggered");

  try {
    // Get authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      context.res = {
        status: 401,
        body: { error: "No authorization header" },
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
        body: {
          id: decoded.lessor_id,
          email: decoded.email,
        },
      };
    } catch {
      context.res = {
        status: 401,
        body: { error: "Invalid token" },
      };
    }
  } catch (error) {
    context.log.error("Auth error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
};

export default httpTrigger;
