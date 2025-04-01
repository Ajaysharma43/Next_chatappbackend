import pool from "../../Databaseconnection/DBConnection.js";

export const GetUsers = async (req, res, next) => {
    try {
        let { Limit, page } = req.query;

        // Default limit
        Limit = Limit ? parseInt(Limit) : 5;
        const Offset = (page ? parseInt(page) - 1 : 0) * Limit;

        // Optimized Query: Get total records & paginated data in one query
        const UsersData = await pool.query(`
            SELECT *, COUNT(*) OVER() AS total_records 
            FROM users 
            LIMIT $1 OFFSET $2
        `, [Limit, Offset]);

        // Extract total records from the first row
        const TotalRecords = UsersData.rowCount > 0 ? UsersData.rows[0].total_records : 0;
        const TotalPages = Math.ceil(TotalRecords / Limit);

        res.status(200).json({
            Data: UsersData.rows,
            TotalPages,
            TotalRecords
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
