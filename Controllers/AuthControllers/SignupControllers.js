import pool from "../../Databaseconnection/DBConnection.js";

export const CreateUser = async (req, res, next) => {
    try {
        const { newUserData } = req.body;
        console.log(newUserData);
        
        const result = await pool.query(
            `INSERT INTO users (name, email, phone, street, city, country, postal_code , password) 
             VALUES ($1, $2, $3, $4, $5, $6, $7 , $8) 
             RETURNING *`,
            [newUserData.name, newUserData.email, newUserData.phone, newUserData.street, newUserData.city, newUserData.country, newUserData.postalCode , newUserData.password]
        );

        if (result.rows.length > 0) {
            return res.status(201).json({
                success: true,
                message: "User created successfully!",
                user: result.rows[0], 
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Failed to create user. Please try again.",
            });
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            error: error.detail,
        });
    }
};
