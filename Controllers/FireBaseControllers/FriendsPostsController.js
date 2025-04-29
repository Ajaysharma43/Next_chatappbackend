import pool from "../../Databaseconnection/DBConnection.js";

export const GetFriendsPosts = async (req, res, next) => {
    try {
        const { userid } = req.query;
        const FriendsPosts = await pool.query(`
                    SELECT 
            iu.*,
            users.id AS user_id,
            users.profilepic,
            COUNT(DISTINCT l.user_id) AS like_count,
            COUNT(DISTINCT c.id) AS comment_count,
            CASE 
                WHEN ul.image_id IS NOT NULL THEN true
                ELSE false
            END AS is_liked_by_user
            FROM images_uploads iu

            INNER JOIN friends f 
            ON (f.sender_id = iu.user_id OR f.receiver_id = iu.user_id)

            LEFT JOIN image_likes l ON l.image_id = iu.id
            LEFT JOIN image_comments c ON c.image_id = iu.id
            LEFT JOIN users ON users.id = iu.user_id

            
            LEFT JOIN image_likes ul 
            ON ul.image_id = iu.id AND ul.user_id = $1

            WHERE 
            (f.sender_id = $1 OR f.receiver_id = $1)
            AND iu.user_id != $1

            GROUP BY iu.id, users.id, users.profilepic ,ul.image_id
            ORDER BY iu.id DESC;`, [userid])
        res.status(200).json({ message: "friends posts is successfully fetched", success: true, FriendsPosts: FriendsPosts.rows })
    } catch (error) {
        res.status(404).json({ message: "error while fetching the user friends posts", success: false, error: error })
    }
}