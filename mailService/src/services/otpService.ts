import crypto from 'crypto';
import transporter from '../config/emailTransport';
import Otp from '../models/Otp';
import User from '../models/User';
import { getOtpEmailTemplate } from '../templates/otpEmailTemplate';

export const sendOtpEmail = async (email: string, type: 'register' | 'forgot-password') => {
    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (type === 'register' && userExists) {
        throw new Error('Email already registered');
    }
    
    if (type === 'forgot-password' && !userExists) {
        throw new Error('Email not registered');
    }

    await Otp.deleteOne({ email: normalizedEmail });

    const otp = crypto.randomInt(1000, 10000);
    await Otp.create({
        email: normalizedEmail,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: 'QuickQB - Email Verification Code',
        html: getOtpEmailTemplate(otp)
    });

    return true;
};
