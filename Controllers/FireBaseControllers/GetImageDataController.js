import pool from "../../Databaseconnection/DBConnection.js"

export const GetImagesData = async (req, res, next) => {
    try {
        const { imageid } = req.query;
        const ImagesData = await pool.query(`
            SELECT 
            iu.id,
            iu.user_id,
            iu.name,
            iu.image_url,
            iu.created_at,
            COALESCE(l.like_count, 0) AS like_count,
            COALESCE(c.comment_count, 0) AS comment_count
            FROM Images_Uploads iu
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
            WHERE iu.id = $1;
            `, [imageid])

        const ImageLikes = await pool.query(`
                SELECT 
                image_likes.id AS like_id,
                image_likes.image_id,
                image_likes.user_id,
                image_likes.created_at AS like_created_at,
                users.name AS user_name,
                users.email AS user_email,
                users.profilepic AS user_profilepic
                FROM image_likes
                INNER JOIN users ON users.id = image_likes.user_id
                WHERE image_likes.image_id = $1;
                `, [imageid])

        const ImageComment = await pool.query(`
                SELECT 
                image_comments.id AS like_id,
                image_comments.image_id,
                image_comments.user_id,
                image_comments.created_at AS comment_created_at,
                image_comments.comment AS comment,
                users.name AS user_name,
                users.email AS user_email,
                users.profilepic AS user_profilepic
                FROM image_comments
                INNER JOIN users ON users.id = image_comments.user_id
                WHERE image_comments.image_id = $1;
                    `, [imageid])

        res.status(200).json({ message: "the image is successfully fetched", success: true, ImageData: ImagesData.rows, Likes: ImageLikes.rows, Comment: ImageComment.rows })
    } catch (error) {
        res.status(200).json({ message: "error while getting the images data", success: false, error: error })
    }
}