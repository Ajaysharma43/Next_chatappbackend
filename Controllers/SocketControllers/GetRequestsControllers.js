import pool from "../../Databaseconnection/DBConnection.js";

export const GetRequestController = async (req, res, next) => {
    try {
        const { senderid } = req.query;
        const SendRequests = await pool.query(`
            SELECT 
            requests.id,
            requests.sender_id,
            requests.receiver_id,
            requests.created_at,
            users.id, 
            users.name,
            users.profilepic 
            FROM requests
            INNER JOIN users ON users.id = requests.sender_id
            WHERE requests.sender_id = $1
            `, [senderid])
        const ReciveRequests = await pool.query(`
            SELECT 
            requests.id,
            requests.sender_id,
            requests.receiver_id,
            requests.created_at,
            users.id,
            users.name,
            users.profilepic 
            FROM requests
            INNER JOIN users ON users.id = requests.receiver_id
            WHERE receiver_id = $1
                `, [senderid])
        res.status(200).json({ SendRequests: SendRequests.rows, ReciveRequests: ReciveRequests.rows, success: true })
    } catch (error) {
        res.status(400).json({ message: "error occured while fetching the requests", error: error })
    }
}
