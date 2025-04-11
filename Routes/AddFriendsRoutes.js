import express from 'express'
import { CheckFriends, CheckRequest, SendRequest } from '../Controllers/SocketControllers/AddFriendRequestControllers.js';
import { AcceptFriendRequest, CheckFriendRequest, DeleteFriendRequest } from '../Controllers/SocketControllers/AcceptRequestControllers.js';
import { GetAllUsers, GetSingleUser } from '../Controllers/SocketControllers/SearchUsersControllers.js';
import { DeleteUser } from '../Controllers/SocketControllers/DeclineRequestControllers.js';
import { GetRequestController } from '../Controllers/SocketControllers/GetRequestsControllers.js';
import { Friends } from '../Controllers/SocketControllers/FriendsControllers.js';
import { UnreadMessages } from '../Controllers/SocketControllers/UnreadMessagesControllers.js';
import { DeleteFriend } from '../Controllers/SocketControllers/DeleteFriendControllers.js';

const route = express.Router()

// the routes are to handle the requests for addfriend , send friend request , decline or accept request etc.

route.post('/SendRequest', CheckFriends, CheckRequest, SendRequest)
route.post('/AcceptRequest', CheckFriendRequest, AcceptFriendRequest, DeleteFriendRequest)
route.post('/DeclineRequest', DeleteUser)
route.post('/SearchUsers', GetAllUsers)
route.get('/GetSingleUser', GetSingleUser)
route.get('/GetRequests' , GetRequestController)
route.post('/CheckFriends' , Friends)
route.post('/UnreadMessages' , UnreadMessages)
route.post('/DeleteFriend' , DeleteFriend , Friends)


export default route;