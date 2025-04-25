import pool from "../../Databaseconnection/DBConnection.js";

export const GetAllUsers = async (req, res, next) => {
    try {
        const { user, id } = req.body;
        const UserData = await pool.query(`
                SELECT * 
                FROM users
                WHERE name ILIKE $1
                AND id NOT IN (
                SELECT blocked_id FROM blockedusers WHERE blocker_id = $2
                UNION
                SELECT blocker_id FROM blockedusers WHERE blocked_id = $2)
                ORDER BY users.created_at ASC

        `, [`%${user}%`, id])
        res.status(200).json({ UserData: UserData.rows, success: true })
    } catch (error) {
        res.status(400).json({ error: error, success: false })
    }
}

export const GetSingleUser = async (req, res) => {
    try {
        const { userid, currentUserId } = req.query;

        // ✅ Skip if either user blocked the other
        const userQuery = await pool.query(`
                SELECT * FROM users
                WHERE id = $1
                AND id NOT IN (
                SELECT blocked_id FROM blockedusers WHERE blocker_id = $2
                UNION
                SELECT blocker_id FROM blockedusers WHERE blocked_id = $2
            )
        `, [parseInt(userid), parseInt(currentUserId)]);

        if (userQuery.rowCount === 0) {
            return res.status(404).json({ message: "User not found or blocked", success: false });
        }

        // ✅ Check if users are friends
        const friendQuery = await pool.query(`
                SELECT * FROM friends
                WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1)
        `, [parseInt(userid), parseInt(currentUserId)]);

        // ✅ Check if a friend request exists
        const requestQuery = await pool.query(`
                SELECT * FROM requests
                WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1)
        `, [parseInt(currentUserId), parseInt(userid)]);

        let relationshipStatus = "no_relation";
        let relation = false;

        if (friendQuery.rowCount > 0) {
            relationshipStatus = "friend";
            relation = true;
        } else if (requestQuery.rowCount > 0) {
            relationshipStatus = "request_sent";
            relation = true;
        }

        res.status(200).json({
            sender: requestQuery.rows[0] || null,
            user: userQuery.rows[0],
            relationshipStatus,
            relation,
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
