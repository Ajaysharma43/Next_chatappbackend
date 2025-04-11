import pool from "../../Databaseconnection/DBConnection.js";

export const GetRequestController = async (req, res, next) => {
    try {
        const { senderid } = req.query;
        const SendRequests = await pool.query(`
            SELECT * FROM requests
            WHERE sender_id = $1
            `, [senderid])

        const ReciveRequests = await pool.query(`
                SELECT * FROM requests
            WHERE receiver_id = $1
                `, [senderid])
        res.status(200).json({ SendRequests: SendRequests.rows, ReciveRequests: ReciveRequests.rows, success: true })
    } catch (error) {
        res.status(400).json({ message: "error occured while fetching the requests", error: error })
    }
}
