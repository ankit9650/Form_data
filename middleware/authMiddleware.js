// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Use a secure key

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Store user info in request
        next(); // Pass control to the next middleware or route handler
    } catch (ex) {
        return res.status(400).send('Invalid token.');
    }
};

module.exports = authMiddleware;
