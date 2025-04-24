import pool from "../../Databaseconnection/DBConnection.js";

export const GetUsersImageData = async (req, res, next) => {
    try {
        const { userid } = req.query;
        const GetUserData = await pool.query(`
            SELECT 
            iu.id AS image_id,
            iu.user_id,
            iu.name,
            iu.image_url,
            iu.created_at,
            COALESCE(l.like_count, 0) AS like_count,
            COALESCE(c.comment_count, 0) AS comment_count,
            u.profilepic
            FROM images_uploads iu
            LEFT JOIN (
            SELECT image_id, COUNT(*) AS like_count
            FROM image_likes
            GROUP BY image_id
            ) l ON l.image_id = iu.id
            LEFT JOIN (
            SELECT image_id, COUNT(*) AS comment_count
            FROM image_comments
            GROUP BY image_id
            ) c ON c.image_id = iu.id
            INNER JOIN users u ON u.id = iu.user_id
            WHERE iu.user_id = $1;
            `, [userid])
        res.status(200).json({ message: "the image data of the user is successfully fetched", success: true, UserImagesData: GetUserData.rows })
    } catch (error) {
        res.status(404).json({ message: "error occurred while getting the users image", success: false, error: error })
    }
}