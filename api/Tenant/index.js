module.exports = async function (context, req) {
  const subdomain = req.query.subdomain;

  if (!subdomain) {
    context.res = {
      status: 400,
      body: { error: "Subdomain required" }
    };
    return context.res;
  }

  // Mock tenant response for testing
  // In production, fetch from database
  context.res = {
    status: 200,
    body: {
      id: "tenant-" + subdomain,
      name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1),
      slug: subdomain,
      subdomain: subdomain,
      domain: subdomain + ".lejio-fri.dk",
      plan: "starter",
      status: "active",
      ownerEmail: "owner@" + subdomain + ".lejio-fri.dk",
      primaryColor: "#e91e63",
      trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  };
  
  return context.res;
};
