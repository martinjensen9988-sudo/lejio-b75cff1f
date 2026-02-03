const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

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

// Test endpoint
app.get('/api/Test', (req, res) => {
  res.json({ message: "Test function works!" });
});

// Auth endpoints
app.post('/api/AuthLogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
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
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const lessor = result.recordset[0];
    const token = generateToken(lessor.id, lessor.email);

    res.json({
      session: {
        access_token: token,
        user: {
          id: lessor.id,
          email: lessor.email,
          company_name: lessor.company_name,
        },
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

app.get('/api/AuthMe', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      res.json({
        id: decoded.lessor_id,
        email: decoded.email,
      });
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/AuthLogout', (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 7071;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
