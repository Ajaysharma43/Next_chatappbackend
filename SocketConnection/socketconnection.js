import { AddChat, RetriveChats } from "../Controllers/SocketControllers/SocketControllers.js";

const Socketconnection = (io) => {

io.on('connection', async (socket) => {
    console.log('A user connected:', socket.id);
    const chats = await RetriveChats()
    socket.emit('GetPrevChats' , {chats})
  
    socket.emit('connection', { message: 'Welcome to the server!' });
  
    
    socket.on('message', (data) => {
      AddChat(data)
      console.log('Message received:', data);
      
      io.emit('response', { message: data });
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}

export default Socketconnection;