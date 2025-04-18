require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
const { getAsync, setAsync } = require('./redis');
const WebSocket = require('ws');
const http = require('http');
const bcrypt = require("bcrypt");

const app = express();
app.use(cors()); 
const messageRoutes = require("./routes");
const DEFAULT_PORT = parseInt(process.env.PORT) || 3000;

// ✅ Express Middleware
app.use(express.json());

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error during signup' });
    }
  }

  
});


app.use(express.static(path.join(__dirname, "linkedin-react/build")));
app.use("/api/messages", messageRoutes);




// ✅ Postgres setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Postgres connected"))
  .catch(err => console.error("❌ DB Connection Error", err));

// ✅ Messages API
app.get('/api/messages', async (req, res) => {
  try {
    const cachedMessages = await getAsync('all_messages');
    if (cachedMessages) return res.json(JSON.parse(cachedMessages));

    const response = await elasticClient.search({
      index: 'linkedin_messages',
      body: {
        query: { match_all: {} },
        sort: [{ timestamp: 'desc' }]
      }
    });

    const messages = response.body.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    await setAsync('all_messages', JSON.stringify(messages), 'EX', 300);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ✅ Frontend fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "linkedin-react/build", "index.html"));
});

// ✅ Auto delete old low-priority messages
async function deleteOldLowPriorityMessages() {
  try {
    await pool.query("DELETE FROM messages WHERE category = 'Low Priority' AND received_at < NOW() - INTERVAL '7 days'");
    console.log("✅ Old low-priority messages deleted.");
  } catch (err) {
    console.error("❌ Error deleting old messages:", err);
  }
}
setInterval(deleteOldLowPriorityMessages, 24 * 60 * 60 * 1000);

// ✅ WebSocket + server setup with dynamic port
function tryListen(port) {
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', ws => {
    console.log("Client connected via WebSocket");
    ws.send(JSON.stringify({ user: "System", text: "Connected to WebSocket server!" }));

    const interval = setInterval(() => {
      const message = {
        user: "Recruiter A",
        text: "We have an exciting opportunity for you!",
        id: Math.random()
      };
      ws.send(JSON.stringify(message));
    }, 5000);

    ws.on('close', () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });

  server.listen(port, () => {
    console.log(`🚀 Server (Express + WebSocket) running on port ${port}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠ Port ${port} in use. Trying port ${port + 1}...`);
      tryListen(port + 1);
    } else {
      console.error("❌ Server error:", err);
    }
  });
}

console.log(`WebSocket + Express server initializing on port ${DEFAULT_PORT}`);

//login postman

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // 🔍 For now, just check with some hardcoded dummy values
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({
      message: 'Login successful!',
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }


});

tryListen(DEFAULT_PORT);



