import admin from "../../FirebaseSetup/InitilizeFirebaseApp.js";
import pool from "../../Databaseconnection/DBConnection.js";
import sharp from "sharp";

export const UploadProfilePic = async (req, res, next) => {
    try {
        const file = req.file;
        const { userid } = req.body;
        if (!file) {
            return res.status(404).json({ message: "data not found to upload", success: false });
        }

        const processedImage = await sharp(file.buffer)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toBuffer();

        const bucket = admin.storage().bucket();
        const fileName = `Chatapp/profilepics/${Date.now()}_${file.originalname}`;
        const Uploadfile = bucket.file(fileName);

        await Uploadfile.save(processedImage, {
            contentType: 'image/jpeg',
            public: true
        });

        const publicUrl = `${process.env.FIREBASE_URL}/${bucket.name}/${fileName}`;

        const UpdateProfilePics = await pool.query(`
            UPDATE users
            SET profilepic = $1
            WHERE id = $2
            RETURNING *
            `, [publicUrl, userid])

        if (UpdateProfilePics.rowCount == 1) {
            res.status(200).json({ message: "user profile is successfully updated", success: true, Userdata: UpdateProfilePics.rows })
        }
        else {
            res.status(404).json({ message: "failed to save the profile pic", success: false })
        }
    } catch (error) {
        res.status(404).json({ message: "error while adding profile pic to your profile" })
    }
} 