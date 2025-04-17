import pool from "../../Databaseconnection/DBConnection.js"

// API Controllers
export const GetGroups = async (req, res, next) => {
    try {
        const { userid } = req.query;
        const Groups = await pool.query(`
        SELECT *
        FROM groups
        WHERE id IN (
            SELECT group_id FROM group_members WHERE user_id = $1
        )
        OR created_by = $1
        `, [userid])
        res.status(200).json({ message: "Groups data is successfully fetched", Groups: Groups.rows, success: true })
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: "Failed to fetched groups data ", success: false })
    }

}

// Socket Controllers
export const CreateChatGroups = async (groupData) => {
    try {
        const CreateGroup = await pool.query(`
                INSERT INTO groups(name , description , created_by)
                VALUES($1 , $2 , $3)
                RETURNING *
            `, [groupData.GroupName, groupData.Description, groupData.createdBy])
        return CreateGroup.rows
    } catch (error) {
        console.log(error)
    }
}

export const AddMembers = async (groupData, CreateGroup) => {
    try {
        for (let i = 0; i < groupData.members.length; i++) {
            const AddMembersToGroup = await pool.query(`
                INSERT INTO group_members(user_id , group_id)
                VALUES($1 , $2)
                `, [groupData.members[i], CreateGroup[0].id])
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

export const GetChatGroups = async (userid) => {
    try {
        const GetGroups = await pool.query(`
                SELECT DISTINCT ON (groups.id) groups.*
                FROM groups
                INNER JOIN group_members ON group_members.group_id = groups.id
                WHERE groups.created_by = $1
                OR group_members.user_id = $1;
            `, [userid])
        return GetGroups.rows
    } catch (error) {
        console.log(error)
    }

}

export const GetMembers = async (groupId) => {
    try {
        const res = await pool.query(`
            SELECT group_members.user_id FROM groups
            INNER JOIN group_members ON group_members.group_id = groups.id
            WHERE groups.id = $1
            `, [groupId])
        return res.rows
    } catch (error) {
        console.log(error)
    }
}

export const DeleteGroup = async (groupId) => {
    try {
        const res = await pool.query(`
            DELETE FROM groups
            WHERE id = $1
            `, [groupId])
        return true
    } catch (error) {
        console.log(error)
    }
}

export const GetCurrentGroup = async (id) => {
    try {
        const CurrentGroupDetails = await pool.query(`
            SELECT 
            groups.id , 
            groups.name , 
            groups.description , 
            groups.created_by , 
            groups.created_at , 
            users.name AS username 
            FROM groups
            INNER JOIN users ON users.id = groups.created_by
            WHERE groups.id = $1
            `, [id])

        return CurrentGroupDetails.rows
    } catch (error) {
        console.log(error)
    }
}

export const GetMembersDetails = async (id) => {
    try {
        const MembersDetails = await pool.query(`
            SELECT group_members.id,
            group_members.user_id,
            group_members.group_id,
            group_members.joined_at,
            group_members.role,
            users.name
            FROM group_members
            INNER JOIN users ON users.id = group_members.user_id
            WHERE group_id = $1
            `, [id])
        return MembersDetails.rows
    } catch (error) {
        console.log(error)
    }
}

export const UpdateGroupDetails = async (values) => {
    try {
        const Update = await pool.query(`
            UPDATE groups
            SET name = $1 , description = $2
            WHERE id = $3
            RETURNING *
            `, [values.GroupName, values.GroupDescription, values.GroupId])
        return Update.rows
    } catch (error) {
        console.log(error)
    }
}


export const CreateNotification = async (values, id, Message) => {
    try {
        const Notification = await pool.query(`
            INSERT INTO group_messages(group_id , sender_id , content , notifications)
            VALUES ($1 , $2 ,$3 ,$4)
            RETURNING *
            `, [values.GroupId, id, Message, true])
        return Notification.rows
    } catch (error) {
        console.log(error)
    }
}

export const KickUserFromGroup = async (userDetails) => {
    try {
        const Del = await pool.query(`
            DELETE FROM group_members
            WHERE id = $1
            `, [userDetails.id])
        return true
    } catch (error) {
        console.log(error)
    }
}

export const GetFriendsToAdd = async (userid, id) => {
    try {
        const UsersData = await pool.query(`
            SELECT 
    Friends.*, 
    sender_user.name AS sender_name, 
    receiver_user.name AS receiver_name
FROM Friends
-- Join to get sender name
JOIN users AS sender_user ON sender_user.id = Friends.sender_id
-- Join to get receiver name
JOIN users AS receiver_user ON receiver_user.id = Friends.receiver_id
WHERE 
    (Friends.sender_id = $1 OR Friends.receiver_id = $1)
    AND NOT EXISTS (
        SELECT 1 
        FROM group_members 
        WHERE 
            group_id = $2
            AND (
                group_members.user_id = Friends.sender_id 
                OR group_members.user_id = Friends.receiver_id
            )
    );

            `,[userid, id])
            return UsersData.rows
    } catch (error) {
        console.log(error)
    }
}

export const AddFriendsToGroup = async(payload) => {
    try {
        for(let i = 0 ; i < payload.length ; i++)
        {
            const AddFriends = await pool.query(`
                INSERT INTO group_members(user_id , group_id)
                VALUES($1 , $2)
                `,[payload[i].user_id , payload[i].group_id])
        }
        return true
        
    } catch (error) {
        console.log(error)
    }
}