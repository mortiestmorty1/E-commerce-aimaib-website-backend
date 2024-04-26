const jwt = require('jsonwebtoken');
require('dotenv').config();

let isAuthorized = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ error: "You are not authorized to access this route" });
    }
    console.log("token is ", token);
    try {
        // Assuming the token is a 'Bearer token', split and use the actual token part
        const actualToken = token.split(' ')[1];
        const decoded = jwt.verify(actualToken, process.env.SECRET_KEY);
        req.user = decoded;
        console.log("the token is for:", req.user.email);

        if (req.user.role === "user" || req.user.role === "admin") {
            next();
        } else {
            return res.status(401).send({ message: "You are not authorized to access this route" });
        }
    } catch (error) {
        return res.status(401).send({ message: "Invalid token", error: error.toString() });
    }
};

module.exports = {
    isAuthorized
};
