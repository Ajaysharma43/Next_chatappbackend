import pool from "../../Databaseconnection/DBConnection.js";

// api's 
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

// socket connections

export const NotificationsHandler = async(sender_id , receiver_id , Message) => {
    try {
        const Notification = await pool.query(`
            INSERT INTO notifications(sender_id , receiver_id , notification)
            VALUES($1 , $2 , $3)
            `,[sender_id , receiver_id , Message])
            return true
    } catch (error) {
        console.log(error)
    }
}