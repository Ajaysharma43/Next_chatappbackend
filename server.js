import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const PORT = 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Update this to your frontend domain in production
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Express.js server with Socket.IO!');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Emit a welcome message to the connected client
  socket.emit('connection', { message: 'Welcome to the server!' });

  // Listen for messages from the client
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Broadcast the message to all other clients
    io.emit('response', { message: data });
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});