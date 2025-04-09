import { MarkAsReadMessages, UpdateMessageStatus } from "../Controllers/SocketControllers/GetUnreadMessages.js";
import { GetPreviosChats, SendMessage } from "../Controllers/SocketControllers/PersonalChatscontrollers.js";

let isRecieveronline = true

const PersonalChats = (io, socket , onlineUsers) => {
  // Join room (should be triggered by client)
  socket.on("join-room", async (id , userid) => {
    isRecieveronline = true
    socket.join(userid);
    const updateddata =  await MarkAsReadMessages(parseInt(id) , userid)
    console.log(updateddata)
    io.to(parseInt(id)).emit('UpdateMessages' , updateddata)
    io.to(userid).emit('UpdateMessages' , updateddata)
    console.log(`User ${userid} joined their private room`);
  });

  socket.on("leave-room", (userId) => {
    socket.leave(userId.toString());
    isRecieveronline = false
    console.log(`User ${userId} left their private room`);
  });

  // Load previous messages
  socket.on("PreviosChats", async (id, userid) => {
    const Chats = await GetPreviosChats(id, userid);
    socket.emit("Messages", Chats , onlineUsers);
  });

  socket.on("MarkAsRead" , async(id , userid) => {
    const MarkasRead = await MarkAsReadMessages(id , userid)
    io.to(userid).emit("UpdateMessagesStatus", MarkasRead);
    io.to(id).emit("UpdateMessagesStatus",MarkasRead);
    console.log("message mark as read and reciver is online")
  })

  // Handle sending messages
  socket.on("SendMessage", async (message, id, userid) => {

    const Messages = await SendMessage(message, id, userid);

    // Emit updated messages to both sender and receiver rooms
    io.to(userid).emit("RecieveMessages", Messages);
    io.to(parseInt(id)).emit("RecieveMessages", Messages , isRecieveronline);
  });
};

export default PersonalChats;
