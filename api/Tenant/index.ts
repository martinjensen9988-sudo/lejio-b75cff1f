import { AzureFunction, Context, HttpRequest } from "@azure/functions";
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

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log("Get tenant function triggered");

  try {
    const subdomain = req.query.get("subdomain");

    if (!subdomain) {
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Subdomain parameter required" }),
      };
      return;
    }

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();

    const result = await pool
      .request()
      .input("email", sql.VarChar, `test-${subdomain}@lejio.dk`)
      .query(
        `SELECT id, company_name as name, primary_color as primaryColor
         FROM fri_lessors WHERE email = @email`
      );

    await pool.close();

    if (result.recordset.length === 0) {
      context.res = {
        status: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Tenant not found" }),
      };
      return;
    }

    const tenantData = result.recordset[0];

    context.res = {
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
    context.log.error("Tenant error:", error);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error", details: String(error) }),
    };
  }
};

export default httpTrigger;
