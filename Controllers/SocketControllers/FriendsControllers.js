import pool from "../../Databaseconnection/DBConnection.js";

export const Friends = async (req, res, next) => {
  try {
    const { id, data } = req.body;

    const FriendsData = await pool.query(`
      SELECT 
        f.*,
        u1.id AS sender_user_id,
        u1.name AS sender_name,
        u1.email AS sender_email,
        u2.id AS receiver_user_id,
        u2.name AS receiver_name,
        u2.email AS receiver_email
      FROM friends f
      INNER JOIN users u1 ON f.sender_id = u1.id
      INNER JOIN users u2 ON f.receiver_id = u2.id
      WHERE f.sender_id = $1 OR f.receiver_id = $1
    `, [id]);

    res.status(200).json({
      message: "Data fetched successfully",
      FriendsData: FriendsData.rows,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error while fetching friends",
      error: error.message,
    });
  }
};
