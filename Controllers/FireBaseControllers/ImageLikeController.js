import pool from "../../Databaseconnection/DBConnection.js";

export const CheckLike = async (req, res, next) => {
    try {
        const { imageid, userid } = req.body;
        const CheckLikes = await pool.query(`
            SELECT * FROM image_likes
            WHERE image_id = $1 AND user_id = $2
            `, [imageid, userid])
        if (CheckLikes.rowCount == 1) {
            const DeleteLiked = await pool.query(`
                    DELETE FROM image_likes
                    WHERE image_id = $1 AND user_id = $2
                    `, [imageid, userid])
            res.status(200).json({ message: "image is removed from liked by the user", success: true })
        }
        else {
            next()
        }
    } catch (error) {
        res.status(404).json({ message: "error while checking like on the image", success: false, error: error })
    }
}

export const AddLikedImage = async (req, res, next) => {
    try {
        const { imageid, userid } = req.body;

        const LikeImage = await pool.query(`
            INSERT INTO image_likes(image_id , user_id)
            VALUES($1 , $2)
            RETURNING *
            `, [imageid, userid])
        if (LikeImage.rowCount == 1) {
            res.status(200).json({ message: "image is successfully added to the to the liked images", success: true, LikeImage: LikeImage.rows })
        }
        else {
            res.status(200).json({ message: "failed to add image to the liked list", success: false })
        }
    } catch (error) {
        res.status(404).json({ message: "error while adding image to the liked images", success: false, error: error })
    }
}