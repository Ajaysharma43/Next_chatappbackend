import pool from "../../Databaseconnection/DBConnection.js";

export const GetRequestController = async (req, res, next) => {
    try {
        const { senderid } = req.query;
        const Requests = await pool.query(`
            SELECT * FROM requests
            WHERE sender_id = $1 
            OR receiver_id = $1
            `,[senderid])

            res.status(200).json({Requests : Requests.rows , success : true})
    } catch (error) {
        res.status(400).json({ message: "error occured while fetching the requests", error: error })
    }
}