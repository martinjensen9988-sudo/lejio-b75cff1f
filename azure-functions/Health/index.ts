import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Health check request received.');

    context.res = {
        status: 200,
        body: {
            status: "ok",
            timestamp: new Date().toISOString(),
            message: "Lejio Fri Azure Functions - Health Check"
        }
    };
};

export default httpTrigger;
