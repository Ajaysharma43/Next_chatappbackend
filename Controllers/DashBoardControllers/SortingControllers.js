import pool from "../../Databaseconnection/DBConnection";

export const SortData  = async (req , res, next ) => {
     const {Page , Limit , skip} = req.body;
     const res = await pool.query(`
        SELECT * FROM users
        `)
     
}