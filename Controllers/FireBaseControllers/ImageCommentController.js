import pool from "../../Databaseconnection/DBConnection.js";

export const ImageCommentController = async (req, res, next) => {
    try {
        const { imageid, userid, comment } = req.body;
        const CommentOnImage = await pool.query(`
            WITH inserted_comment AS (
            INSERT INTO image_comments (image_id, user_id, comment)
            VALUES ($1, $2, $3)
            RETURNING *
            )
            SELECT 
            inserted_comment.*,
            users.name,
            users.profilepic
            FROM inserted_comment
            JOIN users ON users.id = inserted_comment.user_id;
            `, [imageid, userid, comment])
        if (CommentOnImage.rowCount == 1) {
            res.status(200).json({ message: "comment is successfully added on the image", success: true, Comment: CommentOnImage.rows })
        }
        else {
            res.status(404).json({ message: "failed to add comment on image", success: false })
        }

    } catch (error) {
        res.status(404).json({ message: "error while adding comment to the image", success: false, error: error })
    }
}