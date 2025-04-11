import express from 'express'
import { VerifyRole } from '../Controllers/NavControllers/NavControllers.js';

const Route = express.Router();

// this route are to handle the navbar daynamically

Route.get('/NavBar' , VerifyRole)

export default Route;