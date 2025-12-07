import { Request, Response } from 'express';
import { sendOtpEmail } from '../services/otpService';

export const verifyEmail = async (req: Request, res: Response) => {
    const { email, type } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required' });
    }

    if (!type || !['register', 'forgot-password'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    try {
        await sendOtpEmail(email, type as 'register' | 'forgot-password');
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message || 'Failed to send OTP'
        });
    }
};