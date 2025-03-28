import pool from "../../Databaseconnection/DBConnection.js";

export const GetUsers = async (req, res, next) => {
    try {
        const { Limit } = req.query
        if (Limit == null || Limit == 0) {
            Limit = 5
            const UsersData = await pool.query(`
                SELECT * FROM users
                LIMIT $1
                `, [Limit])
            res.status(200).json({ Data: UsersData.rows })
        }
        else {
            const UsersData = await pool.query(`
                SELECT * FROM users
                LIMIT $1
                `, [Limit])
            res.status(200).json({ Data: UsersData.rows })
        }
    } catch (error) {
        res.status(404).json({ error: error })
    }
}