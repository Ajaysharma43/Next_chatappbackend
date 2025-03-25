import pool from "../../Databaseconnection/DBConnection.js";

export const CheckUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const existed = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (existed.rowCount > 0) {
            res.json({ message: "email already existed", success : false });
        } else {
            res.json({message : "user not existed" , success : true})
        }
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};