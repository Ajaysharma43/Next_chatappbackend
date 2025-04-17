import express from 'express'
import { GetGroups } from '../Controllers/SocketControllers/ChatGroupsControllers.js';
import { NotificationControllers } from '../Controllers/SocketControllers/NotificationControllers.js';

const route = express.Router();

route.get('/GetGroups', GetGroups)
route.get('/GetNotification' , NotificationControllers)
export default route;