// models/Message.js
const MessageModel = require('../models/message');


const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  insertMessage: async ({ text, sender, sentiment, score, priority, intent }) => {
    const result = await pool.query(
      `INSERT INTO messages (text, sender, sentiment, score, priority, intent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [text, sender, sentiment, score, priority, intent]
    );
    return result.rows[0];
  },
  

  getAllMessages: async () => {
    const result = await pool.query(`SELECT * FROM messages ORDER BY received_at DESC`);
    return result.rows;
  }
};