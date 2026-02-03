module.exports = async function (context, req) {
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
