import express from 'express'
import multer from 'multer'
import { UploadImage } from '../Controllers/FireBaseControllers/FirebaseUploadController.js';

const Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage})

Router.post('/UploadImage' , upload.single('file') , UploadImage)

export default Router