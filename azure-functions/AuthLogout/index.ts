import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Auth logout function triggered");

  try {
    // Simply confirm logout (token is handled by client)
    context.res = {
      status: 200,
      body: { message: "Logged out successfully" },
    };
  } catch (error) {
    context.log.error("Auth error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
};

export default httpTrigger;
