const sql = require('mssql');

const dbConfig = {
  server: process.env.MSSQL_SERVER || "lejio-fri-db.database.windows.net",
  database: process.env.MSSQL_DATABASE || "lejio-fri",
  authentication: {
    type: "default",
    options: {
      userName: process.env.MSSQL_USER || "lejio_admin",
      password: process.env.MSSQL_PASSWORD || "P@ssw0rd123",
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

// Mock test users for development
const testUsers = {
  "martin@lejio.dk": { id: 1, email: "martin@lejio.dk", company_name: "Lejio Test" },
  "test@example.com": { id: 2, email: "test@example.com", company_name: "Test Company" },
};

module.exports = async function (context, req) {
  context.res.headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const { email, password } = (req.body || {});

    if (!email) {
      context.res.status = 400;
      context.res.body = { error: "Email required" };
      return context.res;
    }

    // Check test users first
    if (testUsers[email] && password === "test") {
      const user = testUsers[email];
      const token = generateToken(user.id, user.email);
      context.res.status = 200;
      context.res.body = {
        session: {
          access_token: token,
          user: {
            id: user.id,
            email: user.email,
            company_name: user.company_name,
          },
        },
      };
      return context.res;
    }

    // Try database if available
    try {
      const pool = new sql.ConnectionPool(dbConfig);
      await pool.connect();

      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(`SELECT id, email, company_name FROM fri_lessors WHERE email = @email`);

      await pool.close();

      if (result.recordset.length === 0 || password !== "test") {
        context.res.status = 401;
        context.res.body = { error: "Invalid credentials" };
        return context.res;
      }

      const user = result.recordset[0];
      const token = generateToken(user.id, user.email);

      context.res.status = 200;
      context.res.body = {
        session: {
          access_token: token,
          user: {
            id: user.id,
            email: user.email,
            company_name: user.company_name,
          },
        },
      };
      return context.res;
    } catch (dbErr) {
      // Database not available, reject login
      context.res.status = 401;
      context.res.body = { error: "Database unavailable" };
      return context.res;
    }
  } catch (err) {
    context.res.status = 500;
    context.res.body = { error: err.message };
    return context.res;
  }
};
