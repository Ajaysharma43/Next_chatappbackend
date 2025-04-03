import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../../Databaseconnection/DBConnection.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const SocialAuth = async (req, res, next) => {
    try {
        const { token } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        next();
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(401).json({ error: "Invalid Google Token" });
    }
};

export const CheckUser = async (userid) => {
    try {
        console.log(userid)
        console.log("Checking if user already exists...");
        const user = await pool.query(
            `SELECT * FROM users WHERE socialid = $1`,
            [userid]
        );

        return user.rowCount
    } catch (error) {
        console.error("Error checking user:", error.message);
        return null;
    }
};

export const CreateNewUser = async (req, res, next) => {
    try {
        const { token, userid } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Check if user already exists
        const existingUser = await CheckUser(userid);
        if (existingUser > 0) {
            console.log("user already existed")
            next()
        }
        else {
            // Insert new user
            const newUser = await pool.query(
                `INSERT INTO users (name, email, socialauthenticated, socialid) 
     VALUES ($1, $2, $3, $4) RETURNING id`,
                [payload.name, payload.email, payload.email_verified, userid]
            );

            console.log("New user created");
            next()
        }
    } catch (error) {
        console.error("Error creating user:", error.message);
        return res.status(500).json({ error: error.message, success: false });
    }
};

export const GenerateSocialToken = async (req, res, next) => {
    try {
        const { userid } = req.body;
        const user = await pool.query(
            `SELECT * FROM users WHERE socialid = $1`,
            [userid]
        );
        const payload = { id: user.rows.id };
        const AccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        const RefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "Login successful",
            AccessToken,
            RefreshToken,
            success: true,
        });
    } catch (error) {
        console.error("Error generating token:", error.message);
        return res.status(500).json({ error: error.message, success: false });
    }
};
