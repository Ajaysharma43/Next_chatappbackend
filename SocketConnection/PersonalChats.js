import { MarkAsReadMessages, UpdateMessageStatus } from "../Controllers/SocketControllers/GetUnreadMessages.js";
import { GetPreviosChats, SendMessage } from "../Controllers/SocketControllers/PersonalChatscontrollers.js";
import { DeletePersonalChat } from "../Controllers/SocketControllers/SocketControllers.js";
import { UnreadMessage } from "../Controllers/SocketControllers/UnreadMessagesControllers.js";

let isRecieveronline = true

const PersonalChats = (io, socket, onlineUsers) => {
  // Join room (should be triggered by client)
  socket.on("join-room", async (id, userid) => {
    isRecieveronline = true
    socket.join(userid);
    const updateddata = await MarkAsReadMessages(parseInt(id), userid)
    io.to(parseInt(id)).emit('UpdateMessages', updateddata)
    io.to(userid).emit('UpdateMessages', updateddata)
  });

  socket.on("leave-room", (userId) => {
    socket.leave(userId.toString());
    isRecieveronline = false
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
  })

  // Handle sending messages
  socket.on("SendMessage", async (message, id, userid) => {

    const Messages = await SendMessage(message, id, userid);
    let sender = userid
    let receiver = parseInt(id)
    const UnreadMessages = await UnreadMessage(sender, receiver)
    socket.broadcast.emit('UpdateUnreadMessages', UnreadMessages)
    // Emit updated messages to both sender and receiver rooms
    io.to(userid).emit("RecieveMessages", Messages);
    io.to(parseInt(id)).emit("RecieveMessages", Messages, isRecieveronline);
  });

  socket.on('GetUnreadMessages', async (sender, receiver) => {
    const UnreadMessages = await UnreadMessage(sender, receiver)
    socket.emit('UpdateUnreadMessages', UnreadMessages)
  })

  socket.on('DeleteMessage', async (messageId, userid, id) => {
    const UpdatedMessages = await DeletePersonalChat(messageId, userid, id)
    let sender = userid
    let receiver = id
    const UnreadMessages = await UnreadMessage(sender, receiver)
    if (UnreadMessages.length == 0) {
      UnreadMessages.push({ sender: 12, count: '0' })
      socket.broadcast.emit('UpdateUnreadMessages', UnreadMessages)
      io.to(userid).emit("UpdatedDeletedMessages", UpdatedMessages);
      io.to(id).emit("UpdatedDeletedMessages", UpdatedMessages);
    }
    else {
      socket.broadcast.emit('UpdateUnreadMessages', UnreadMessages)
      io.to(userid).emit("UpdatedDeletedMessages", UpdatedMessages);
      io.to(id).emit("UpdatedDeletedMessages", UpdatedMessages);
    }
  })

  socket.on('typing', (id) => {
    socket.broadcast.emit('isTyping', id)
  })
};

export default PersonalChats;
