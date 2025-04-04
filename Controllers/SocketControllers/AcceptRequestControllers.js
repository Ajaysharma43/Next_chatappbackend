import pool from "../../Databaseconnection/DBConnection.js";

export const CheckFriendRequest = async (req, res, next) => {
    try {
        const { data } = req.body;
        const CheckRequest = await pool.query(`
        SELECT * from requests
        WHERE sender_id = $1 AND receiver_id = $2
        OR sender_id = $2 AND receiver_id = $1
        ` , [data.sender, data.receiver])

        if (CheckRequest.rowCount == 1) {
            next()
        }
        else {
            res.status(404).json({ message: "request not found", success: false })
        }
    } catch (error) {
        res.status(404).json({ message: error, success: false })
    }

}

export const AcceptFriendRequest = async (req, res, next) => {
    try {
        const { data } = req.body;

        // Insert new friendship & return the added row
        const Accept = await pool.query(
            `INSERT INTO friends(sender_id, receiver_id) VALUES ($1, $2) RETURNING *`,
            [data.sender, data.receiver]
        );

        if (Accept.rowCount > 0) {
            // Call next() only if there's middleware after this function
            if (next) {
                return next();
            } else {
                return res.status(200).json({ 
                    message: "Friend request accepted successfully", 
                    success: true, 
                    friend: Accept.rows[0] 
                });
            }
        } else {
            return res.status(400).json({ 
                message: "Failed to add friend", 
                success: false 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};



export const DeleteFriendRequest = async (req, res, next) => {
    try {
        const { data } = req.body;

        // Delete request and return the deleted row
        const DeleteUserRequest = await pool.query(
            `DELETE FROM requests 
             WHERE sender_id = $1 AND receiver_id = $2 
             OR sender_id = $2 AND receiver_id = $1
             RETURNING *`,
            [data.sender, data.receiver]
        );

        // Check if the request was deleted
        if (DeleteUserRequest.rowCount > 0) {
            res.status(200).json({ 
                message: "User successfully added to friends", 
                success: true 
            });
        } else {
            res.status(400).json({ 
                message: "Failed to delete friend request", 
                success: false 
            });
        }

    } catch (error) {
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
};
