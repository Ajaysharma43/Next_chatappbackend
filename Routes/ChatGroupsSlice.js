import express from 'express'
import { GetGroups } from '../Controllers/SocketControllers/ChatGroupsControllers.js';

const route = express.Router();

route.get('/GetGroups', GetGroups)
export default route;