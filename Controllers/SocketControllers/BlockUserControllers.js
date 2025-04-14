import pool from "../../Databaseconnection/DBConnection.js"

export const CheckBlockController = async (blockfriendid, userId) => {
    try {
        const CheckBlock = await pool.query(`
            SELECT * from blockedusers
            WHERE blocker_id = $1 AND blocked_id = $2
            OR blocker_id = $2 AND blocked_id = $1
            ` , [userId, blockfriendid])
        if (CheckBlock.rowCount == 0) {
            return true
        }
        else {
            return false
        }
    } catch (error) {
        console.log(error)
    }

}

export const BlockUserController = async (blockfriendid, userId) => {
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

export const GetBlockUsers = async (req, res, next) => {
    try {
        const { userid } = req.query;
        const BlockedUsers = await pool.query(`
            SELECT
            blockedusers.id AS blockedusersid , 
            blockedusers.blocker_id AS blockerid , 
            blockedusers.blocked_id , 
            users.name as blockerusername  FROM blockedusers 
            INNER JOIN users ON blockedusers.blocked_id = users.id
            WHERE blockedusers.blocker_id = $1
            ` , [userid])
        res.status(200).json({ message: "blocked users successfully fetched", BlockedUsers: BlockedUsers.rows, success: true })
    } catch (error) {
        res.status(404).json({ message: "error white fetching blocked users", success: false })
    }
}

export const Unblockuser = async(selectedUser) => {
    try {
        const unblock = await pool.query(`
            DELETE FROM blockedusers
            WHERE id = $1
            `,[selectedUser.blockedusersid])

            const UpdatedUnblockUsers = await pool.query(`
                SELECT * FROM blockedusers
                WHERE blocker_id = $1
                `,[selectedUser.blockerid])
            return UpdatedUnblockUsers.rows
    } catch (error) {
        console.log(error)
    }
}