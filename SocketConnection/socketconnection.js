import {
  AddChat,
  CheckOnline,
  DeleteChat,
  RetriveChats,
} from "../Controllers/SocketControllers/SocketControllers.js";
import ChatGroups from "./ChatGroups.js";
import OnlineFriends from "./CheckOnlineFriends.js";
import PersonalChats from "./PersonalChats.js";

let onlineUsers = new Map(); // userId -> socketId

const Socketconnection = (io) => {
  io.on("connection", async (socket) => {
    try {
      
      socket.emit("connection", { message: "Welcome to the server!" });
    } catch (err) {
      console.error("❌ Error sending previous chats or welcome:", err);
    }

    socket.on('SendPrevGlobalMessages' , async () => {
      const chats = await RetriveChats();
      socket.emit("GetPrevChats", { chats });
    })

    socket.on("user-online", (userId) => {
      try {
        if (!userId) return;
        onlineUsers.set(userId, socket.id);
        io.emit("update-online-status", [...onlineUsers.keys()]);
      } catch (err) {
        console.error("❌ Error setting user online:", err);
      }
    });

    socket.on("message", async (data) => {
      try {
        const updatedMessages = await AddChat(data);
        io.emit("response", { message: updatedMessages });
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    });

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

    try {
      OnlineFriends(socket, onlineUsers);
    } catch (err) {
      console.error("❌ Error in OnlineFriends handler:", err);
    }

    try {
      PersonalChats(io, socket, { onlineUsers: [...onlineUsers.keys()] });
    } catch (err) {
      console.error("❌ Error in PersonalChats handler:", err);
    }

    try {
      ChatGroups(io, socket);
    } catch (error) {
      console.error("❌ Error in the GroupChat:", error);
    }

    socket.on("deleteMessage", async (id) => {
      try {
        const updatedData = await DeleteChat(id);
        io.emit("GetUpdatedChats", { UpdatedData: updatedData });
      } catch (err) {
        console.error("❌ Error deleting message:", err);
      }
    });

    socket.on("IsUserOnline", async ({ id }) => {
      try {
        const isOnline = onlineUsers.has(id);
        const socketId = onlineUsers.get(id) || null;
        const userData = await CheckOnline(id);
      } catch (err) {
        console.error("❌ Error checking user online status:", err);
      }
    });

    socket.on("disconnect", () => {
      try {
        for (const [userId, sid] of onlineUsers) {
          if (sid === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }
        io.emit("update-online-status", [...onlineUsers.keys()]);
      } catch (err) {
        console.error("❌ Error during disconnect:", err);
      }
    });
  });
};

export default Socketconnection;
