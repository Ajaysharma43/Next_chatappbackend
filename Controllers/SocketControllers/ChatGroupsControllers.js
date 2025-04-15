import pool from "../../Databaseconnection/DBConnection.js"


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