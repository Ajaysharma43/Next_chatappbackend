import pool from "../../Databaseconnection/DBConnection.js"

export const SendMessages = async (message, id, userid) => {
    try {
        const AddMessage = await pool.query(`
            WITH inserted AS (
            INSERT INTO group_messages(group_id, sender_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
            )
            SELECT inserted.*, users.name
            FROM inserted
            JOIN users ON users.id = inserted.sender_id
            ORDER BY inserted.sent_at

            `, [id, userid, message])
        return AddMessage.rows
    } catch (error) {
        console.log(error)
    }
}

export const PreviousGroupChat = async (id) => {
    try {
        const res = await pool.query(`
            SELECT  
            users.name,
            users.profilepic,
            group_messages.id, 
            group_messages.group_id, 
            group_messages.sender_id, 
            group_messages.content, 
            group_messages.sent_at,
            group_messages.notifications
            FROM group_messages
            INNER JOIN users ON users.id = group_messages.sender_id
            WHERE group_messages.group_id = $1
            ORDER BY group_messages.sent_at 
            `, [id])
        return res.rows
    } catch (error) {
        console.log(error)
    }
}

export const DeleteMessage = async (messages) => {
    try {
        const res = await pool.query(`
            DELETE FROM group_messages
            WHERE id = $1
            `, [messages.id])
    } catch (error) {
        console.log(error)
    }
}