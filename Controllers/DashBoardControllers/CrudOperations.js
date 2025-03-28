import pool from "../../Databaseconnection/DBConnection.js";

export const FindUser = async (req, res, next) => {
    try {
        const { Data } = req.body;
        const existed = await pool.query(`
        SELECT * FROM users
        WHERE id = $1
        `, [Data.id])

        if (existed.rows >= 1) {
            next()
        }
        else {
            res.status(404).json({ message: "user not found", Success: false })
        }
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

const UpdateUser = async (req , res , next) => {
    const {Data} = req.body;
    const UpdateUser = await pool.query(`
        UPDATE users
        SET id = $1 , 
        `)
}