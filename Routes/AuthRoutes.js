import express, { Router } from 'express'
import { CreateUser } from '../Controllers/AuthControllers/SignupControllers.js';
import { CheckUser } from '../Controllers/AuthControllers/EmailVerifycontroller.js';
import { GenerateOtp } from '../Controllers/AuthControllers/OtpVerifyController.js';

const router = express.Router();


router.post('/Signup' , CreateUser)
router.post('/Checkuser' , CheckUser)
router.post('/OTPgenerate' , GenerateOtp)
router.post('/VerifyOpt' ,  )

export default router