import pool from "../../Databaseconnection/DBConnection.js";

export const GetAllUsers = async (req, res, next) => {
    try {
        const { user } = req.body;
        const UserData = await pool.query(`
        SELECT * FROM users
        WHERE name ILIKE $1
        `, [`%${user}%`])
        res.status(200).json({ UserData: UserData.rows, success: true })
    } catch (error) {
        res.status(400).json({ error: error, success: false })
    }
}

export const GetSingleUser = async (req, res) => {
    try {
        const { userid, currentUserId } = req.query; // `currentUserId` is the logged-in user

        // 🔍 Get user details
        const userQuery = await pool.query(`
            SELECT * FROM users
            WHERE id = $1`, 
            [userid]
        );

        if (userQuery.rowCount === 0) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // 🔍 Check if they are friends
        const friendQuery = await pool.query(`
            SELECT * FROM friends
            WHERE (sender_id = $1 AND receiver_id = $2) 
               OR (sender_id = $2 AND receiver_id = $1)`,
            [userid, currentUserId]
        );

        // 🔍 Check if a request was sent
        const requestQuery = await pool.query(`
            SELECT * FROM requests
            WHERE (sender_id = $1 AND receiver_id = $2) 
            OR (sender_id = $2 AND receiver_id = $1)`,
            [currentUserId, userid]
        );

        let relationshipStatus = "no_relation"; // Default: No relation
        let relation = false

        if (friendQuery.rowCount > 0) {
            relationshipStatus = "friend"; // ✅ Users are friends
            relation = true
        } else if (requestQuery.rowCount > 0) {
            relationshipStatus = "request_sent"; // ✅ Request was sent
            relation = true
        }

        // ✅ Return user data + relationship status
        res.status(200).json({
            sender : requestQuery.rows[0],
            user: userQuery.rows[0],
            relationshipStatus,
            relation,
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
