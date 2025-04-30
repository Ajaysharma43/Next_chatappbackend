import pool from "../../Databaseconnection/DBConnection.js";

export const CheckHiddenStatus = async (req , res , next) => {
    try {
        const { imageid } = req.body;

        const CheckHidden = await pool.query(`
            SELECT * FROM images_uploads
            WHERE id = $1
            ` , [imageid])

            if(CheckHidden.rows[0].hidden == true)
            {
                const HidePost = await pool.query(`
                    UPDATE images_uploads
                    SET hidden = $1
                    WHERE id = $2
                    RETURNING *
                    ` , [false , imageid])
                res.status(200).json({message : "Removed From hidden" , success : true , HidePost : HidePost.rows , hidden : false , imageid : imageid})
            }
            else
            {
                next()
            }
    } catch (error) {
        res.status(404).json({ message: "error while hiding the post", success: false, error: error })
    }
}

export const HideImage = async (req , res , next) => {
    try {
        const { imageid } = req.body;

        const HidePost = await pool.query(`
            UPDATE images_uploads
            SET hidden = $1
            WHERE id = $2
            RETURNING *
            ` , [true , imageid])

            res.status(200).json({message : "Added to Hidden" , success : true , HidePost : HidePost.rows , hidden : true , imageid : imageid})
    } catch (error) {
        res.status(404).json({ message: "error while hiding the post", success: false, error: error })
    }
}