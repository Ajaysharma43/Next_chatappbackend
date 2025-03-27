import { AddChat, DeleteChat, RetriveChats } from "../Controllers/SocketControllers/SocketControllers.js";

const Socketconnection = (io) => {

io.on('connection', async (socket) => {
    console.log('A user connected:', socket.id);
    const chats = await RetriveChats()
    socket.emit('GetPrevChats' , {chats})
  
    socket.emit('connection', { message: 'Welcome to the server!' });
  
    
    socket.on('message', async (data) => {
      const Updatedmessages = await AddChat(data)
      console.log('Message received:', Updatedmessages);
      
      io.emit('response', { message: Updatedmessages });
    });

    socket.on('typing' , (user) => {
      socket.broadcast.emit('userTyping' , (user))
    })

    socket.on('stoppedtyping' , (user) =>{
      socket.broadcast.emit('userStoppedTyping' , (user))
    })

    socket.on('deleteMessage' , async (id) => {
      const UpdatedData = await DeleteChat(id)
      io.emit('GetUpdatedChats' , {UpdatedData})
    })
  
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}

export default Socketconnection;