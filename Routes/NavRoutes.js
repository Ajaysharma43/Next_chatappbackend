import express from 'express'
import { VerifyRole } from '../Controllers/NavControllers/NavControllers.js';

const Route = express.Router();

Route.get('/NavBar' , VerifyRole)

export default Route;