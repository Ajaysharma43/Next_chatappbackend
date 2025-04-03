import express, { Router } from 'express'
import { CreateUser } from '../Controllers/AuthControllers/SignupControllers.js';
import { CheckUser } from '../Controllers/AuthControllers/EmailVerifycontroller.js';
import { GenerateOtp } from '../Controllers/AuthControllers/OtpVerifyController.js';
import { VerifyOtp } from '../Controllers/AuthControllers/VerifyOpt.js';
import { GenerateToken, ValidateEmail, ValidateLoginDetails } from '../Controllers/AuthControllers/LoginControllers.js';
import { CreateNewUser, SocialAuth , GenerateSocialToken } from '../Controllers/AuthControllers/SocialMediaLoginController.js';

const router = express.Router();


router.post('/Signup' , CreateUser)
router.post('/Checkuser' , CheckUser)
router.post('/OTPgenerate' , GenerateOtp)
router.post('/VerifyOtp' , VerifyOtp)
router.post('/Login' , ValidateEmail , ValidateLoginDetails , GenerateToken)
router.post('/SocialAuth' , SocialAuth , CreateNewUser , GenerateSocialToken)

export default router