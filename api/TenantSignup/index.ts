import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import sql from "mssql";

const dbConfig = {
  server: process.env.MSSQL_SERVER || "lejio-fri.database.windows.net",
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

async function tenantSignup(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Tenant signup function triggered");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  try {
    const body = (await request.json()) as any;
    const { company_name, contact_name, contact_email, password, phone, industry, company_size } = body;

    if (!company_name || !contact_email || !password) {
      return {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();

    // Create subdomain from company name
    const subdomain = company_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Insert new tenant
    const result = await pool
      .request()
      .input('name', sql.VarChar, company_name)
      .input('subdomain', sql.VarChar, subdomain)
      .input('contact_name', sql.VarChar, contact_name || null)
      .input('contact_email', sql.VarChar, contact_email)
      .input('contact_phone', sql.VarChar, phone || null)
      .input('industry', sql.VarChar, industry || null)
      .input('company_size', sql.VarChar, company_size || null)
      .input('plan', sql.VarChar, 'free')
      .input('status', sql.VarChar, 'active')
      .input('password_hash', sql.VarChar, Buffer.from(password).toString('base64'))
      .query(`
        INSERT INTO fri_lessors 
        (name, subdomain, contact_name, contact_email, contact_phone, industry, company_size, plan, status, password_hash)
        OUTPUT INSERTED.*
        VALUES (@name, @subdomain, @contact_name, @contact_email, @contact_phone, @industry, @company_size, @plan, @status, @password_hash)
      `);

    await pool.close();

    return {
      status: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        id: result.recordset[0].id,
        name: result.recordset[0].name,
        subdomain: result.recordset[0].subdomain,
        message: 'Tenant created successfully'
      }),
    };
  } catch (error) {
    context.error("Signup error:", error);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create tenant", details: String(error) }),
    };
  }
}

app.http("TenantSignup", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: tenantSignup,
});
