import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import sql from "mssql";

const dbConfig = {
  server: process.env.MSSQL_SERVER || "sql-vqiibdafjcmnc-dev.database.windows.net",
  database: process.env.MSSQL_DATABASE || "lejio-fri",
  authentication: {
    type: "default" as any,
    options: {
      userName: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
} as any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

async function getTenant(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Get tenant function triggered");

  try {
    const subdomain = request.query.get("subdomain");

    if (!subdomain) {
      return {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Subdomain parameter required" }),
      };
    }

    // Connect to Azure SQL Database
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();

    // Query tenant from fri_lessors table
    // For now, we use company_name as tenant name
    const result = await pool
      .request()
      .input("email", sql.VarChar, `test-${subdomain}@lejio.dk`)
      .query(
        `SELECT id, company_name as name, primary_color as primaryColor
         FROM fri_lessors WHERE email = @email LIMIT 1`
      );

    await pool.close();

    if (result.recordset.length === 0) {
      return {
        status: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Tenant not found" }),
      };
    }

    const tenantData = result.recordset[0];

    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        id: tenantData.id,
        name: tenantData.name,
        slug: subdomain,
        subdomain: subdomain,
        domain: `${subdomain}.lejio-fri.dk`,
        plan: "trial",
        status: "active",
        ownerEmail: `test-${subdomain}@lejio.dk`,
        primaryColor: tenantData.primaryColor || "#ec4899",
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    };
  } catch (error) {
    context.error("Tenant error:", error);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error", details: String(error) }),
    };
  }
}

app.http("Tenant", {
  methods: ["GET", "POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: getTenant,
});
