import { GetPreviosChats, SendMessage } from "../Controllers/SocketControllers/PersonalChatscontrollers.js";

const PersonalChats = (io, socket , onlineUsers) => {
  // Join room (should be triggered by client)
  socket.on("join-room", (userid) => {
    socket.join(userid);
    console.log(`User ${userid} joined their private room`);
  });

  // Load previous messages
  socket.on("PreviosChats", async (id, userid) => {
    const Chats = await GetPreviosChats(id, userid);
    socket.emit("Messages", Chats , onlineUsers);
  });

  // Handle sending messages
  socket.on("SendMessage", async (message, id, userid) => {

    const Messages = await SendMessage(message, id, userid);

    // Emit updated messages to both sender and receiver rooms
    io.to(userid).emit("RecieveMessages", Messages);
    io.to(parseInt(id)).emit("RecieveMessages", Messages);
  });
};

export default PersonalChats;
