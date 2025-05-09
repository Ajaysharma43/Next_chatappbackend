import pool from "../../Databaseconnection/DBConnection.js"

export const AddChat = async (chat) => {
    try {
        const message = await pool.query(`
            INSERT INTO messages(sender_id , message)
            VALUES($1 , $2)
            `, [chat.user, chat.text])
        const chats = await pool.query(`
                SELECT * from messages 
                `)
        return chats.rows
    } catch (error) {
        console.log(error)
    }

}

export const RetriveChats = async () => {
    try {
        const chats = await pool.query(`
            SELECT * from messages 
            `)
        return chats.rows
    } catch (error) {
        console.log(error)
    }

}

export const DeleteChat = async (data) => {
    try {
        const DeleteChats = await pool.query(`
            DELETE FROM messages
            WHERE id = $1
            `, [data])
        const UpdateChats = await pool.query(`
                SELECT * FROM messages
                `)
        return UpdateChats.rows;
    } catch (error) {
        console.log(error)
    }

}

export const CheckOnline = async (id) => {
    try {
        const FriendsData = await pool.query(`
                    SELECT * FROM friends
                    WHERE sender_id = $1
                    OR receiver_id = $1
                    `, [id.userId])
        return FriendsData.rows
    } catch (error) {
        console.log(error)
    }
}

export const DeletePersonalChat = async (messageId, userid, id) => {
    try {
        const DeleteChats = await pool.query(`
            DELETE FROM personalchat
            WHERE id = $1
            `, [messageId])
        const UpdateChats = await pool.query(`
                SELECT * FROM personalchat
                WHERE sender = $1 AND receiver = $2 
                OR sender = $2 AND receiver = $1
                ORDER BY created_at
                `, [userid, id])
        return UpdateChats.rows;
    } catch (error) {
        console.log(error)
    }

}