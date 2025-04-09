import {
  AddChat,
  CheckOnline,
  DeleteChat,
  RetriveChats,
} from "../Controllers/SocketControllers/SocketControllers.js";
import OnlineFriends from "./CheckOnlineFriends.js";
import PersonalChats from "./PersonalChats.js";

let onlineUsers = new Map(); // userId -> socketId

const Socketconnection = (io) => {
  io.on("connection", async (socket) => {
    console.log("✅ A user connected:", socket.id);

    // Send all previous chats
    const chats = await RetriveChats();
    socket.emit("GetPrevChats", { chats });

    // Send welcome message
    socket.emit("connection", { message: "Welcome to the server!" });

    // Handle user online event
    socket.on("user-online", (userId) => {
      if (!userId) return;

      onlineUsers.set(userId, socket.id);
      console.log(`🟢 User ${userId} is online as ${socket.id}`);
      io.emit("update-online-status", [...onlineUsers.keys()]);
    });

    // New message
    socket.on("message", async (data) => {
      const updatedMessages = await AddChat(data);
      io.emit("response", { message: updatedMessages });
    });

    // Typing indicators
    socket.on("typing", (user) => {
      socket.broadcast.emit("userTyping", user);
    });

    socket.on("stoppedtyping", (user) => {
      socket.broadcast.emit("userStoppedTyping", user);
    });

    OnlineFriends(socket , onlineUsers)

    PersonalChats(io , socket)

    // Delete message
    socket.on("deleteMessage", async (id) => {
      const updatedData = await DeleteChat(id);
      io.emit("GetUpdatedChats", { UpdatedData: updatedData });
    });

    // Manual check of online status
    socket.on("IsUserOnline", async ({ id }) => {
      console.log("🔍 Checking online for:", id);
      const isOnline = onlineUsers.has(id);
      const socketId = onlineUsers.get(id) || null;
      const userData = await CheckOnline(id);
      socket.emit("UserOnlineStatus", { id, isOnline, socketId, userData });
      console.log(userData);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ A user disconnected:", socket.id);

      for (const [userId, sid] of onlineUsers) {
        if (sid === socket.id) {
          console.log(`🔴 User ${userId} is offline`);
          onlineUsers.delete(userId);
          break;
        }
      }

      // Update everyone
      io.emit("update-online-status", [...onlineUsers.keys()]);
    });
  });
};

export default Socketconnection;
