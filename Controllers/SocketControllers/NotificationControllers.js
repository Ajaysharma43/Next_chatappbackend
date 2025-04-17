import pool from "../../Databaseconnection/DBConnection.js";

export const NotificationControllers = async (req, res, next) => {
    try {
        const { userid } = req.query;
        const GetNotifications = await pool.query(`
            SELECT * FROM notifications
            WHERE receiver_id = $1
            `, [userid])
        res.status(200).json({ message: "Notifications are successfully fetched", success: true, Notifications: GetNotifications.rows })
    } catch (error) {
        res.status(404).json({ message: "error while getting the notifications", success: false , error : error})
    }
}