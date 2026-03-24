const router = require('express').Router();
const auth = require('../middleware/auth');
const { register, login, logout, resetPassword, checkAuth } = require('../controllers/authController');
const { validateRegister, validateLogin, validateResetPassword } = require('../middleware/validation');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimit');

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);
router.post('/reset-password', passwordResetLimiter, validateResetPassword, resetPassword);
router.get('/check', auth, checkAuth);

module.exports = router;
