import pool from "../../Databaseconnection/DBConnection.js";

// ✅ Check if users are already friends
export const CheckFriends = async (req, res, next) => {
    try {
        const { data } = req.body;

        console.log(data)
        const result = await pool.query(`
            SELECT * FROM friends
            WHERE (sender_id  = $1 AND receiver_id  = $2) 
               OR (sender_id = $2 AND receiver_id  = $1)`,
            [data.sender, data.receiver]
        );

        if (result.rowCount > 0) {
            return res.status(400).json({ message: "Users are already friends", success: false });
        }
        console.log("success")
        next(); // Proceed if they are not friends
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};

// ✅ Check if a friend request already exists
export const CheckRequest = async (req, res, next) => {
    try {
        const { data } = req.body;

        const result = await pool.query(`
            SELECT * FROM requests
            WHERE sender_id = $1 AND receiver_id = $2
            OR (sender_id = $2 AND receiver_id  = $1)`,
            [data.sender, data.receiver]
        );

        if (result.rowCount > 0) {
            return res.status(400).json({ message: "Friend request already sent", success: false });
        }

        next(); // Proceed if no request exists
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};

// ✅ Send a friend request
export const SendRequest = async (req, res) => {
    try {
        const { data } = req.body;

        await pool.query(`
            INSERT INTO requests (sender_id, receiver_id)
            VALUES ($1, $2)`, 
            [data.sender, data.receiver]
        );
        let relationshipStatus = "request_sent";
        res.status(200).json({ message: "Friend request sent successfully", success: true , relationshipStatus : relationshipStatus });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};
