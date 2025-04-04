import express from 'express'
import { CheckFriends, CheckRequest, SendRequest } from '../Controllers/SocketControllers/AddFriendRequestControllers.js';
import { AcceptFriendRequest, CheckFriendRequest, DeleteFriendRequest } from '../Controllers/SocketControllers/AcceptRequestControllers.js';
import { GetAllUsers, GetSingleUser } from '../Controllers/SocketControllers/SearchUsersControllers.js';
import { DeleteUser } from '../Controllers/SocketControllers/DeclineRequestControllers.js';

const route = express.Router()

route.post('/SendRequest', CheckFriends, CheckRequest, SendRequest)
route.post('/AcceptRequest', CheckFriendRequest, AcceptFriendRequest, DeleteFriendRequest)
route.post('/DeclineRequest', DeleteUser)
route.post('/SearchUsers', GetAllUsers)
route.get('/GetSingleUser', GetSingleUser)


export default route;