const router = require('express').Router();
const auth = require('../middleware/auth');
const { verifyOtp, register, login, logout, resetPassword, checkAuth } = require('../controllers/authController');
const { validateVerifyOtp, validateRegister, validateLogin, validateResetPassword } = require('../middleware/validation');

router.post('/verify-otp', validateVerifyOtp, verifyOtp);
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/reset-password', validateResetPassword, resetPassword);
router.get('/check', auth, checkAuth);

module.exports = router;
