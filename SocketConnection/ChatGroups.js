import { AddMembers, CreateChatGroups, GetChatGroups } from "../Controllers/SocketControllers/ChatGroupsControllers.js";

const ChatGroups = (io, socket) => {

    socket.on('JoinGroups', (id) => {
        try {
            socket.join(id)
            console.log(`user with the id : ${id} has joined the room`)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('LeaveGroups', (userid) => {
        try {
            console.log(userid)
            socket.leave(userid)
            console.log(`user with the id : ${userid} has leave the room`)
        } catch (error) {
            console.log(error)
        }
    })

    
    socket.on('GetGroups', async (userid) => {
        const GetGroups = await GetChatGroups(userid)
        socket.on('Groups',)
    })

    socket.on('CreateGroup', async (groupData) => {
        const CreateGroup = await CreateChatGroups(groupData)
        if (CreateGroup.length > 0) {
            const AddMembersToGroup = await AddMembers(groupData, CreateGroup)
            if (AddMembersToGroup == true) {
                let userid = groupData.createdBy
                const GetGroups = await GetChatGroups(userid)
                socket.emit('S')
            }
        }
    })
}

export default ChatGroups;