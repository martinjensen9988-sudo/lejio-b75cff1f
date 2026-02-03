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
      return;
    }

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
      return;
    }

    const user = result.recordset[0];
    const token = generateToken(user.id, user.email);

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
  } catch (err) {
    context.res.status = 500;
    context.res.body = { error: err.message };
  }
};
