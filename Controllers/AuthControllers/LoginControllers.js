import pool from "../../Databaseconnection/DBConnection.js";
import jwt from 'jsonwebtoken'

export const ValidateEmail = (req, res, next) => {
    try {
        const { formData } = req.body;

        if (/\S+@\S+\.\S+/.test(formData.email)) {
            return next()
        }
        else {
            res.status(404).json({ success: false, Message: "Email not valid" })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

export const ValidateLoginDetails = async (req, res, next) => {
    try {
        const { formData } = req.body;

        const Validate = await pool.query(`
            SELECT * FROM users 
            WHERE email = $1 AND password = $2
            `, [formData.email, formData.password])

        if (Validate.rows.length == 1) {
            return next()
        }
        else {
            res.status(404).json({ message: "Login unsuccessfull", success: false })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

export const GenerateToken = async (req, res, next) => {
    try {
        const { formData } = req.body;

        const Validate = await pool.query(`
                SELECT * FROM users 
                WHERE email = $1 AND password = $2
                `, [formData.email, formData.password])

        const existed = Validate.rows.find((item) => item.email === formData.email)
        if (existed) {
            const payload = { id: existed.id }
            const AccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })
            const RefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

            res.status(200).json({ message: "Login successfully", AccessToken: AccessToken, RefreshToken: RefreshToken, success: true })
        }
        else {
            res.status(404).json({ message: "login unsuccessfull" })
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }

}