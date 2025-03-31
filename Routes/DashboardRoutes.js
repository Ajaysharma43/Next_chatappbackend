import express from 'express'
import { GetUsers } from '../Controllers/DashBoardControllers/UsersControllers.js';
import { DeleteUser, FindUser, UpdateUser } from '../Controllers/DashBoardControllers/CrudOperations.js';

const Route = express.Router()

Route.get('/GetData' , GetUsers)
Route.post('/Update' , FindUser , UpdateUser)
Route.delete('/Delete' , DeleteUser)

export default Route;