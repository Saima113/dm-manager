const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const axios = require("axios");
const natural = require("natural");
const Filter = require("bad-words");
const filter = new Filter();

// Controllers
const { saveMessage, getMessages } = require('./controllers/messageController');

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helpers
const categorizeMessage = (text) => {
  const highPriorityKeywords = ["resume", "cv", "job", "hire", "apply", "project", "opportunity"];
  const lowPriorityKeywords = ["hello", "hi", "buy", "offer", "discount"];

  for (let word of highPriorityKeywords) {
    if (text.toLowerCase().includes(word)) return "High Priority";
  }
  for (let word of lowPriorityKeywords) {
    if (text.toLowerCase().includes(word)) return "Low Priority";
  }
  return "Normal";
};

const spamKeywords = ["discount", "offer", "buy now", "limited time", "earn money"];
const isSpam = (message) => {
  if (filter.isProfane(message)) return true;
  return spamKeywords.some((word) => message.toLowerCase().includes(word));
};

// Hugging Face setup for intent classification
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
const INTENT_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

const classifyIntent = async (text) => {
  try {
    const response = await axios.post(
      INTENT_API_URL,
      {
        inputs: text,
        parameters: {
          candidate_labels: ["job offer", "spam", "event invite", "greeting", "query"]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
        },
      }
    );
    const topLabel = response.data?.[0]?.labels?.[0] || "unknown";
    return topLabel;
  } catch (err) {
    console.error("Intent classification error:", err.message);
    return "unknown";
  }
};

// POST: Store a message
router.post("/api/messages", async (req, res) => {
  try {
    const { sender_name, message_text } = req.body;

    if (isSpam(message_text)) {
      return res.status(400).json({ error: "Message detected as spam and not stored." });
    }

    const priority = categorizeMessage(message_text);
    const intent = await classifyIntent(message_text);

    const result = await pool.query(
      "INSERT INTO messages (sender_name, message_text, priority, intent) VALUES ($1, $2, $3, $4) RETURNING *",
      [sender_name, message_text, priority, intent]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All messages
router.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY received_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Search messages
router.get("/api/messages/search", async (req, res) => {
  try {
    const query = req.query.query;
    const result = await pool.query(
      `SELECT * FROM messages WHERE message_text ILIKE $1 ORDER BY received_at DESC`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LinkedIn OAuth
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/linkedin/callback";

router.get("/auth/linkedin/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing!" });
  }

  try {
    const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = tokenResponse.data.access_token;
    res.json({ access_token: accessToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to get access token" });
  }
});

// LinkedIn user info
router.get("/auth/linkedin/user", async (req, res) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token required!" });
  }

  try {
    const userProfile = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(userProfile.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});
//signup
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({ message: 'Signup successful!' });
});

module.exports = router;