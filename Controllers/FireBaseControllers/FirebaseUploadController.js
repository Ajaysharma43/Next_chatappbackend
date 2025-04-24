import sharp from 'sharp';
import pool from "../../Databaseconnection/DBConnection.js";
import admin from "../../FirebaseSetup/InitilizeFirebaseApp.js";

export const UploadImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { id, name, description } = req.body;

        if (!file) {
            return res.status(404).json({ message: "data not found to upload", success: false });
        }

        const processedImage = await sharp(file.buffer)
            .resize({ width: 800 }) 
            .jpeg({ quality: 80 })  
            .toBuffer();

        const bucket = admin.storage().bucket();
        const fileName = `Chatapp/Uploads/${Date.now()}_${file.originalname}`;
        const Uploadfile = bucket.file(fileName);

        await Uploadfile.save(processedImage, {
            contentType: 'image/jpeg',
            public: true
        });

        const publicUrl = `${process.env.FIREBASE_URL}/${bucket.name}/${fileName}`;

        const SaveFile = await pool.query(`
            INSERT INTO Images_Uploads(user_id, name, image_url, description)
            VALUES($1, $2, $3, $4)
            RETURNING *
        `, [id, name, publicUrl, description]);

        res.status(200).json({
            message: "Image is successfully uploaded and URL is saved in the database",
            success: true,
            data: SaveFile.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while uploading the image",
            success: false,
            error: error.message
        });
    }
};
