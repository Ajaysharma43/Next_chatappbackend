import express from 'express'
import multer from 'multer'
import { UploadImage } from '../Controllers/FireBaseControllers/FirebaseUploadController.js';
import { AddLikedImage, CheckLike } from '../Controllers/FireBaseControllers/ImageLikeController.js';
import { ImageCommentController } from '../Controllers/FireBaseControllers/ImageCommentController.js';
import { UploadProfilePic } from '../Controllers/UserProfileController.js/UploadProfilePicController.js';
import { GetImagesData } from '../Controllers/FireBaseControllers/GetImageDataController.js';
import { GetUsersImageData } from '../Controllers/FireBaseControllers/GetUsersImageData.js';
import { GetUserDetails } from '../Controllers/FireBaseControllers/GetUserDatacontroller.js';
import { GetComments } from '../Controllers/FireBaseControllers/GetCommentsControllers.js';
import { DeleteComment } from '../Controllers/FireBaseControllers/DeleteCommentController.js';
import { GetFriendsPosts } from '../Controllers/FireBaseControllers/FriendsPostsController.js';
import { DeletePost } from '../Controllers/FireBaseControllers/DeletePostControllers.js';
import { CheckHiddenStatus, HideImage } from '../Controllers/FireBaseControllers/HidePostController.js';

const Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage })

Router.get('/GetImagesData', GetImagesData)
Router.get('/GetUserImagesData', GetUsersImageData)
Router.get('/GetUserData', GetUserDetails)
Router.get('/GetComments', GetComments)
Router.get('/GetFriendsPosts' , GetFriendsPosts)

Router.post('/UploadImage', upload.single('file'), UploadImage)
Router.post('/UpdateProfilePic', upload.single('file'), UploadProfilePic)
Router.post('/Checklikes', CheckLike, AddLikedImage)
Router.post('/Comment', ImageCommentController)
Router.post('/HidePost' , CheckHiddenStatus , HideImage)

Router.delete('/DeleteComment', DeleteComment)
Router.delete('/DeletePost' , DeletePost)

export default Router