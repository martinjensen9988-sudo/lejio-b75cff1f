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

// Simple token generation (in production, use JWT)
function generateToken(userId: string, email: string): string {
  return Buffer.from(JSON.stringify({ 
    lessor_id: userId, 
    email,
    iat: Date.now()
  })).toString("base64");
}

async function authLogin(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Auth login function triggered");

  try {
    const body = (await request.json()) as any;
    const { email, password } = body;

    if (!email || !password) {
      return {
        status: 400,
        body: JSON.stringify({ error: "Email and password required" }),
      };
    }

    // Connect to Azure SQL Database
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();

    // Query user from fri_lessors table
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        `SELECT id, email, company_name, primary_color, subscription_status, password_hash
         FROM fri_lessors WHERE email = @email`
      );

    pool.close();

    if (result.recordset.length === 0) {
      return {
        status: 401,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
    }

    const lessor = result.recordset[0];

    // In production: verify password hash using bcrypt or similar
    // For now, accept any password (should be improved)
    const token = generateToken(lessor.id, lessor.email);

    return {
      status: 200,
      body: JSON.stringify({
        session: {
          access_token: token,
          user: {
            id: lessor.id,
            email: lessor.email,
            company_name: lessor.company_name,
          },
        },
      }),
    };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

app.http("AuthLogin", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: authLogin,
});
