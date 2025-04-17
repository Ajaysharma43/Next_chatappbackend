import { AddFriendsToGroup, AddMembers, CreateChatGroups, CreateNotification, DeleteGroup, GetChatGroups, GetCurrentGroup, GetFriendsToAdd, GetMembers, GetMembersDetails, KickUserFromGroup, UpdateGroupDetails } from "../Controllers/SocketControllers/ChatGroupsControllers.js";
import { DeleteMessage, PreviousGroupChat, SendMessages } from "../Controllers/SocketControllers/GroupMessagesControllers.js";
import { NotificationsHandler } from "../Controllers/SocketControllers/NotificationControllers.js";

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

    socket.on('DeleteGroupMessage', async (messages) => {
        try {
            let id = messages.group_id
            const Del = await DeleteMessage(messages)
            const res = await PreviousGroupChat(id)
            let message = res
            io.emit('GetPreviosGroupChats', message)
        } catch (error) {
            console.log(error)
        }


    })

    socket.on("GroupUserTyping", ({ id, username, groupId }) => {
        try {
            io.emit("StartGroupTyping", { id, username, groupId });
        } catch (error) {
            console.log(error)
        }

    });

    socket.on("GetGroupDetails", async (id) => {
        try {
            const GetGroupDetails = await GetCurrentGroup(id)
            const GetMembersDetail = await GetMembersDetails(id)
            socket.emit('SendGroupDetails', GetGroupDetails, GetMembersDetail)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('UpdateGroupDetails', async (values, id, username) => {
        try {
            const Message = `the group details are updated by the ${username}`

            const Update = await UpdateGroupDetails(values)
            const Notification = await CreateNotification(values, id, Message)

            io.emit('UpdateNotification', Notification)
            io.emit('UpdatedGroupDetails', Update, values)
        } catch (error) {
            console.log(error)
        }

    })
    socket.on('KickUserFromGroup', async (userDetails, username, id) => {
        try {
            const groupId = userDetails.group_id;
            const values = { GroupId: groupId };

            const groupMessage = `👤 ${userDetails.name} has been removed from the group by ${username}`;
            const personalMessage = `🚫 You have been removed from the group by ${username}`;

            // Remove user
            const Del = await KickUserFromGroup(userDetails);

            // Notify group
            const GroupNotification = await CreateNotification(values, id, groupMessage);
            io.emit('UpdateNotification', GroupNotification);

            // Notify the user who was kicked
            await NotificationsHandler(id, userDetails.user_id, personalMessage);

            // Send updated group details
            const GetGroupDetails = await GetCurrentGroup(groupId);
            const GetMembersDetail = await GetMembersDetails(groupId);
            io.emit('SendGroupDetails', GetGroupDetails, GetMembersDetail);
        } catch (error) {
            console.log(error);
        }
    });


    socket.on('GetFriendsToAdd', async (userid, id) => {
        const Friends = await GetFriendsToAdd(userid, id)
        socket.emit('SendFriendsToAdd', Friends)
    })

    socket.on("AddFriendsToGroup", async (payload, userId, group_id, username) => {
        try {
            let messageToGroup;
            const values = { GroupId: group_id };

            if (payload.length === 1) {
                messageToGroup = `🎉 new User was added to the group by ${username}`;
            } else {
                messageToGroup = `👥 ${payload.length} new users were added to the group by ${username}`;
            }

            // Add users to group
            const AddFriends = await AddFriendsToGroup(payload);

            // Notify group
            const Notification = await CreateNotification(values, userId, messageToGroup);
            io.emit('UpdateNotification', Notification);

            // Notify each new user
            for (let member of payload) {
                const personalMessage = `✅ You've been added to a new group by ${username}`;
                await NotificationsHandler(userId, member.user_id, personalMessage);
            }

            // Emit new members
            const GetMembersDetail = await GetMembersDetails(group_id);
            io.emit('SentNewMembersOfTheGroup', GetMembersDetail, group_id);
        } catch (error) {
            console.log(error);
        }
    });

}



export default ChatGroups;