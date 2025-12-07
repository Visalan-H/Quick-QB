const validateVerifyOtp = (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    req.body.email = email.toLowerCase().trim();
    next();
};

const validateRegister = (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields required', success: false });
    }

    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ message: 'Username must be 3-30 characters', success: false });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters', success: false });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match', success: false });
    }

    req.body.username = username.trim();
    req.body.email = email.toLowerCase().trim();
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields required', success: false });
    }

    req.body.email = email.toLowerCase().trim();
    next();
};

const validateResetPassword = (req, res, next) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields required', success: false });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters', success: false });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match', success: false });
    }

    req.body.email = email.toLowerCase().trim();
    next();
};

module.exports = {
    validateVerifyOtp,
    validateRegister,
    validateLogin,
    validateResetPassword
};
