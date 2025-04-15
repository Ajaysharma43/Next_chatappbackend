import pool from "../../Databaseconnection/DBConnection.js"

export const SendMessages = async (message, id, userid) => {
    try {
        const AddMessage = await pool.query(`
            INSERT INTO group_messages(group_id , sender_id , content)
            VALUES($1 , $2 , $3)
            RETURNING *
            `, [id, userid, message])
        return AddMessage.rows
    } catch (error) {
        console.log(error)
    }
}

export const PreviousGroupChat = async (id) => {
    try {
        const res = await pool.query(`
            SELECT * FROM group_messages
            WHERE group_id = $1
            `, [id])
        return res.rows
    } catch (error) {
        console.log(error)
    }
}