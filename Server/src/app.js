// server.js (or your main server file)

import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import User from './api/models/User.js'; // Import the User model
import bodyParser from 'body-parser';

// Import routes
import userRoutes from './api/routes/userRoutes.js';
import profileRoutes from './api/routes/profileRoutes.js';
import forumRoutesInit from './api/routes/forumRoutes.js';
import messageRoutes from './api/routes/messageRoutes.js';
import friendRequestRoutes from './api/routes/friendRequestRoutes.js';
import jobRoutes from './api/routes/jobRoutes.js';
import eventRoutes from './api/routes/eventRoutes.js';
import donationRoutes from './api/routes/donationRoutes.js';
import groupRoutes from './api/routes/groupRoutes.js';
import analyticsRoutes from './api/routes/donationAnalyticsRoutes.js';
import notificationRoutes from './api/routes/NotificationRoutes.js';
import userDirectoryRoutes from './api/routes/userDirectoryRoutes.js';
// import facultyRoutes from './api/routes/facultyRoutes.js';
import uploadRoutes from './api/routes/uploadRoutes.js';
import preUserRoutes from './api/routes/preUserRoutes.js'
import statsRoutes from "./api/routes/statsRoutes.js";

import messageRoutesInit from './api/routes/messageRoutes.js';

import studentUploadRoutes from './api/routes/studentUploadRoutes.js';
import galleryRoutes from './api/routes/galleryRoutes.js';

import privacySettingsRoutes from './api/routes/privacySettingRoutes.js'; 

import { PORT } from './config/index.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',  // Be cautious with this in production
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Initialize the forumRoutes with the io instance
const forumRoutes = forumRoutesInit(io);

// Routes
app.get('/', (req, res) => {
  res.send('Alumni Information System Backend');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/friends', friendRequestRoutes);
app.use('/api/messages', messageRoutes(io));
app.use('/api/forums', forumRoutes);

app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/directory', userDirectoryRoutes);
app.use('/api', studentUploadRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/groups', groupRoutes);
// app.use('/api/faculty', facultyRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/preusers', preUserRoutes);
app.use("/api/stats", statsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', privacySettingsRoutes);

// Socket.IO Real-time Connections
io.on('connection', (socket) => {
  console.log('A user connected with id:', socket.id);

  // Handle user joining a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle user connecting
  socket.on('userOnline', async (userId) => {
    try {
      await User.findByIdAndUpdate(userId, { onlineStatus: true });
      console.log(`User ${userId} is online`);
      io.emit('userStatusChanged', { userId, onlineStatus: true });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });

  // Handle user disconnecting
  socket.on('disconnect', async () => {
    try {
      const socketId = socket.id;
      // Assuming you have a way to map socketId to userId
      const user = await User.findOneAndUpdate({ socketId }, { onlineStatus: false });
      if (user) {
        console.log(`User ${user._id} is offline`);
        io.emit('userStatusChanged', { userId: user._id, onlineStatus: false });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });

  // Handle other events such as forum posts and messages
  socket.on('forum:postMessage', (data) => {
    io.in(data.forumId).emit('forum:newPost', data);
  });

  socket.on('message:sendMessage', (data) => {
    io.in(data.chatId).emit('message:newMessage', data);
  });

  // Typing indicator events
  socket.on('typing:start', (data) => {
    socket.to(data.chatId).emit('typing:start', {
      userId: data.userId,
      chatId: data.chatId
    });
  });

  socket.on('typing:stop', (data) => {
    socket.to(data.chatId).emit('typing:stop', {
      userId: data.userId,
      chatId: data.chatId
    });
  });
});

// Change app.listen to server.listen to include Socket.IO
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
