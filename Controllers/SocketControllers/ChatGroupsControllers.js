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
                SELECT * FROM groups
                WHERE created_by = $1
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

export const DeleteGroup = async(groupId) => {
    try {
        const res = await pool.query(`
            DELETE FROM groups
            WHERE id = $1
            `,[groupId])
            return true
    } catch (error) {
        console.log(error)
    }
}