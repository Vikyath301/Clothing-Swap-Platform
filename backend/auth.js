const jwt = require("jsonwebtoken");
const { regModel } = require("../mongo/register");

const JWT_SECRET = "mysecretkey";

async function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Login First"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === "admin") {
            req.user = {
                id: decoded.id,
                role: "admin"
            };
            return next();
        }

        const user = await regModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        req.user = user;
        return next();
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = auth;