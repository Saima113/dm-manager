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


module.exports = router;
