import pool from "../../Databaseconnection/DBConnection.js"

export const UnreadMessages = async(req , res , next) => {
    try {
        const {sender , receiver} = req.body
        const UnreadMessagesData = await pool.query(`
            SELECT COUNT(messagestatus) FROM personalchat
            WHERE sender = $2 AND receiver = $1 AND messagestatus = $3
            `,[sender , receiver , false])

            res.status(200).json({message : "unread messages is successfully get" , UnreadMessages : UnreadMessagesData.rows})
    } catch (error) {
        res.status(400).json({message : "failed of getting unread messages" , error : error})
    }
}