import pool from "../../Databaseconnection/DBConnection.js";

export const DeleteFriend = async (req, res, next) => {
    try {
        const { data } = req.body;
        const DeleteFriendFromList = await pool.query(`
            DELETE FROM friends
            WHERE sender_id = $1 AND receiver_id = $2
            OR sender_id = $2 AND receiver_id = $1
            `,[data.sender , data.receiver])

            next()
    } catch (error) {
        res.status(400).json({ message: "Failed to delete the user from friend list", error: error })
    }
}