import { MarkAsReadMessages, UpdateMessageStatus } from "../Controllers/SocketControllers/GetUnreadMessages.js";
import { GetPreviosChats, SendMessage } from "../Controllers/SocketControllers/PersonalChatscontrollers.js";
import { UnreadMessage } from "../Controllers/SocketControllers/UnreadMessagesControllers.js";

let isRecieveronline = true

const PersonalChats = (io, socket, onlineUsers) => {
  // Join room (should be triggered by client)
  socket.on("join-room", async (id, userid) => {
    isRecieveronline = true
    socket.join(userid);
    const updateddata = await MarkAsReadMessages(parseInt(id), userid)
    console.log(updateddata)
    io.to(parseInt(id)).emit('UpdateMessages', updateddata)
    io.to(userid).emit('UpdateMessages', updateddata)
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
    socket.emit("Messages", Chats, onlineUsers);
  });

  socket.on("MarkAsRead", async (id, userid) => {
    const MarkasRead = await MarkAsReadMessages(id, userid)
    io.to(userid).emit("UpdateMessagesStatus", MarkasRead);
    io.to(id).emit("UpdateMessagesStatus", MarkasRead);
    console.log("message mark as read and reciver is online")
  })

  // Handle sending messages
  socket.on("SendMessage", async (message, id, userid) => {

    const Messages = await SendMessage(message, id, userid);
    let sender = userid
    let receiver = parseInt(id)
    console.log("the receiver id is : ", receiver)
    const UnreadMessages = await UnreadMessage(sender, receiver)
    console.log("the reciver id is : " , receiver)
    console.log("this message is sent but not read ", UnreadMessages)
    socket.broadcast.emit('UpdateUnreadMessages', UnreadMessages)
    // Emit updated messages to both sender and receiver rooms
    io.to(userid).emit("RecieveMessages", Messages);
    io.to(parseInt(id)).emit("RecieveMessages", Messages, isRecieveronline);
  });

  socket.on('GetUnreadMessages', async (sender, receiver) => {
    const UnreadMessages = await UnreadMessage(sender, receiver)
    console.log(UnreadMessages)
    socket.emit('UpdateUnreadMessages', UnreadMessages)
  })
};

export default PersonalChats;
