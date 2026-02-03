import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

async function testFunction(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Test function called");
  
  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Test function works!" }),
  };
}

app.http("Test", {
  methods: ["GET", "POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: testFunction,
});
