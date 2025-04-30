import { getStorage } from "firebase-admin/storage";
import pool from "../../Databaseconnection/DBConnection.js";

// Extract file path from full GCS public URL
const getFilePathFromGCSUrl = (url) => {
    try {
        const parts = url.split(".com/audio-5f40f.appspot.com/")[1];
        if (!parts) throw new Error("Invalid URL format.");
        return parts; // In case there are spaces or encoded characters
    } catch (error) {
        throw new Error("Failed to extract file path from URL.");
    }
};

export const DeletePost = async (req, res) => {
    try {
        const { imageUrl , userid , imageid } = req.query;

        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required", success: false });
        }

        const storage = getStorage(); 
        const bucket = storage.bucket(); 

        const filePath = getFilePathFromGCSUrl(imageUrl); 

        await bucket.file(filePath).delete();

        const DeletePostFromDB = await pool.query(`
            DELETE FROM Images_Uploads
            WHERE id = $1
            ` , [imageid])

        res.status(200).json({ message: "File deleted successfully", success: true , imageid : imageid });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Error deleting file", success: false, error: error });
    }
};
