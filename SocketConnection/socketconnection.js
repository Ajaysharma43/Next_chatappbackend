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

    try {
      // Send all previous chats
      const chats = await RetriveChats();
      socket.emit("GetPrevChats", { chats });

      // Welcome message
      socket.emit("connection", { message: "Welcome to the server!" });
    } catch (err) {
      console.error("❌ Error sending previous chats or welcome:", err);
    }

    // User online
    socket.on("user-online", (userId) => {
      try {
        if (!userId) return;
        onlineUsers.set(userId, socket.id);
        console.log(`🟢 User ${userId} is online as ${socket.id}`);
        io.emit("update-online-status", [...onlineUsers.keys()]);
      } catch (err) {
        console.error("❌ Error setting user online:", err);
      }
    });

    // Message
    socket.on("message", async (data) => {
      try {
        const updatedMessages = await AddChat(data);
        io.emit("response", { message: updatedMessages });
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    });

    // Typing
    socket.on("typing", (user) => {
      try {
        socket.broadcast.emit("userTyping", user);
      } catch (err) {
        console.error("❌ Error broadcasting typing:", err);
      }
    });

    socket.on("stoppedtyping", (user) => {
      try {
        socket.broadcast.emit("userStoppedTyping", user);
      } catch (err) {
        console.error("❌ Error broadcasting stopped typing:", err);
      }
    });

    // Online friends logic
    try {
      OnlineFriends(socket, onlineUsers);
    } catch (err) {
      console.error("❌ Error in OnlineFriends handler:", err);
    }

    // Personal chats logic
    try {
      PersonalChats(io, socket, { onlineUsers: [...onlineUsers.keys()] });
    } catch (err) {
      console.error("❌ Error in PersonalChats handler:", err);
    }

    // Delete message
    socket.on("deleteMessage", async (id) => {
      try {
        const updatedData = await DeleteChat(id);
        io.emit("GetUpdatedChats", { UpdatedData: updatedData });
      } catch (err) {
        console.error("❌ Error deleting message:", err);
      }
    });

    // Check if a user is online manually
    socket.on("IsUserOnline", async ({ id }) => {
      try {
        console.log("🔍 Checking online for:", id);
        const isOnline = onlineUsers.has(id);
        const socketId = onlineUsers.get(id) || null;
        const userData = await CheckOnline(id);
        socket.emit("UserOnlineStatus", { id, isOnline, socketId, userData });
      } catch (err) {
        console.error("❌ Error checking user online status:", err);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      try {
        console.log("❌ A user disconnected:", socket.id);

        for (const [userId, sid] of onlineUsers) {
          if (sid === socket.id) {
            console.log(`🔴 User ${userId} is offline`);
            onlineUsers.delete(userId);
            break;
          }
        }

        // Broadcast updated online users
        io.emit("update-online-status", [...onlineUsers.keys()]);
      } catch (err) {
        console.error("❌ Error during disconnect:", err);
      }
    });
  });
};

export default Socketconnection;
