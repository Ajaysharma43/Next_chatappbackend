import pool from "../../Databaseconnection/DBConnection.js";

export const CheckRequest = async (req, res, next) => {
    try {
        const { data } = req.body;
        const User = await pool.query(`
            SELECT * FROM requests
            WHERE sender_id = $1 AND receiver_id = $2
            `, [data.sender, data.receiver])
        if (User.rowCount == 0) {
            next()
        }
        else {
            res.status(404).json({ message: "request existed", Success: false })
        }
    } catch (error) {
        res.status(404).json({ error: error, Success: false })
    }
}


export const SendRequest = async (req, res, next) => {
    try {
        const { data } = req.body;
        const AddRequest = await pool.query(`
        INSERT INTO requests(sender_id , receiver_id)
        VALUES($1 , $2)
        `,[data.sender , data.receiver])
        res.status(200).json({message : "Request is Successfully" , Success : true})
    } catch (error) {
        res.status(404).json({ error: error, Success: false })
    }

}