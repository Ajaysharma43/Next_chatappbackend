import express from 'express'
import { GetUsers } from '../Controllers/DashBoardControllers/UsersControllers.js';
import { AddUser, DeleteUser, FindUser, UpdateUser } from '../Controllers/DashBoardControllers/CrudOperations.js';
import { SortData } from '../Controllers/DashBoardControllers/SortingControllers.js';
import { SearchData, SearchSortedData } from '../Controllers/DashBoardControllers/SearchSortingControllers.js';

const Route = express.Router()

// these routes are for the Dashboard apis

Route.get('/GetData' , GetUsers)
Route.post('/Update' , FindUser , UpdateUser)
Route.delete('/Delete' , DeleteUser)
Route.post('/CreateUser' , AddUser)
Route.post('/SortData' , SortData)
Route.post('/Search' , SearchData)
Route.post('/SearchSortData' , SearchSortedData)
export default Route;