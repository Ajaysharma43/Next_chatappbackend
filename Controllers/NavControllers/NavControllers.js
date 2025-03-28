import pool from "../../Databaseconnection/DBConnection.js"

export const VerifyRole = async (req, res, next) => {
    try {
        const { role } = req.query;
        const Role = await pool.query(`
            SELECT modules , route , roles , access , user_roles FROM modules
            INNER JOIN permissions ON modules.id = permissions.modules_id
            WHERE $1 = ANY(user_roles)
            `, [role])
        res.status(200).json({ message: Role.rows })
    } catch (error) {
        res.status(404).json({ error: error })
    }

}