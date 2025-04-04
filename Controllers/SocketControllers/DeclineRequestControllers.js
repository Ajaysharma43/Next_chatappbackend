import pool from "../../Databaseconnection/DBConnection.js";

export const DeleteUser = async (req, res, next) => {
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

        console.log(DeleteUserRequest.rowCount)
        // Check if the request was deleted
        if (DeleteUserRequest.rowCount == 0) {
            let relationshipStatus = "no_relation";
            res.status(200).json({
                message: "Request is successfully deleted",
                success: true,
                relationshipStatus: relationshipStatus
            });
        } else {
            res.status(400).json({
                message: "Failed to delete friend request",
                success: false
            });
        }
    } catch (error) {
        res.status(400).json({ error: error })
    }
}