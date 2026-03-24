const validateRegister = (req, res, next) => {
    const { username, email, otp, password, confirmPassword } = req.body;

    if (!username || !email || !otp || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Please fill in username, email, OTP, and both password fields.' });
    }

    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ success: false, message: 'Username must be between 3 and 30 characters.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    req.body.username = username.trim();
    req.body.email = email.toLowerCase().trim();
    req.body.otp = String(otp).trim();
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    req.body.email = email.toLowerCase().trim();
    next();
};

const validateResetPassword = (req, res, next) => {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Please enter email, OTP, and both password fields.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    req.body.email = email.toLowerCase().trim();
    req.body.otp = String(otp).trim();
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateResetPassword
};
