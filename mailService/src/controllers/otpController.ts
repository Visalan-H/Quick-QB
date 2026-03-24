import { Request, Response } from 'express';
import { sendOtpEmail } from '../services/otpService';

export const verifyEmail = async (req: Request, res: Response) => {
    const { email, type } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }

    if (!type || !['register', 'forgot-password'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid OTP request type.' });
    }

    try {
        await sendOtpEmail(email, type as 'register' | 'forgot-password');
        res.json({ success: true, message: 'If the email is eligible, an OTP will be sent.' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to process OTP request right now. Please try again.'
        });
    }
};