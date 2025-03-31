import pool from "../../Databaseconnection/DBConnection.js";

export const FindUser = async (req, res, next) => {
    try {
        const { formData } = req.body;
        const existed = await pool.query(`
        SELECT * FROM users
        WHERE id = $1
        `, [formData.id])
        if (existed.rowCount >= 1) {
            next()
        }
        else {
            res.status(404).json({ message: "user not found", Success: false })
        }
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

export const UpdateUser = async (req, res, next) => {
    try {
        const { formData } = req.body;
        const UpdateUser = await pool.query(`
        UPDATE users
        SET name = $1 , phone = $2 , street = $3 , city = $4 , country = $5 , postal_code = $6 , roles = $7
        where id = $8 
        `, [formData.name, formData.phone, formData.street, formData.city, formData.country, formData.postal_code , formData.roles , formData.id])

        res.json({ message: "successfully updated", Success: true })
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: error })
    }

}