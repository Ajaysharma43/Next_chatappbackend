import { AddMembers, CreateChatGroups, DeleteGroup, GetChatGroups, GetMembers } from "../Controllers/SocketControllers/ChatGroupsControllers.js";
import { PreviousGroupChat, SendMessages } from "../Controllers/SocketControllers/GroupMessagesControllers.js";

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
            socket.leave(userid)
            console.log(`user with the id : ${userid} has leave the room`)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('JoinFriendsGroup', (id) => {
        socket.join(id)
        console.log(`new user has joined the room ${id}`)
    })

    socket.on('LeaveFriendsGroup', (id) => {
        socket.leave(id)
        console.log(`user has leave the room ${id}`)
    })


    socket.on('CreateGroup', async (groupData) => {
        try {
            const CreateGroup = await CreateChatGroups(groupData)
            if (CreateGroup.length > 0) {
                const AddMembersToGroup = await AddMembers(groupData, CreateGroup)
                if (AddMembersToGroup == true) {
                    let userid = groupData.createdBy
                    const GetGroups = await GetChatGroups(userid)
                    socket.emit('SendGroups', GetGroups)
                    for (let i = 0; i < groupData.members.length; i++) {
                        io.to(groupData.members[i]).emit('SendGroups', GetGroups)
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }

    })

    socket.on('DeleteGroup', async (groupId, userid) => {
        try {
            const Members = await GetMembers(groupId)
            const DelGroup = await DeleteGroup(groupId)
            if (DelGroup == true) {
                const GetGroups = await GetChatGroups(userid)
                socket.emit('SendGroups', GetGroups)
                for (let i = 0; i < Members.length; i++) {
                    io.to(Members[i].user_id).emit('SendGroups', GetGroups)
                }
            }
        } catch (error) {
            console.log(error)
        }

    })

    socket.on('SendGroupMessages', async (message, id, userid) => {
        const SaveMessage = await SendMessages(message, id, userid)
        io.emit('RecieveMessages', SaveMessage)
    })

    socket.on('PreviousGroupChats', async (id) => {
        const PreviousGroupChats = await PreviousGroupChat(id)
        let message = PreviousGroupChats
        socket.emit('GetPreviosGroupChats', message)
    })
}

export default ChatGroups;