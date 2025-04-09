import pool from "../../Databaseconnection/DBConnection.js"

export const GetPreviosChats = async (id , userid) => {
    try {
        const PrevChats = await pool.query(`
            SELECT * FROM personalchat
            WHERE sender = $1 AND receiver = $2
            OR sender = $2 AND receiver = $1
            `,[id , userid])

            if(PrevChats.rowCount == 0)
            {
                return PrevChats.rowCount;
            }
            else
            {
                return PrevChats.rows
            }
    } catch (error) {
        console.log(error)
    }
}

export const SendMessage = async (message , id , userid) => {
    try {
        const Send = await pool.query(`
            INSERT INTO personalchat(message , sender , receiver)
            VALUES($1 , $2 , $3)
            RETURNING *
            `,[message , userid , id])
            return Send.rows
    } catch (error) {
        console.log(error)
    }
}