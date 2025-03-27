import pool from "../../Databaseconnection/DBConnection.js"

export const AddChat = (chat) => {
    const message  = pool.query(`
        INSERT INTO messages(sender_id , message)
        VALUES($1 , $2)
        `,[chat.user , chat.text])
}

export const RetriveChats = async () => {
    const chats = await pool.query(`
        SELECT * from messages 
        `)
        return chats.rows
}