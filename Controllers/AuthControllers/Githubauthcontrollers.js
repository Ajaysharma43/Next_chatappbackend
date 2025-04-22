import pool from "../../Databaseconnection/DBConnection.js";
import jwt from 'jsonwebtoken'

export const CheckGithubUser = async (req, res, next) => {
    try {
        const { token } = req.body;
        const FindUser = await pool.query(`
            SELECT * FROM users
            WHERE socialid = $1
            `, [token.id])
        if (FindUser.rowCount == 1) {
            const payload = { id: FindUser.rows[0].id, username: FindUser.rows[0].name , socialauthenticated:  FindUser.rows[0].socialauthenticated , profile :  FindUser.rows[0].profilepic , role : FindUser.rows[0].roles}
            const AccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })
            const RefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
            res.status(200).json({ message: "user is already existed", success: true, AccessToken: AccessToken, RefreshToken: RefreshToken })
        }
        else {
            next()
        }
    } catch (error) {
        res.status(404).json({ message: "error occoured while finding a user", success: false })
    }
}


export const CreateGithubUser = async (req, res, next) => {
    try {
        const { token } = req.body;
        const CreateUser = await pool.query(`
            INSERT INTO users(socialid , name , socialauthenticated , profilepic)
            VALUES ($1 , $2 , $3 , $4 )
            RETURNING *
            ` , [token.id, token.name, true, token.profile])
        if (CreateUser.rowCount == 1) {
            next()
        }
        else {
            res.status(404).json({ message: "user is not created", success: false })
        }
    } catch (error) {
        res.status(404).json({ message: "error while create a github user", success: "false", error: error })
    }
}

export const GenerateGithubToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        const FindUser = await pool.query(`
            SELECT * FROM users
            WHERE socialid = $1
            ` , [token.id])
        const payload = { id: FindUser.rows[0].id, username: FindUser.rows[0].name  ,socialauthenticated:  FindUser.rows[0].socialauthenticated , profile :  FindUser.rows[0].profilepic , role : FindUser.rows[0].roles}
        const AccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })
        const RefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({ message: "user is created successfully by github login", success: true, AccessToken: AccessToken, RefreshToken: RefreshToken })
    } catch (error) {
        res.status(404).json({ message: 'Failed to generate token for github login', success: false })
    }
}