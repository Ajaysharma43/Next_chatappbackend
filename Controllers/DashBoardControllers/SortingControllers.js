import pool from "../../Databaseconnection/DBConnection.js";

const Timesorting = async (req, res, next, data, limit, page) => {
    try {
        const limitVal = limit ? parseInt(limit) : 5;
        const pageVal = page ? parseInt(page) : 1;
        const offset = (pageVal - 1) * limitVal;

        // Validate date inputs
        if (!data.time.From || !data.time.To) {
            return res.status(400).json({ error: "Both 'From' and 'To' dates are required." });
        }

        const validOrders = ['ASC', 'DESC'];
        const order = validOrders.includes(data.order) ? data.order : 'ASC'; // Default to 'ASC'

        const UsersData = await pool.query(`
            SELECT *, COUNT(*) OVER() AS total_records
            FROM users
            WHERE created_at BETWEEN $1 AND $2
            ORDER BY created_at ${order}  
            LIMIT $3 OFFSET $4
        `, [data.time.From, data.time.To, limitVal, offset]);

        const totalRecords = UsersData.rowCount > 0 ? UsersData.rows[0].total_records : 0;
        const totalPages = Math.ceil(totalRecords / limitVal);

        res.status(200).json({
            Data: UsersData.rows,
            TotalPages: totalPages,
            TotalRecords: totalRecords
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const SortData = async (req, res, next) => {
    try {
        const { data, limit, page } = req.body;

        if (data.sortBy === 'created_at') {
            return await Timesorting(req, res, next, data, limit, page);
        }

        // Default limit and page values
        const limitVal = limit ? parseInt(limit) : 5;
        const pageVal = page ? parseInt(page) : 1;
        const offset = (pageVal - 1) * limitVal;

        // Sanitize and validate sorting parameters
        const validColumns = ['name', 'id', 'created_at'];
        const validOrders = ['ASC', 'DESC'];

        const sortBy = validColumns.includes(data.sortBy) ? data.sortBy : 'name'; // Default: name
        const order = validOrders.includes(data.order) ? data.order : 'ASC'; // Default: ASC

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
        res.status(500).json({ error: error.message });
    }
};


export const SearchData = (req, res, next) => {
    const { data, limit, page } = req.body;
}