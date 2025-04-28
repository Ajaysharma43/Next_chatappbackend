import pool from "../../Databaseconnection/DBConnection.js"

export const GetComments = async (req , res , next) => {
    try {
        const {imageid , userid} = req.query
        const Comments = await pool.query(`
            SELECT 
            image_comments.id,
            image_comments.image_id,
            image_comments.user_id,
            image_comments.comment,
            image_comments.created_at,
            users.name,
            users.profilepic
            FROM image_comments
            INNER JOIN users ON users.id = image_comments.user_id
            WHERE image_comments.image_id = $1
            ORDER BY image_comments.created_at ASC
            `,[imageid])
            res.status(200).json({message : 'comments data is successfully fetched' , success : true , Comments : Comments.rows})
    } catch (error) {
        res.status(404).json({message : "error while fetching comment from db" , success : false , error : error})
    }
}