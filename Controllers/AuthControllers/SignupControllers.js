import pool from "../../Databaseconnection/DBConnection.js";

export const CreateUser = async(req , res , next) => {
    try {
        const data = req.body;
        const result = await pool.query(
            `INSERT INTO users (name, email, phone, street, city, country, postalCode) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`, 
            [data.name, data.email, data.phone, data.street, data.city, data.country, data.postalCode]
        );
    } catch (error) {
        
    }
}