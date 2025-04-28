import pool from "../../Databaseconnection/DBConnection.js";

export const DeleteComment = async (req, res, next) => {
    try {
        const { commentid , imageid } = req.query;
        const CommentDelete = await pool.query(`
            DELETE FROM image_comments
            WHERE id = $1
            `, [commentid])
        res.status(200).json({ message: "message is successfully deleted", success: false, id: commentid , imageid : imageid })
    } catch (error) {
        res.status(404).json({ message: "error while deleting the comment", success: false, error: error })
    }
}