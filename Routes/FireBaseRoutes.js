import express from 'express'
import multer from 'multer'
import { UploadImage } from '../Controllers/FireBaseControllers/FirebaseUploadController.js';
import { AddLikedImage, CheckLike } from '../Controllers/FireBaseControllers/ImageLikeController.js';
import { ImageCommentController } from '../Controllers/FireBaseControllers/ImageCommentController.js';

const Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage})

Router.post('/UploadImage' , upload.single('file') , UploadImage)
Router.post('/Checklikes' , CheckLike , AddLikedImage)
Router.post('/Comment' , ImageCommentController)

export default Router