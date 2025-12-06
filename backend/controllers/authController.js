const User = require('../models/User');
const Otp = require('../models/Otp');
const crypto = require('crypto');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');
const sendOtp = require('../utils/sendOtp');

// POST /verify-email
const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email required', success: false });
        }

        const normalizedEmail = email.toLowerCase().trim();
        await Otp.deleteOne({ email: normalizedEmail });

        const otp = crypto.randomInt(1000, 10000);
        await Otp.create({ email: normalizedEmail, otp, expiresAt: Date.now() + 5 * 60 * 1000 });

        console.log(`Sending OTP ${otp} to ${normalizedEmail}`);
        const sent = await sendOtp(normalizedEmail, otp);
        console.log(`OTP sent successfully to ${normalizedEmail}`);
        return res.status(200).json({ message: 'OTP sent', success: true });
    } catch (err) {
        console.error('Verify email error:', err.message);
        res.status(500).json({ message: err.message || 'Failed to send OTP', success: false });
    }
};

// POST /register
const register = async (req, res) => {
    try {
        const { username, email, otp, password, confirmPassword } = req.body;
        if (!username || !email || !otp || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields required', success: false });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered', success: false });
        }

        // Check username length
        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({ message: 'Username must be 3-30 characters', success: false });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters', success: false });
        }

        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ message: 'OTP not found', success: false });
        if (otpData.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ message: 'OTP expired', success: false });
        }
        if (otpData.otp !== otp) return res.status(400).json({ message: 'Invalid OTP', success: false });
        if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match', success: false });

        await Otp.deleteOne({ email });

        const hashedPassword = await hashPassword(password);
        await User.create({ username: username.trim(), email: email.toLowerCase().trim(), password: hashedPassword });

        generateToken(email.toLowerCase(), res);
        return res.status(201).json({ message: 'Registered successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

// POST /login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields required', success: false });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(400).json({ message: 'Invalid credentials', success: false });
        if (!(await comparePassword(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        generateToken(email.toLowerCase(), res);
        res.status(200).json({ message: 'Login successful', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

// POST /logout
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        return res.status(200).json({ message: 'Logout successful', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

// POST /reset-password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields required', success: false });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid request', success: false });
        }

        // Password strength validation
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters', success: false });
        }

        const otpData = await Otp.findOne({ email: normalizedEmail });
        if (!otpData) return res.status(400).json({ message: 'OTP not found', success: false });
        if (otpData.expiresAt < Date.now()) {
            await Otp.deleteOne({ email: normalizedEmail });
            return res.status(400).json({ message: 'OTP expired', success: false });
        }
        if (otpData.otp !== otp) return res.status(400).json({ message: 'Invalid OTP', success: false });
        if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match', success: false });

        await Otp.deleteOne({ email: normalizedEmail });

        const hashedPassword = await hashPassword(newPassword);
        await User.updateOne({ email: normalizedEmail }, { $set: { password: hashedPassword } });

        return res.status(200).json({ message: 'Password reset successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

// GET /check
const checkAuth = (req, res) => {
    res.status(200).json({ success: true, email: req.user.email });
};

module.exports = { verifyEmail, register, login, logout, resetPassword, checkAuth };
