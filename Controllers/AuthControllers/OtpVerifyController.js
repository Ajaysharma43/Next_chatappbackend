import twilio from "twilio";
import bcrypt from "bcrypt";

const client = twilio(process.env.TWILIO_ACCESS_TOKEN, process.env.TWILIO_AUTH_TOKEN);

export const GenerateOtp = async (req, res, next) => {
    try {
        const { Number } = req.body;
        if (!Number) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        await client.messages.create({
            body: `Your OTP is: ${OTP}`,
            from: process.env.TWILIO_NUMBER,
            to: `+91${Number}`,
        });


        const saltRounds = 10;
        const EncryptedOtp = await bcrypt.hash(OTP, saltRounds);

        return res.status(200).json({ OTP: EncryptedOtp  , success : true});
    } catch (error) {
        res.status(404).json({error : error}) 
    }
};
