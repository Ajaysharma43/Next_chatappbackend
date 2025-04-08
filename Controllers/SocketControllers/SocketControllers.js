import pool from "../../Databaseconnection/DBConnection.js"

export const AddChat = async (chat) => {
    const message = await pool.query(`
        INSERT INTO messages(sender_id , message)
        VALUES($1 , $2)
        `, [chat.user, chat.text])
    const chats = await pool.query(`
            SELECT * from messages 
            `)
    return chats.rows
}

export const RetriveChats = async () => {
    const chats = await pool.query(`
        SELECT * from messages 
        `)
    return chats.rows
}

export const DeleteChat = async (data) => {
    const DeleteChats = await pool.query(`
    DELETE FROM messages
    WHERE id = $1
    `, [data])
    const UpdateChats = await pool.query(`
        SELECT * FROM messages
        `)
    return UpdateChats.rows;
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