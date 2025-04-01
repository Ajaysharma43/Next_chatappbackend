import pool from "../../Databaseconnection/DBConnection.js";

export const SortData = async (req, res, next) => {
    try {
        const { data, limit, page } = req.body;

        // Defaulting limit and page if not provided
        const limitVal = limit ? parseInt(limit) : 5;
        const pageVal = page ? parseInt(page) : 1;
        const offset = (pageVal - 1) * limitVal;

        // Sanitize and validate the sortBy and order inputs
        const validColumns = ['name', 'id', 'created_at']; // Replace with your valid columns
        const validOrders = ['ASC', 'DESC'];

        const sortBy = validColumns.includes(data.sortBy) ? data.sortBy : 'name'; // Default to 'name'
        const order = validOrders.includes(data.order) ? data.order : 'ASC'; // Default to 'ASC'
        const UsersData = await pool.query(`
            SELECT *, COUNT(*) OVER() AS total_records
            FROM users
            ORDER BY ${sortBy} ${order}
            LIMIT $1 OFFSET $2
        `, [limitVal, offset]);

        const totalRecords = UsersData.rowCount > 0 ? UsersData.rows[0].total_records : 0;
        const totalPages = Math.ceil(totalRecords / limitVal);

        res.status(200).json({
            Data: UsersData.rows,
            TotalPages: totalPages,
            TotalRecords: totalRecords
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
