import express from 'express'
import { CheckFriends, CheckRequest, SendRequest } from '../Controllers/SocketControllers/AddFriendRequestControllers.js';
import { AcceptFriendRequest, CheckFriendRequest, DeleteFriendRequest } from '../Controllers/SocketControllers/AcceptRequestControllers.js';
import { GetAllUsers, GetSingleUser, GetUserPostsData, UserFollowerAndFollowingData } from '../Controllers/SocketControllers/SearchUsersControllers.js';
import { DeleteUser } from '../Controllers/SocketControllers/DeclineRequestControllers.js';
import { GetRequestController } from '../Controllers/SocketControllers/GetRequestsControllers.js';
import { Friends } from '../Controllers/SocketControllers/FriendsControllers.js';
import { UnreadMessages } from '../Controllers/SocketControllers/UnreadMessagesControllers.js';
import { DeleteFriend } from '../Controllers/SocketControllers/DeleteFriendControllers.js';
import { GetBlockUsers } from '../Controllers/SocketControllers/BlockUserControllers.js';

const route = express.Router()

// the routes are to handle the requests for addfriend , send friend request , decline or accept request etc.

route.get('/GetSingleUser', GetSingleUser)
route.get('/GetFollowersAndFollowingData' , UserFollowerAndFollowingData)
route.get('/GetUserPostsData' , GetUserPostsData)
route.get('/GetRequests', GetRequestController)
route.get('/GetBlockedFriends', GetBlockUsers)

route.post('/SendRequest', CheckFriends, CheckRequest, SendRequest)
route.post('/AcceptRequest', CheckFriendRequest, AcceptFriendRequest, DeleteFriendRequest)
route.post('/DeclineRequest', DeleteUser)
route.post('/SearchUsers', GetAllUsers)
route.post('/CheckFriends', Friends)
route.post('/UnreadMessages', UnreadMessages)
route.post('/DeleteFriend', DeleteFriend, Friends)


export default route;