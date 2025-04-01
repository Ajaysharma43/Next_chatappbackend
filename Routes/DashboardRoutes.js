import express from 'express'
import { GetUsers } from '../Controllers/DashBoardControllers/UsersControllers.js';
import { AddUser, DeleteUser, FindUser, UpdateUser } from '../Controllers/DashBoardControllers/CrudOperations.js';
import { SortData } from '../Controllers/DashBoardControllers/SortingControllers.js';

const Route = express.Router()

Route.get('/GetData' , GetUsers)
Route.post('/Update' , FindUser , UpdateUser)
Route.delete('/Delete' , DeleteUser)
Route.post('/CreateUser' , AddUser)
Route.post('/SortData' , SortData)

export default Route;