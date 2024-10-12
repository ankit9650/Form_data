
const logmw = (req, res, next) => {
    console.log("Middleware start! Request method:", req.method, "Request URL:", req.url);
    next(); // Pass control to the next middleware or route handler
};

module.exports = logmw; 
