import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import Socketconnection from './SocketConnection/socketconnection.js';
import AuthRouter from './Routes/AuthRoutes.js'
import NavRoutes from './Routes/NavRoutes.js'
import DashboardRoutes from './Routes/DashboardRoutes.js'
import ChatAppRoutes from './Routes/AddFriendsRoutes.js'
import env from 'dotenv'


env.config()


const app = express();
const PORT = 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});


app.use(express.json());
app.use(cors());

app.use('/Auth', AuthRouter)
app.use('/Nav', NavRoutes)
app.use('/Dashboard' , DashboardRoutes)
app.use('/Chatapp' , ChatAppRoutes)


Socketconnection(io)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});