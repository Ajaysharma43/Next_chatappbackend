import express from 'express'
import { GetUsers } from '../Controllers/DashBoardControllers/UsersControllers.js';
import { FindUser, UpdateUser } from '../Controllers/DashBoardControllers/CrudOperations.js';

const Route = express.Router()

Route.get('/GetData' , GetUsers)
Route.post('/Update' , FindUser , UpdateUser)

export default Route;