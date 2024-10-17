const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Ankit12';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send('No token provided.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('No token provided.');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        if (ex instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token.');
        } else if (ex instanceof jwt.TokenExpiredError) {
            return res.status(403).send('Token has expired.');
        } else {
            return res.status(500).send('Internal server error.');
        }
    }
};

module.exports = authMiddleware;
