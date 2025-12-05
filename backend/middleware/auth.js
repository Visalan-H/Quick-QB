const { verifyToken } = require('../utils/jwt');

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated', success: false });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token', success: false });
    }
};

module.exports = auth;
