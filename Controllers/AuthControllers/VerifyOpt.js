import bcrypt from 'bcrypt'

export const VerifyOtp = (req , res , next) => {
    try {
        const {OTP , otp} = req.body;
        bcrypt.compare(otp , OTP , function(err , result){
            if(result == true)
            {
                res.status(200).json({success : true})
            }
            else
            {
                res.status(200).json({success : true})
            }
        })
    } catch (error) {
        res.status(404).json({error : error})
    }
}