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

const SearchTimesorting = async (req, res, next, SearchUserData, data, limit, page) => {
    try {
        if (!data.time?.From || !data.time?.To) {
            return res.status(400).json({ error: "Both 'From' and 'To' dates are required." });
        }

        const { limitVal, offset } = getPagination(limit, page);
        const { order } = validateSorting('created_at', data.order);

        const UsersData = await pool.query(
            `SELECT *, COUNT(*) OVER() AS total_records
             FROM users
             WHERE name ILIKE $1 
             AND created_at BETWEEN $2 AND $3
             ORDER BY created_at ${order}
             LIMIT $4 OFFSET $5`,
            [`%${SearchUserData}%`, data.time.From, data.time.To, limitVal, offset]
        );


        const totalRecords = UsersData.rows.length > 0 ? UsersData.rows[0].total_records : 0;
        const totalPages = Math.ceil(totalRecords / limitVal);

        return res.status(200).json({
            UserData: UsersData.rows,
            TotalPages: totalPages,
            TotalRecords: totalRecords,
            Success: true
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const SearchData = async (req, res, next) => {
    try {
        const { SearchUserData, limit, page } = req.body;
        if (!SearchUserData) {
            return res.status(400).json({ error: "Search term is required.", Success: false });
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
        return res.status(500).json({ error: error.message, Success: false });
    }
};



export const SearchSortedData = async (req, res, next) => {
    try {
        const { SearchUserData, data, limit, page } = req.body;

        if (!SearchUserData || typeof SearchUserData !== 'string') {
            return res.status(400).json({ message: "Invalid search input", Success: false });
        }

        if (!data || !data.sortBy) {
            return res.status(400).json({ message: "Sorting criteria is required", Success: false });
        }

        if (data.sortBy === 'created_at') {
            return await SearchTimesorting(req, res, next, SearchUserData, data, limit, page);
        }

        const { limitVal, offset } = getPagination(limit, page);
        const { sortBy, order } = validateSorting(data.sortBy, data.order);

        // Prevent SQL Injection by validating allowed columns for sorting
        const allowedSortFields = ['name', 'id', 'created_at']; // Add valid fields
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: "Invalid sorting field", Success: false });
        }

        const UserData = await pool.query(
            `SELECT *, COUNT(*) OVER() AS total_records FROM users 
            WHERE name ILIKE $1
            ORDER BY ${sortBy} ${order}  
            LIMIT $2 OFFSET $3`,
            [`%${SearchUserData}%`, limitVal, offset]
        );

        if (UserData.rows.length === 0) {
            return res.status(404).json({ message: "No users found", Success: false });
        }

        const totalRecords = UserData.rows[0]?.total_records || 0;
        const totalPages = Math.ceil(totalRecords / limitVal);

        res.status(200).json({
            UserData: UserData.rows,
            TotalPages: totalPages,
            TotalRecords: totalRecords,
            Success: true
        });
    } catch (error) {
        console.error("Error in SearchSortedData:", error);
        res.status(500).json({ message: "Internal Server Error", Success: false });
    }
};