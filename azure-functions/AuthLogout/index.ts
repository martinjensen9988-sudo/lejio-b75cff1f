import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

async function authLogout(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Auth logout function triggered");

  try {
    // Simply confirm logout (token is handled by client)
    return {
      status: 200,
      body: JSON.stringify({ message: "Logged out successfully" }),
    };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

app.http("AuthLogout", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: authLogout,
});
