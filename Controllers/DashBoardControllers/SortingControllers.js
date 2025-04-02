import pool from "../../Databaseconnection/DBConnection.js";

// Utility function for pagination
const getPagination = (limit, page) => {
    const limitVal = limit ? parseInt(limit, 10) : 5;
    const pageVal = page ? parseInt(page, 10) : 1;
    const offset = (pageVal - 1) * limitVal;
    return { limitVal, pageVal, offset };
};

// Utility function to validate sorting parameters
const validateSorting = (sortBy, order) => {
    const validColumns = ['name', 'id', 'created_at'];
    const validOrders = ['ASC', 'DESC'];
    return {
        sortBy: validColumns.includes(sortBy) ? sortBy : 'name',
        order: validOrders.includes(order) ? order : 'ASC'
    };
};

// Time-based sorting function
const Timesorting = async (req, res, next, data, limit, page) => {
    try {
        if (!data.time?.From || !data.time?.To) {
            return res.status(400).json({ error: "Both 'From' and 'To' dates are required." });
        }

        const { limitVal, offset } = getPagination(limit, page);
        const { order } = validateSorting('created_at', data.order);

        const UsersData = await pool.query(
            `SELECT *, COUNT(*) OVER() AS total_records
             FROM users
             WHERE created_at BETWEEN $1 AND $2
             ORDER BY created_at ${order}
             LIMIT $3 OFFSET $4`,
            [data.time.From, data.time.To, limitVal, offset]
        );

        const totalRecords = UsersData.rows.length > 0 ? UsersData.rows[0].total_records : 0;
        const totalPages = Math.ceil(totalRecords / limitVal);

        return res.status(200).json({
            Data: UsersData.rows,
            TotalPages: totalPages,
            TotalRecords: totalRecords
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Generic sorting function
export const SortData = async (req, res, next) => {
    try {
        const { data, limit, page } = req.body;

        if (data.sortBy === 'created_at') {
            return await Timesorting(req, res, next, data, limit, page);
        }

        const { limitVal, offset } = getPagination(limit, page);
        const { sortBy, order } = validateSorting(data.sortBy, data.order);

        const UsersData = await pool.query(
            `SELECT *, COUNT(*) OVER() AS total_records
             FROM users
             ORDER BY ${sortBy} ${order}
             LIMIT $1 OFFSET $2`,
            [limitVal, offset]
        );

        const totalRecords = UsersData.rows.length > 0 ? UsersData.rows[0].total_records : 0;
        const totalPages = Math.ceil(totalRecords / limitVal);

        return res.status(200).json({
            Data: UsersData.rows,
            TotalPages: totalPages,
            TotalRecords: totalRecords
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const SearchData = async (req, res, next) => {
    try {
        const { SearchUserData, limit, page } = req.body;

        if (!SearchUserData) {
            return res.status(400).json({ error: "Search term is required." , Success: false });
        }

        const offset = (page - 1) * limit;

        // Fetch total count of matching records
        const totalCountResult = await pool.query(
            `SELECT COUNT(*) FROM users
             WHERE name ILIKE $1`,
            [`%${SearchUserData}%`]
        );

        const totalRecords = parseInt(totalCountResult.rows[0].count, 10);

        // Fetch paginated results
        const UserData = await pool.query(
            `SELECT * FROM users 
            WHERE name ILIKE $1  
            LIMIT $2 OFFSET $3`,
            [`%${SearchUserData}%`, limit, offset]
        );

        return res.status(200).json({
            Data: UserData.rows,
            TotalRecords: totalRecords,
            TotalPages: Math.ceil(totalRecords / limit),
            Success: true
        });

    } catch (error) {
        return res.status(500).json({ error: error.message , Success: false });
    }
};
