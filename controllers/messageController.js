const { insertMessage, getAllMessages } = require('../models/message');
const classifyMessage = require('../utils/hfclassifier');

// Save a new message to DB
const saveMessage = async (req, res) => {
  try {
    const { text, sender } = req.body;

    // Basic validation
    if (!text || !sender) {
      return res.status(400).json({ error: 'Missing text or sender' });
    }

    // Intent classification using zero-shot model
    const { label: intent, score, priority } = await classifyMessage(text);
    const sentiment = 'N/A'; // or handle actual sentiment separately if needed

    // Save to DB
    const newMessage = await insertMessage({
      text,
      sender,
      sentiment,
      score,
      priority,
      intent,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  saveMessage,
  getMessages,
};