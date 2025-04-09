import { GetPreviosChats, SendMessage } from "../Controllers/SocketControllers/PersonalChatscontrollers.js";

const PersonalChats = (io, socket) => {
  // Join room (should be triggered by client)
  socket.on("join-room", (userid) => {
    socket.join(userid);
    console.log(`User ${userid} joined their private room`);
  });

  // Load previous messages
  socket.on("PreviosChats", async (id, userid) => {
    const Chats = await GetPreviosChats(id, userid);
    console.log("Previous Chats:", Chats);
    socket.emit("Messages", Chats);
  });

  // Handle sending messages
  socket.on("SendMessage", async (message, id, userid) => {
    console.log("Message Sent:", message, "To:", id, "From:", userid);

    const Messages = await SendMessage(message, id, userid);

    console.log(Messages)
    // Emit updated messages to both sender and receiver rooms
    io.to(userid).emit("RecieveMessages", Messages);
    io.to(parseInt(id)).emit("RecieveMessages", Messages);
  });
};

export default PersonalChats;
