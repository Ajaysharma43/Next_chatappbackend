import pool from "../../Databaseconnection/DBConnection.js";
import admin from "../../FirebaseSetup/InitilizeFirebaseApp.js";

export const UploadImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { id, name } = req.body;

        if (!file) {
            return res.status(404).json({ message: "data not found to upload", success: false })
        }



        const bucket = admin.storage().bucket()
        const fileName = `Chatapp/Uploads/${Date.now()}_${file.originalname}`;
        const Uploadfile = bucket.file(fileName)

        await Uploadfile.save(file.buffer, {
            contentType: file.minitype,
            public: true
        })

        const publicUrl = `${process.env.FIREBASE_URL}/${bucket.name}/${fileName}`;

        const SaveFile = await pool.query(`
            INSERT INTO Images_Uploads(user_id , name , image_url)
            VALUES($1 , $2 , $3)
            RETURNING *
            `, [id, name, publicUrl])
        res.status(200).json({ message: "image is successfully uploaded and url is saved in the database", success: true, data: SaveFile.rows })
    } catch (error) {
        res.status(404).json({ message: "error occured while uploading the image", success: false, error: error })
        console.log(error)
    }
}