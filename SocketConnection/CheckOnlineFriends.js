import pool from "../Databaseconnection/DBConnection.js";

const OnlineFriends = (socket, onlineUsers) => {
  // Listen for event to check friends' online status
  socket.on("get-online-friends", async (userId) => {
    try {
      // Fetch all friends of the user
      const { rows } = await pool.query(
        `SELECT 
          CASE 
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id 
          END AS friend_id
        FROM friends
        WHERE sender_id = $1 OR receiver_id = $1`,
        [userId]
      );

      // Extract friend IDs
      const friendIds = rows.map((row) => row.friend_id);

      // Check which friends are online
      const onlineFriends = friendIds.filter((fid) => onlineUsers.has(fid));

      console.log(onlineFriends , "are the onlineFriends")
      // Emit result to client
      socket.emit("online-friends-list", {
        userId,
        friends: friendIds,
        onlineFriends,
      });

      
    } catch (error) {
      console.error("Error fetching online friends:", error);
      socket.emit("online-friends-error", { message: "Failed to get friends" });
    }
  });
};

export default OnlineFriends;
