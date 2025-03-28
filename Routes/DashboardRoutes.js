import express from 'express'
import { GetUsers } from '../Controllers/DashBoardControllers/UsersControllers.js';
import { FindUser } from '../Controllers/DashBoardControllers/CrudOperations.js';

const Route = express.Router()

Route.get('/GetData' , GetUsers)
Route.get('/Update' , FindUser)

export default Route;