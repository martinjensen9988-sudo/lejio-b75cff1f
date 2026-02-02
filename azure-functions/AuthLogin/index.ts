import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import sql from "mssql";

const dbConfig = {
  server: process.env.SQL_SERVER || "lejio-fri.database.windows.net",
  database: process.env.SQL_DATABASE || "lejio-fri",
  authentication: {
    type: "default",
    options: {
      userName: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Auth login function triggered");

  const { email, password } = req.body;

  if (!email || !password) {
    context.res = {
      status: 400,
      body: { error: "Email and password required" },
    };
    return;
  }

  try {
    // Connect to Azure SQL Database
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();

    // Query user from fri_lessors table
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        `SELECT id, email, company_name, primary_color, subscription_status 
         FROM fri_lessors WHERE email = @email`
      );

    pool.close();

    if (result.recordset.length === 0) {
      context.res = {
        status: 401,
        body: { error: "Invalid credentials" },
      };
      return;
    }

    const lessor = result.recordset[0];

    // In production: verify password hash, create JWT token
    const token = Buffer.from(JSON.stringify({ lessor_id: lessor.id, email })).toString(
      "base64"
    );

    context.res = {
      status: 200,
      body: {
        session: {
          access_token: token,
          user: lessor,
        },
      },
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
