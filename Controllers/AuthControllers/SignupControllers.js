import pool from "../../Databaseconnection/DBConnection.js";

export const CreateUser = async (req, res, next) => {
    try {
        const { formData } = req.body;

        const result = await pool.query(
            `INSERT INTO users (name, email, phone, street, city, country, postal_code) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [formData.name, formData.email, formData.phone, formData.street, formData.city, formData.country, formData.postalCode]
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
            error: error.message,
        });
    }
};
