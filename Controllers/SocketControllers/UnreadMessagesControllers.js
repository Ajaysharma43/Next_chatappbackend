import pool from "../../Databaseconnection/DBConnection.js"

export const UnreadMessages = async (req, res, next) => {
    try {
        const { sender, receiver } = req.body
        const UnreadMessagesData = await pool.query(`
            SELECT sender, COUNT(messagestatus) 
FROM personalchat
WHERE (
    (sender = $2 AND receiver = $1) 
    OR 
    (sender = $1 AND receiver = $2)
) 
AND messagestatus = $3
GROUP BY sender


            `, [sender, receiver, false])
        res.status(200).json({ message: "unread messages is successfully get", UnreadMessages: UnreadMessagesData.rows })
    } catch (error) {
        res.status(400).json({ message: "failed of getting unread messages", error: error })
    }
}

export const UnreadMessage = async (sender, receiver) => {
    try {
        const UnreadMessagesData = await pool.query(`
            SELECT sender, COUNT(messagestatus) 
FROM personalchat
WHERE (
    (sender = $2 AND receiver = $1) 
    OR 
    (sender = $1 AND receiver = $2)
) 
AND messagestatus = $3
GROUP BY sender


            `, [sender, receiver, false])
        return UnreadMessagesData.rows
    } catch (error) {
        res.status(400).json({ message: "failed of getting unread messages", error: error })
    }
}