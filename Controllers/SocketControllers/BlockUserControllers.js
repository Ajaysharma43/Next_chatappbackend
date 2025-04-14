import pool from "../../Databaseconnection/DBConnection.js"

export const CheckBlockController = async (blockfriendid , userId) => {
    try {
        const CheckBlock = await pool.query(`
            SELECT * from blockedusers
            WHERE blocker_id = $1 AND blocked_id = $2
            OR blocker_id = $2 AND blocked_id = $1
            ` , [userId, blockfriendid])
            if(CheckBlock.rowCount == 0)
            {
                return true
            }
            else
            {
                return false
            }
    } catch (error) {
        console.log(error)
    }
    
}

export const BlockUserController = async (blockfriendid , userId) => {
    try {
        const BlockUser = await pool.query(`
            INSERT INTO blockedusers(blocker_id , blocked_id)
            VALUES($1 , $2)
            RETURNING * 
            `, [userId, blockfriendid])
            return BlockUser.rows
    } catch (error) {
        console.log(error)
    }
    
}