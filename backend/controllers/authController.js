const User = require('../models/User');
const Otp = require('../models/Otp');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpData = await Otp.findOne({ email });

        if (!otpData) {
            return res.status(400).json({ success: false, message: 'OTP Not Found' });
        }

        if (otpData.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ success: false, message: 'OTP Expired' });
        }

        if (otpData.otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        await Otp.deleteOne({ email });
        res.json({ success: true, message: 'OTP verified' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered', success: false });
        }

        const hashedPassword = await hashPassword(password);
        await User.create({ username, email, password: hashedPassword });

        generateToken(email, res);
        res.status(201).json({ message: 'Registered successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        if (!(await comparePassword(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        generateToken(email, res);
        res.status(200).json({ message: 'Login successful', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(200).json({ message: 'Logout successful', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid request', success: false });
        }

        const hashedPassword = await hashPassword(newPassword);
        await User.updateOne({ email }, { $set: { password: hashedPassword } });

        res.status(200).json({ message: 'Password reset successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

const checkAuth = (req, res) => {
    res.status(200).json({ success: true, email: req.user.email });
};

module.exports = { verifyOtp, register, login, logout, resetPassword, checkAuth };
