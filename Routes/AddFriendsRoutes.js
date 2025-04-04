import express from 'express'
import { CheckRequest, SendRequest } from '../Controllers/SocketControllers/AddFriendRequestControllers.js';
import { AcceptFriendRequest, CheckFriendRequest, DeleteFriendRequest } from '../Controllers/SocketControllers/AcceptRequestControllers.js';

const route = express.Router()

route.post('/SendRequest' , CheckRequest , SendRequest)
route.post('/AcceptRequest' , CheckFriendRequest , AcceptFriendRequest , DeleteFriendRequest)

export default route;