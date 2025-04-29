import pool from "../../Databaseconnection/DBConnection.js";

export const GetUserDetails = async (req, res, next) => {
    try {
        const { userid } = req.query;
        const UserDetails = await pool.query(`
            SELECT 
            u.id AS user_id,
            u.name,
            u.profilepic,
            COALESCE(p.post_count, 0) AS post_count,
            COALESCE(followers.follower_count, 0) AS followers_count,
            COALESCE(following.following_count, 0) AS following_count
            FROM users u
            LEFT JOIN (
            SELECT user_id, COUNT(*) AS post_count
            FROM images_uploads
            GROUP BY user_id
            ) p ON p.user_id = u.id
            LEFT JOIN (
            SELECT receiver_id AS user_id, COUNT(*) AS follower_count
            FROM friends
            GROUP BY receiver_id
            ) followers ON followers.user_id = u.id
            LEFT JOIN (
            SELECT sender_id AS user_id, COUNT(*) AS following_count
            FROM friends
            GROUP BY sender_id
            ) following ON following.user_id = u.id
            WHERE u.id = $1;
            ` , [userid])

        const UserFollowingData = await pool.query(`
                SELECT 
                friends.id,
                friends.sender_id,
                friends.receiver_id,
                friends.created_at,
                users.id,
                users.name,
                users.profilepic
                FROM friends
                INNER JOIN users ON users.id = receiver_id
                WHERE friends.sender_id = $1
                ` , [userid])
        const UserFollowerData = await pool.query(`
                SELECT 
                friends.id,
                friends.sender_id,
                friends.receiver_id,
                friends.created_at,
                users.id,
                users.name,
                users.profilepic
                FROM friends
                INNER JOIN users ON users.id = sender_id
                WHERE friends.receiver_id = $1
                ` , [userid])

        const UserImagesUploadData = await pool.query(`
                SELECT 
                iu.id AS image_id,
                iu.name,
                iu.image_url,
                iu.description,
                iu.created_at,
                COALESCE(l.like_count, 0) AS like_count,
                COALESCE(c.comment_count, 0) AS comment_count,
                CASE 
                    WHEN ul.image_id IS NOT NULL THEN true
                    ELSE false
                END AS is_liked_by_user
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
            LEFT JOIN (
                SELECT image_id
                FROM image_likes
                WHERE user_id = $1  -- <-- your current user's ID
            ) ul ON ul.image_id = iu.id
            WHERE iu.user_id = $1
            ORDER BY iu.created_at DESC;
                    `, [userid])
        res.status(200).json({ message: "user data is successfully fetched", success: true, UserDetails: UserDetails.rows, UserFollowerData: UserFollowerData.rows, UserFollowingData: UserFollowingData.rows, UserImagesUploadData: UserImagesUploadData.rows })
    } catch (error) {
        res.status(404).json({ message: "error while getting the user details", success: false, error: error })
    }
}