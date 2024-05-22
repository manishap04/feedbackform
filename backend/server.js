const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;
//const MONGO_URL = 'mongodb://127.0.0.1:27017';
const dbName = 'feedback';

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Construct path to static files
const staticPath = path.join(__dirname, '../frontend/build');
console.log('Static files path:', staticPath);

try {
  app.use(express.static(staticPath));
} catch (error) {
  console.error('Error setting up static middleware:', error);
}

let db;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToDatabase();

app.post('/api/posts', async (req, res) => {
  console.log('POST /api/posts called');
  try {
    console.log('Incoming request body:', req.body);
    const { name, email, text } = req.body;

    if (!name || !email || !text) {
      console.error('Validation error: Missing required fields');
      return res.status(400).json({ error: 'Name, email, and text are required' });
    }

    const collection = db.collection('posts');
    const result = await collection.insertOne({ name, email, text });
    console.log('Post added successfully', result);
    res.status(201).json({ message: 'Post added successfully', postId: result.insertedId });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ error: 'Failed to add post' });
  }
});

app.get('/api/posts', async (req, res) => {
  console.log('GET /api/posts called');
  try {
    const collection = db.collection('posts');
    const posts = await collection.find({}).toArray();
    console.log('Fetched posts:', posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.listen(PORT, () => console.log(`HTTP server started at port ${PORT}`));
