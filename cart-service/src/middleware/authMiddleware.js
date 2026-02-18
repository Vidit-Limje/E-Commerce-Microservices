const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({ error: "Invalid Authorization format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded has: user_id, role, exp
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
