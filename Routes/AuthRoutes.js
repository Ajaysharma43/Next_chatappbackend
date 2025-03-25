import express, { Router } from 'express'
import { CreateUser } from '../Controllers/AuthControllers/SignupControllers.js';
import { CheckUser } from '../Controllers/AuthControllers/EmailVerifycontroller.js';
import { GenerateOpt } from '../Controllers/AuthControllers/OtpVerifyController.js';

const router = express.Router();


router.post('/Signup' , CreateUser)
router.post('/Checkuser' , CheckUser)
router.post('/OTPVerify' , GenerateOpt)
router.post('/VerifyOpt' ,  )

export default router