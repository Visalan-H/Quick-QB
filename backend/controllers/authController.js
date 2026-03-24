const User = require('../models/User');
const Otp = require('../models/Otp');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const { username, email, otp, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
        }

        const otpData = await Otp.findOne({ email });
        if (!otpData) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }

        if (otpData.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }

        if (otpData.otp !== parseInt(otp, 10)) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }

        const hashedPassword = await hashPassword(password);
        await User.create({ username, email, password: hashedPassword });
        await Otp.deleteOne({ email });

        generateToken(email, res);
        res.status(201).json({ success: true, message: 'Account created successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Unable to create your account right now. Please try again.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        if (!(await comparePassword(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        generateToken(email, res);
        res.status(200).json({ success: true, message: 'Logged in successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Unable to log in right now. Please try again.' });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Unable to log out right now. Please try again.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Unable to reset password with the provided details.' });
        }

        const otpData = await Otp.findOne({ email });
        if (!otpData) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }

        if (otpData.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }

        if (otpData.otp !== parseInt(otp, 10)) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }

        const hashedPassword = await hashPassword(newPassword);
        await User.updateOne({ email }, { $set: { password: hashedPassword } });
        await Otp.deleteOne({ email });

        res.status(200).json({ success: true, message: 'Password reset successfully. Please log in.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Unable to reset password right now. Please try again.' });
    }
};

const checkAuth = (req, res) => {
    res.status(200).json({ success: true, email: req.user.email });
};

module.exports = { register, login, logout, resetPassword, checkAuth };
