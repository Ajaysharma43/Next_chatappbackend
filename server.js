import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import Socketconnection from './SocketConnection/socketconnection.js';
import OnlineFriends from './SocketConnection/CheckOnlineFriends.js';

import AuthRouter from './Routes/AuthRoutes.js';
import NavRoutes from './Routes/NavRoutes.js';
import DashboardRoutes from './Routes/DashboardRoutes.js';
import ChatAppRoutes from './Routes/AddFriendsRoutes.js';
import GroupChatRoutes from './Routes/ChatGroupsSlice.js';
import FirebaseImageUpload from './Routes/FireBaseRoutes.js'
import GithubRedirect from './SocialLogin/Github/GithubRedirectRoute.js'
import GithubCallback from './SocialLogin/Github/GithubCallBackRoute.js'

dotenv.config();

const app = express();
const PORT = 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// API Routes
app.use('/Auth', AuthRouter);
app.use('/Nav', NavRoutes);
app.use('/Dashboard', DashboardRoutes);
app.use('/Chatapp', ChatAppRoutes);
app.use('/GroupChat', GroupChatRoutes);
app.use('/Firebase', FirebaseImageUpload)

// github login routes
app.use('/auth', GithubRedirect)
app.use('/api/auth', GithubCallback)


// === Socket.IO Setup ===
Socketconnection(io);
OnlineFriends(io);

server.listen(PORT);
