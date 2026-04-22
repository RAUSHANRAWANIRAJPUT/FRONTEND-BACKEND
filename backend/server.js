const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const clubRoutes = require('./routes/clubs');
const messageRoutes = require('./routes/messages');
const progressRoutes = require('./routes/progress');
const contributorRoutes = require('./routes/contributors');
const inviteRoutes = require('./routes/invite');
const aiRoutes = require('./routes/ai');
const { seedDemoData } = require('./utils/demoSeed');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

app.use(cors());
app.use(express.json());
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/contributors', contributorRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/ai', aiRoutes);

io.on('connection', (socket) => {
  socket.on('join_club', (clubId) => {
    if (clubId) {
      socket.join(`club:${clubId}`);
    }
  });
});

app.get('/', (req, res) => {
  res.send('ReadTogether API is running...');
});

const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/readtogether';

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    await seedDemoData();
    console.log('MongoDB connected successfully');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      const aiKey = process.env.OPENROUTER_API_KEY?.trim();
      if (!aiKey || aiKey.includes('your_')) {
          console.warn('⚠️  AI API Key is missing or default! Librarian will be offline.');
      } else {
          console.log(`✅ AI Service configured (Key starts with ${aiKey.substring(0, 8)}...)`);
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

startServer();
