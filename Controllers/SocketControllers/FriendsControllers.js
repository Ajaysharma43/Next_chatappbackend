import pool from "../../Databaseconnection/DBConnection.js";

export const Friends = async (req, res, next) => {
  try {
    const { id, data } = req.body;

    const FriendsData = await pool.query(`
SELECT 
    f.*,
    u1.id AS sender_user_id,
    u1.name AS sender_name,
    u1.email AS sender_email,
    u1.profilepic AS sender_profile,
    u2.id AS receiver_user_id,
    u2.name AS receiver_name,
    u2.email AS receiver_email,
    u2.profilepic AS receiver_profile,
    pc.message AS last_message,
    pc.created_at AS last_message_time,
    bu.blocked_id AS Blocked_id,
    -- Check if either user blocked the other
    CASE 
        WHEN bu.blocker_id IS NOT NULL THEN true 
        ELSE false 
    END AS is_blocked

FROM friends f
INNER JOIN users u1 ON f.sender_id = u1.id
INNER JOIN users u2 ON f.receiver_id = u2.id

-- Last message per friend pair
LEFT JOIN LATERAL (
    SELECT pc.message, pc.created_at
    FROM personalchat pc
    WHERE (
        (pc.sender = f.sender_id AND pc.receiver = f.receiver_id)
        OR 
        (pc.sender = f.receiver_id AND pc.receiver = f.sender_id)
    )
    ORDER BY pc.created_at DESC
    LIMIT 1
) pc ON true

-- Blocked users logic (either direction)
LEFT JOIN blockedusers bu ON 
    (bu.blocker_id = f.sender_id AND bu.blocked_id = f.receiver_id)
    OR
    (bu.blocker_id = f.receiver_id AND bu.blocked_id = f.sender_id)

-- Filter for the current user
WHERE f.sender_id = $1 OR f.receiver_id = $1

-- Sort by latest message time (nulls last)
ORDER BY pc.created_at DESC NULLS LAST;


    `, [id]);

    res.status(200).json({
      message: "Data fetched successfully",
      FriendsData: FriendsData.rows,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error while fetching friends",
      error: error.message,
    });
  }
};

export const UpdateFriendsData = async (id) => {
  try {
    const FriendsData = await pool.query(`
     SELECT 
    f.*,
    u1.id AS sender_user_id,
    u1.name AS sender_name,
    u1.email AS sender_email,
    u1.profilepic AS sender_profile,
    u2.id AS receiver_user_id,
    u2.name AS receiver_name,
    u2.email AS receiver_email,
    u2.profilepic AS receiver_profile,
    pc.message AS last_message,
    pc.created_at AS last_message_time,
    bu.blocked_id AS Blocked_id,
    -- Check if either user blocked the other
    CASE 
        WHEN bu.blocker_id IS NOT NULL THEN true 
        ELSE false 
    END AS is_blocked

FROM friends f
INNER JOIN users u1 ON f.sender_id = u1.id
INNER JOIN users u2 ON f.receiver_id = u2.id

-- Last message per friend pair
LEFT JOIN LATERAL (
    SELECT pc.message, pc.created_at
    FROM personalchat pc
    WHERE (
        (pc.sender = f.sender_id AND pc.receiver = f.receiver_id)
        OR 
        (pc.sender = f.receiver_id AND pc.receiver = f.sender_id)
    )
    ORDER BY pc.created_at DESC
    LIMIT 1
) pc ON true

-- Blocked users logic (either direction)
LEFT JOIN blockedusers bu ON 
    (bu.blocker_id = f.sender_id AND bu.blocked_id = f.receiver_id)
    OR
    (bu.blocker_id = f.receiver_id AND bu.blocked_id = f.sender_id)

-- Filter for the current user
WHERE f.sender_id = $1 OR f.receiver_id = $1

-- Sort by latest message time (nulls last)
ORDER BY pc.created_at DESC NULLS LAST;

  
    `, [id]);

    return FriendsData.rows
  } catch (error) {
    console.log(error)
  }

}