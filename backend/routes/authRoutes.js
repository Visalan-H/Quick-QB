const router = require('express').Router();
const auth = require('../middleware/auth');
const { verifyEmail, register, login, logout, resetPassword, checkAuth } = require('../controllers/authController');

router.post('/verify-email', verifyEmail);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);
router.get('/check', auth, checkAuth);

module.exports = router;
