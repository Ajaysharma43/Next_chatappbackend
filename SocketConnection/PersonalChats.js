import { BlockUserController, CheckBlockController, Unblockuser } from "../Controllers/SocketControllers/BlockUserControllers.js";
import { UpdateFriendsData } from "../Controllers/SocketControllers/FriendsControllers.js";
import { MarkAsReadMessages, UpdateMessageStatus } from "../Controllers/SocketControllers/GetUnreadMessages.js";
import { GetPreviosChats, SendMessage } from "../Controllers/SocketControllers/PersonalChatscontrollers.js";
import { DeletePersonalChat } from "../Controllers/SocketControllers/SocketControllers.js";
import { UnreadMessage } from "../Controllers/SocketControllers/UnreadMessagesControllers.js";

let isRecieveronline = true

const PersonalChats = (io, socket, onlineUsers) => {
  // Join room (should be triggered by client)
  socket.on("join-room", async (id, userid) => {
    try {
      isRecieveronline = true
      socket.join(userid);
      const updateddata = await MarkAsReadMessages(parseInt(id), userid)
      io.to(parseInt(id)).emit('UpdateMessages', updateddata)
      io.to(userid).emit('UpdateMessages', updateddata)
    } catch (error) {
      console.log(error)
    }

  });


  socket.on("join-friends-room", (userId) => {
    try {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their friends room.`);
    } catch (error) {
      console.log(error)
    }

  });

  socket.on('leave-friends-room', (userId) => {
    try {
      socket.leave(userId.toString());
      console.log(`User ${userId} joined their friends room.`);
    } catch (error) {
      console.log(error)
    }

  })

  socket.on("leave-room", (userId) => {
    try {
      isRecieveronline = false
      socket.leave(userId);
    } catch (error) {
      console.log(error)
    }

  });

  // Load previous messages
  socket.on("PreviosChats", async (id, userid) => {
    try {
      const Chats = await GetPreviosChats(id, userid);
      socket.emit("Messages", Chats, onlineUsers);
    } catch (error) {
      console.log(error)
    }

  });

  socket.on("MarkAsRead", async (id, userid) => {
    try {
      const MarkasRead = await MarkAsReadMessages(id, userid)
      io.to(userid).emit("UpdateMessagesStatus", MarkasRead);
      io.to(id).emit("UpdateMessagesStatus", MarkasRead);
    } catch (error) {
      console.log(error)
    }

  })

  // Handle sending messages
  socket.on("SendMessage", async (message, id, userid, friendsid) => {

    try {

      const Messages = await SendMessage(message, id, userid, friendsid);

      let sender = userid
      let receiver = parseInt(id)

      const UnreadMessages = await UnreadMessage(sender, receiver)
      const FriendsData = await UpdateFriendsData(parseInt(id))

      // Handle that the UnreadMessages and friends data are only updated to the sender and reciever
      io.to(id.toString()).emit('UpdateFriendsData', FriendsData)
      io.to(id.toString()).emit('UpdateUnreadMessages', UnreadMessages)

      // Emit updated messages to both sender and receiver rooms
      io.to(userid).emit("RecieveMessages", Messages);
      io.to(parseInt(id)).emit("RecieveMessages", Messages, isRecieveronline);
    } catch (error) {
      console.log(error)
    }

  });

  socket.on('GetUnreadMessages', async (sender, receiver) => {
    try {
      const UnreadMessages = await UnreadMessage(sender, receiver)
      socket.emit('UpdateUnreadMessages', UnreadMessages)
    } catch (error) {
      console.log(error)
    }

  })

  socket.on('DeleteMessage', async (messageId, userid, id) => {
    try {
      const UpdatedMessages = await DeletePersonalChat(messageId, userid, id)

      let sender = userid
      let receiver = id

      const UnreadMessages = await UnreadMessage(sender, receiver)

      // Handle the UnreadMessages count if the there is no unread messages to show
      if (UnreadMessages.length == 0) {
        const FriendsData = await UpdateFriendsData(parseInt(id))

        UnreadMessages.push({ sender: userid, count: '0' })
        io.to(id.toString()).emit('UpdateUnreadMessages', UnreadMessages)

        // update the deleted messages on the sender and the receiver side
        io.to(userid).emit("UpdatedDeletedMessages", UpdatedMessages);
        io.to(id).emit("UpdatedDeletedMessages", UpdatedMessages);

        // update the friendsdat and unread messages on the sender and receiver side
        io.to(id.toString()).emit('UpdateFriendsData', FriendsData)
        io.to(id.toString()).emit('UpdateUnreadMessages', UnreadMessages)
      }
      else {
        io.to(id.toString()).emit('UpdateUnreadMessages', UnreadMessages)
        io.to(userid).emit("UpdatedDeletedMessages", UpdatedMessages);
        io.to(id).emit("UpdatedDeletedMessages", UpdatedMessages);
      }
    } catch (error) {
      console.log(error)
    }

  })

  // this event is using to block the friend
  socket.on('BlockUser', async (blockfriendid, userId) => {
    try {
      const CheckBlock = await CheckBlockController(blockfriendid, userId)
      let id = blockfriendid
      let userid = userId
      if (CheckBlock == true) {
        const BlockUser = await BlockUserController(blockfriendid, userId)
        const FriendsData = await UpdateFriendsData(parseInt(id))
        let data = {
          message: "user is blocked",
          success: true,
          Blockdata: BlockUser,
          Blocked: true
        }
        socket.emit('UpdateFriendsData', FriendsData)
        io.to(id.toString()).emit('UpdateFriendsData', FriendsData)
      }
      else {
        let data = {
          message: "user is already blocked",
          success: false
        }
        io.to(id.toString()).emit('UpdateBlockedusers', data)
        io.to(userid).emit("UpdateBlockedusers", data);
      }
    } catch (error) {
      console.log(error)
    }

  })

  socket.on('UnBlockFriend' , async(selectedUser) => {
    try {
      let id = selectedUser.blocked_id
      const Unblock = await Unblockuser(selectedUser)
      const FriendsData = await UpdateFriendsData(id)
      socket.emit('UpdateBlockedList' , Unblock)
      io.to(id.toString()).emit('UpdateFriendsData', FriendsData)
      io
    } catch (error) {
      console.log(error)
    }
  })


  // Handle the typing event on the receiver side
  socket.on('typing', (id) => {
    try {
      io.to(parseInt(id)).emit('isTyping', id)
    } catch (error) {
      console.log(error)
    }

  })
};

export default PersonalChats;
