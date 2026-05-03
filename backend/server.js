const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const clubRoutes = require('./routes/clubs');
const messageRoutes = require('./routes/messages');
const progressRoutes = require('./routes/progress');
const contributorRoutes = require('./routes/contributors');
const inviteRoutes = require('./routes/invite');
const aiRoutes = require('./routes/ai');
const notesRoutes = require('./routes/notes');
const discussionRoutes = require('./routes/discussions');
const adminRoutes = require('./routes/admin');
const aiController = require('./controllers/aiController');
const DiscussionMessage = require('./models/DiscussionMessage');
const {
  normalizeRoomId,
  serializeDiscussionMessage,
} = require('./controllers/discussionController');
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
app.use('/api/notes', notesRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/admin', adminRoutes);
app.post('/api/ask', aiController.askLibrarian);

const discussionRoomMembers = new Map();

const buildDiscussionRoomKey = (roomId) => `discussion:${roomId}`;

const serializeRoomUsers = (roomId) => {
  const roomMembers = discussionRoomMembers.get(roomId);

  if (!roomMembers) {
    return [];
  }

  return Array.from(roomMembers.values()).map((member) => ({
    socketId: member.socketId,
    userId: member.userId,
    senderName: member.senderName,
  }));
};

const emitDiscussionRoomUsers = (io, roomId) => {
  io.to(buildDiscussionRoomKey(roomId)).emit('discussion_room_users_updated', {
    roomId,
    users: serializeRoomUsers(roomId),
  });
};

const removeSocketFromDiscussionRoom = (io, socket) => {
  const roomId = socket.data?.discussionRoomId;

  if (!roomId) {
    return;
  }

  const roomMembers = discussionRoomMembers.get(roomId);

  if (roomMembers) {
    roomMembers.delete(socket.id);

    if (roomMembers.size === 0) {
      discussionRoomMembers.delete(roomId);
    }
  }

  socket.leave(buildDiscussionRoomKey(roomId));
  delete socket.data.discussionRoomId;
  delete socket.data.discussionSenderName;
  delete socket.data.discussionUserId;

  emitDiscussionRoomUsers(io, roomId);
};

io.on('connection', (socket) => {
  socket.on('join_club', (clubId) => {
    if (clubId) {
      socket.join(`club:${clubId}`);
    }
  });

  socket.on('join_discussion_room', ({ roomId, senderName, userId } = {}, callback = () => {}) => {
    const normalizedRoomId = normalizeRoomId(roomId);
    const trimmedSenderName = String(senderName || '').trim();

    if (!normalizedRoomId || !trimmedSenderName) {
      callback({ success: false, message: 'roomId and senderName are required.' });
      return;
    }

    removeSocketFromDiscussionRoom(io, socket);

    socket.join(buildDiscussionRoomKey(normalizedRoomId));
    socket.data.discussionRoomId = normalizedRoomId;
    socket.data.discussionSenderName = trimmedSenderName;
    socket.data.discussionUserId = String(userId || '').trim();

    const roomMembers = discussionRoomMembers.get(normalizedRoomId) || new Map();
    roomMembers.set(socket.id, {
      socketId: socket.id,
      userId: socket.data.discussionUserId,
      senderName: trimmedSenderName,
    });
    discussionRoomMembers.set(normalizedRoomId, roomMembers);

    emitDiscussionRoomUsers(io, normalizedRoomId);

    callback({
      success: true,
      roomId: normalizedRoomId,
      users: serializeRoomUsers(normalizedRoomId),
    });
  });

  socket.on('leave_discussion_room', (_payload = {}, callback = () => {}) => {
    const previousRoomId = socket.data?.discussionRoomId || null;
    removeSocketFromDiscussionRoom(io, socket);
    callback({ success: true, roomId: previousRoomId });
  });

  socket.on('send_discussion_message', async ({ roomId, senderName, userId, text } = {}, callback = () => {}) => {
    try {
      const normalizedRoomId = normalizeRoomId(roomId || socket.data?.discussionRoomId);
      const trimmedSenderName = String(senderName || socket.data?.discussionSenderName || '').trim();
      const trimmedUserId = String(userId || socket.data?.discussionUserId || '').trim();
      const trimmedText = String(text || '').trim();

      if (!normalizedRoomId || !trimmedSenderName || !trimmedText) {
        callback({ success: false, message: 'roomId, senderName, and text are required.' });
        return;
      }

      const message = await DiscussionMessage.create({
        roomId: normalizedRoomId,
        senderName: trimmedSenderName,
        senderUserId: trimmedUserId,
        text: trimmedText,
      });

      const payload = serializeDiscussionMessage(message);
      io.to(buildDiscussionRoomKey(normalizedRoomId)).emit('discussion_message_created', payload);

      callback({ success: true, message: payload });
    } catch (error) {
      callback({ success: false, message: 'Unable to send the discussion message.' });
    }
  });

  socket.on('disconnect', () => {
    removeSocketFromDiscussionRoom(io, socket);
  });
});

app.get('/', (req, res) => {
  res.send('ReadTogether API is running...');
});

const DEFAULT_PORT = 5050;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/readtogether';
const localMongoUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/readtogether';

const parsePort = (value) => {
  const parsedPort = Number.parseInt(value, 10);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : null;
};

const getPortCandidates = () => {
  const configuredPort = parsePort(process.env.PORT) || DEFAULT_PORT;

  if (process.env.NODE_ENV === 'production') {
    return [configuredPort];
  }

  return Array.from(
    new Set([
      configuredPort,
      DEFAULT_PORT,
      5000,
      configuredPort + 1,
      configuredPort + 2,
    ].filter(Boolean))
  );
};

function listenOnPort(port) {
  return new Promise((resolve, reject) => {
    const handleListening = () => {
      server.off('error', handleError);
      resolve(port);
    };

    const handleError = (error) => {
      server.off('listening', handleListening);
      reject(error);
    };

    server.once('listening', handleListening);
    server.once('error', handleError);
    server.listen(port);
  });
}

async function startListening() {
  const portCandidates = getPortCandidates();
  let lastError = null;

  for (const port of portCandidates) {
    try {
      const activePort = await listenOnPort(port);
      process.env.PORT = String(activePort);
      return activePort;
    } catch (error) {
      lastError = error;

      if (error.code !== 'EADDRINUSE' || process.env.NODE_ENV === 'production') {
        throw error;
      }

      console.warn(`Port ${port} is already in use. Trying another local port...`);
    }
  }

  throw lastError;
}

async function connectToMongo() {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    return;
  } catch (error) {
    const shouldTryLocalFallback =
      process.env.NODE_ENV !== 'production' &&
      mongoUri !== localMongoUri &&
      ['ECONNREFUSED', 'ENOTFOUND'].includes(error.code);

    if (!shouldTryLocalFallback) {
      throw error;
    }

    console.warn(`Primary MongoDB connection failed (${error.code}). Trying local MongoDB fallback...`);
    await mongoose.connect(localMongoUri);
    console.log('MongoDB connected successfully using local fallback');
  }
}

async function startServer() {
  try {
    if (!process.env.JWT_SECRET?.trim()) {
      throw new Error('Missing JWT_SECRET. Ensure backend/.env is present and loaded before starting the server.');
    }

    await connectToMongo();
    await seedDemoData();

    const activePort = await startListening();
    const aiKey = process.env.OPENROUTER_API_KEY?.trim();

    console.log(`Server running on http://localhost:${activePort}`);

    if (!aiKey || aiKey.includes('your_')) {
      console.warn('AI API key is missing or still set to a placeholder. Librarian will stay offline.');
    } else {
      console.log(`AI service configured (key starts with ${aiKey.substring(0, 8)}...)`);
    }
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();
