require("dotenv").config();
const express = require("express");
const {Pool} = require ("pg");
const app = express();
const path = require('path');
const { getAsync, setAsync } = require('./redis'); 
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const openai = require('./openai');
const routes = require("./routes");


console.log("loaded key:",process.env.OPEN_API_KEY);


app.use(express.json()); // Middleware to parse JSON

const pool= new Pool({
    connectionString: process.env.DATABASE_URL,
}

);

pool.connect()
.then(()=> console.log("postgres connected"))
.catch(err => console.error("DB Connection Error", err));


// const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "linkedin-react/build")));

// Add this before your catch-all route ("*")
app.get('/api/messages', (req, res) => {
    // Sample data - in a real app, this would come from a database
    const messages = [
      { id: 1, sender: 'saima', content: 'Hey, let\'s connect!', priority: 'medium' },
      { id: 2, sender: 'gunjan', content: 'Looking forward to our meeting.', priority: 'high' }
    ];
    res.json(messages);
  });
  
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "linkedin-react/build", "index.html"));
  });
  
app.get("/", (req, res) => {
    res.send("Server is running! Define your frontend or API routes.");
  });
  
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const messageRoutes = require("./routes");

app.use("/api/messages", messageRoutes);

async function deleteOldLowPriorityMessages() {
    try {
        await pool.query("DELETE FROM messages WHERE category = 'Low Priority' AND received_at < NOW() - INTERVAL '7 days'");
        console.log("✅ Old low-priority messages deleted.");
    } catch (err) {
        console.error("❌ Error deleting old messages:", err);
    }
}

setInterval(deleteOldLowPriorityMessages, 24 * 60 * 60 * 1000); // Runs every 24 hours



// Get all messages with Redis caching
app.get('/api/messages', async (req, res) => {
  try {
    // Try to get data from Redis cache first
    const cachedMessages = await getAsync('all_messages');
    
    if (cachedMessages) {
      // Return cached data if available
      return res.json(JSON.parse(cachedMessages));
    }
    
    // If not in cache, get from Elasticsearch
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
    
    // Store in Redis with 5-minute expiration
    await setAsync('all_messages', JSON.stringify(messages), 'EX', 300);
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }



  wss.on('connection', ws => {
    console.log("Client connected");

    // Send a welcome message
    ws.send(JSON.stringify({ user: "System", text: "Connected to WebSocket server!" }));

    // Simulate new messages coming in every few seconds
    setInterval(() => {
        const message = {
            user: "Recruiter A",
            text: "We have an exciting opportunity for you!",
            id: Math.random()
        };
        ws.send(JSON.stringify(message));
    }, 5000);

    ws.on('close', () => console.log("Client disconnected"));
});
});

//postman

const bodyParser = require('body-parser');
const router = require('./routes'); // Import your router


const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Mount your router at the /api prefix
app.use('/api', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





