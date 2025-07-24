const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const helmet = require('helmet');
const { Server } = require('socket.io');
const http = require('http');
const { authenticateToken } = require('./middleware/auth');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST'],
  },
});
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// MongoDB setup
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Please define the MONGODB_URI environment variable inside .env");
  process.exit(1);
}

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas", error);
    process.exit(1);
  }
}

// Authentication routes
app.post('/api/login', async (req, res) => {
  // For demo, accept any username/password and return a token
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  // In real app, verify username and password from DB
  const user = { username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  res.json({ accessToken });
});

// Protected test route
app.get('/api/test', authenticateToken, async (req, res) => {
  try {
    const db = client.db('testdb');
    const collection = db.collection('testcollection');
    const count = await collection.countDocuments();
    res.json({ message: 'Connected to MongoDB successfully!', documentCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to MongoDB', details: error.message });
  }
});

// POST endpoint to save user feedback (protected)
app.post('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const feedbackData = req.body;
    if (!feedbackData || Object.keys(feedbackData).length === 0) {
      return res.status(400).json({ error: 'Feedback data is required' });
    }
    const db = client.db('Ecotrack');
    const collection = db.collection('feedback');
    const result = await collection.insertOne(feedbackData);
    io.emit('newFeedback', feedbackData); // Emit real-time event
    res.status(201).json({ message: 'Feedback saved successfully', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save feedback', details: error.message });
  }
});

// GET endpoint to retrieve all feedback (protected)
app.get('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const db = client.db('Ecotrack');
    const collection = db.collection('feedback');
    const feedbacks = await collection.find({}).toArray();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve feedback', details: error.message });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  connectDB();
});
