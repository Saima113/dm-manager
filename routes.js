const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Store a new message

const natural = require("natural");

function categorizeMessage(text) {
    const highPriorityKeywords = ["resume", "cv", "job", "hire", "apply", "project", "opportunity"];
    const lowPriorityKeywords = ["hello", "hi", "buy", "offer", "discount"];
    
    for (let word of highPriorityKeywords) {
        if (text.toLowerCase().includes(word)) return "High Priority";
    }
    for (let word of lowPriorityKeywords) {
        if (text.toLowerCase().includes(word)) return "Low Priority";
    }
    return "Normal";
}

const Filter = require("bad-words");
const filter = new Filter();
const cleanMessage = filter.clean("This is a shitty message");
console.log(cleanMessage); // Output: "This is a **** message"

const spamKeywords = ["discount", "offer", "buy now", "limited time", "earn money"];

function isSpam(message) {
  if (filter.isProfane(message)) return true;
  return spamKeywords.some((word) => message.toLowerCase().includes(word));
}


router.post("/", async (req, res) => {
  try {
    const { sender_name, message_text } = req.body;

    // 🚨 Check if message is spam
    if (isSpam(message_text)) {
      return res.status(400).json({ error: "Message detected as spam and not stored." });
  }

  const category = categorizeMessage(message_text);
    const result = await pool.query(
      "INSERT INTO messages (sender_name, message_text) VALUES ($1, $2) RETURNING *",
      [sender_name, message_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  
});

// Get all messages
router.get("/", async (req, res) => {
  try {
      const category = req.query.category;
      let query = "SELECT * FROM messages ORDER BY received_at DESC";
      let values = [];

      if (category) {
          query = "SELECT * FROM messages WHERE category = $1 ORDER BY received_at DESC";
          values = [category];
      }

      const result = await pool.query(query, values);
      res.json(result.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



const axios = require("axios");


const CLIENT_ID = "86w2m1s60mrpi8";
const CLIENT_SECRET = "WPL_AP1.MnZbwsK7J8cJ9a3S.DewU6A==";
const REDIRECT_URI = "http://localhost:3000/auth/linkedin/callback"; // Same as in LinkedIn App

// Route to handle LinkedIn OAuth callback
router.get("/auth/linkedin/callback", async (req, res) => {
    const { code } = req.query; // Get 'code' from LinkedIn callback

    if (!code) {
        return res.status(400).json({ error: "Authorization code is missing!" });
    }

    try {
        // Exchange code for an access token
        const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
            params: {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const accessToken = tokenResponse.data.access_token;
        res.json({ access_token: accessToken }); // Send access token to frontend

    } catch (error) {
        console.error("Error getting access token:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to get access token" });
    }
});

const LINKEDIN_API_URL = "https://api.linkedin.com/v2/me";

// Route to fetch user data from LinkedIn
router.get("/auth/linkedin/user", async (req, res) => {
    const accessToken = req.headers.authorization; // Get token from headers

    if (!accessToken) {
        return res.status(401).json({ error: "Access token required!" });
    }

    try {
        // Fetch user data from LinkedIn
        const userProfile = await axios.get(LINKEDIN_API_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.json(userProfile.data); // Send user data to frontend

    } catch (error) {
        console.error("Error fetching user data:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});



module.exports = router;
