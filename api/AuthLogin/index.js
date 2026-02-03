const sql = require('mssql');

const dbConfig = {
  server: process.env.MSSQL_SERVER || "lejio-fri.database.windows.net",
  database: process.env.MSSQL_DATABASE || "lejio-fri",
  authentication: {
    type: "default",
    options: {
      userName: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

function generateToken(userId, email) {
  return Buffer.from(JSON.stringify({ 
    lessor_id: userId, 
    email,
    iat: Date.now()
  })).toString("base64");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

module.exports = async function (context, req) {
  context.log("Auth login function triggered");

  try {
    const body = req.body || {};
    const { email, password } = body;

    if (!email) {
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Email is required" }),
      };
      return;
    }

    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();

    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(
        `SELECT id, email, company_name FROM fri_lessors WHERE email = @email`
      );

    await pool.close();

    if (result.recordset.length === 0 || password !== "test") {
      context.res = {
        status: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid email or password" }),
      };
      return;
    }

    const lessor = result.recordset[0];
    const token = generateToken(lessor.id, lessor.email);

    context.res = {
      status: 200,
      headers: corsHeaders,
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
    context.log.error("Auth error:", error);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error", details: String(error) }),
    };
  }
};
