import pool from "../../Databaseconnection/DBConnection.js";

export const GetAllUsers = async (req, res, next) => {
    try {
        const { user, id } = req.body;
        const UserData = await pool.query(`
                SELECT * 
                FROM users
                WHERE name ILIKE $1
                AND id NOT IN (
                SELECT blocked_id FROM blockedusers WHERE blocker_id = $2
                UNION
                SELECT blocker_id FROM blockedusers WHERE blocked_id = $2)
                ORDER BY users.created_at ASC

        `, [`%${user}%`, id])
        res.status(200).json({ UserData: UserData.rows, success: true })
    } catch (error) {
        res.status(400).json({ error: error, success: false })
    }
}

export const GetSingleUser = async (req, res) => {
    try {
        const { userid, currentUserId } = req.query;

        // ✅ Skip if either user blocked the other
        const userQuery = await pool.query(`
            SELECT 
            u.id AS user_id,
            u.name,
            u.profilepic,
            COALESCE(p.post_count, 0) AS post_count,
            COALESCE(followers.follower_count, 0) AS followers_count,
            COALESCE(following.following_count, 0) AS following_count
            FROM users u
            LEFT JOIN (
            SELECT user_id, COUNT(*) AS post_count
            FROM images_uploads
            GROUP BY user_id
            ) p ON p.user_id = u.id
            LEFT JOIN (
            SELECT receiver_id AS user_id, COUNT(*) AS follower_count
            FROM friends
            GROUP BY receiver_id
            ) followers ON followers.user_id = u.id
            LEFT JOIN (
            SELECT sender_id AS user_id, COUNT(*) AS following_count
            FROM friends
            GROUP BY sender_id
            ) following ON following.user_id = u.id
            WHERE u.id = $1
            AND u.id NOT IN (
            SELECT blocked_id FROM blockedusers WHERE blocker_id = $2
            UNION
            SELECT blocker_id FROM blockedusers WHERE blocked_id = $2
            );
        `, [parseInt(userid), parseInt(currentUserId)]);

        const UserImagesUploadData = await pool.query(`
            SELECT 
            iu.id AS image_id,
            iu.name,
            iu.image_url,
            iu.description,
            iu.created_at,
            iu.hidden,
            COALESCE(l.like_count, 0) AS like_count,
            COALESCE(c.comment_count, 0) AS comment_count,
            CASE 
                WHEN ul.image_id IS NOT NULL THEN true
                ELSE false
            END AS is_liked_by_user
        FROM images_uploads iu
        LEFT JOIN (
            SELECT image_id, COUNT(*) AS like_count
            FROM image_likes
            GROUP BY image_id
        ) l ON l.image_id = iu.id
        LEFT JOIN (
            SELECT image_id, COUNT(*) AS comment_count
            FROM image_comments
            GROUP BY image_id
        ) c ON c.image_id = iu.id
        LEFT JOIN (
            SELECT image_id
            FROM image_likes
            WHERE user_id = $1  -- <-- your current user's ID
        ) ul ON ul.image_id = iu.id
        WHERE iu.user_id = $1 AND iu.hidden = $2
        ORDER BY iu.created_at DESC;
                `, [userid, false])


        if (userQuery.rowCount === 0) {
            return res.status(404).json({ message: "User not found or blocked", success: false });
        }

        // ✅ Check if users are friends
        const friendQuery = await pool.query(`
                SELECT * FROM friends
                WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1)
        `, [parseInt(userid), parseInt(currentUserId)]);

        // ✅ Check if a friend request exists
        const requestQuery = await pool.query(`
                SELECT * FROM requests
                WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1)
        `, [parseInt(currentUserId), parseInt(userid)]);

        let relationshipStatus = "no_relation";
        let relation = false;

        if (friendQuery.rowCount > 0) {
            relationshipStatus = "friend";
            relation = true;
        } else if (requestQuery.rowCount > 0) {
            relationshipStatus = "request_sent";
            relation = true;
        }

        res.status(200).json({
            sender: requestQuery.rows[0] || null,
            user: userQuery.rows[0],
            UserImagesUploadData: UserImagesUploadData.rows,
            relationshipStatus,
            relation,
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};


export const UserFollowerAndFollowingData = async (req, res, next) => {
    try {
        const { userid } = req.query;
        const UserFollowingData = await pool.query(`
                                SELECT 
                                friends.id,
                                friends.sender_id,
                                friends.receiver_id,
                                friends.created_at,
                                users.id,
                                users.name,
                                users.profilepic
                                FROM friends
                                INNER JOIN users ON users.id = receiver_id
                                WHERE friends.sender_id = $1
                                ` , [userid])
        const UserFollowerData = await pool.query(`
                                SELECT 
                                friends.id,
                                friends.sender_id,
                                friends.receiver_id,
                                friends.created_at,
                                users.id,
                                users.name,
                                users.profilepic
                                FROM friends
                                INNER JOIN users ON users.id = sender_id
                                WHERE friends.receiver_id = $1
                                ` , [userid])

        res.status(200).json({ message: "user follower data and following data is fetched successfully", success: true, UserFollowerData: UserFollowerData.rows, UserFollowingData: UserFollowingData.rows, })

    } catch (error) {
        res.status(404).json({ message: "error occured while fetching the follower and following data from the backend", success: false, error: error })
    }
}


export const GetUserPostsData = async (req, res, next) => {
    try {
        const { userid } = req.query;
        console.log(userid)
        const UserImagesUploadData = await pool.query(`
                SELECT 
                iu.id AS image_id,
                iu.name,
                iu.image_url,
                iu.description,
                iu.created_at,
                iu.hidden,
                users.profilepic,
                COALESCE(l.like_count, 0) AS like_count,
                COALESCE(c.comment_count, 0) AS comment_count,
                CASE 
                WHEN ul.image_id IS NOT NULL THEN true
                ELSE false
                END AS is_liked_by_user
                FROM images_uploads iu
                LEFT JOIN (
                SELECT image_id, COUNT(*) AS like_count
                FROM image_likes
                GROUP BY image_id
                ) l ON l.image_id = iu.id
                LEFT JOIN (
                SELECT image_id, COUNT(*) AS comment_count
                FROM image_comments
                GROUP BY image_id
                ) c ON c.image_id = iu.id
                LEFT JOIN (
                SELECT image_id
                FROM image_likes
                WHERE user_id = $1  -- <-- your current user's ID
                ) ul ON ul.image_id = iu.id
                LEFT JOIN (
                SELECT id , profilepic 
                from users
                WHERE id = $1) users ON users.id = iu.user_id
                WHERE iu.user_id = $1 AND iu.hidden = $2
                ORDER BY iu.created_at DESC;
                `, [userid, false])

        res.status(200).json({ message: "the user posts data is successfully fetched", success: true, UserImagesUploadData: UserImagesUploadData.rows })
    } catch (error) {
        res.status(404).json({ messagee: "error occured while fetching the user posts data", success: false, error: error })
    }
}