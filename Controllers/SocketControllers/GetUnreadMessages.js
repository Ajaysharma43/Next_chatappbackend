import pool from "../../Databaseconnection/DBConnection.js"

export const GetUnreadMessages = (req, res, next) => {
    try {

    } catch (error) {
        console.log(error)
    }
}

export const MarkAsReadMessages = async (id, userid) => {
    try {
        const MarkRead = await pool.query(`
            UPDATE personalchat
            SET messagestatus = $1
            WHERE sender = $2 AND receiver = $3
            `, [true, id, userid])
        const UpdatedData = await pool.query(`
                SELECT * FROM personalchat
WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)
ORDER BY created_at;
                `, [userid, id])
        return UpdatedData.rows
    } catch (error) {
        console.log(error)
    }
}

export const UpdateMessageStatus = async (id, userid) => {
    try {
        const MarkRead = await pool.query(`
        UPDATE personalchat
        SET messagestatus = $1
        WHERE sender = $2 AND receiver = $3
        `, [true, id, userid])
    } catch (error) {
        console.log(error)
    }
}