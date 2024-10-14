
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Ankit12'; 

const authMiddleware = (req, res, next) => {
    const token = req.headers['auth'];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (ex) {
        return res.status(400).send('Invalid token.');
    }
};

module.exports = authMiddleware;
