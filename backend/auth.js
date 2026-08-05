const jwt = require("jsonwebtoken");
const { regModel } = require("../mongo/register");

async function auth(req, res, next) {
    try {
        console.log("Cookies:", req.cookies);

        const token = req.cookies.token;
        console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({
                message: "Login First"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded);

        if (decoded.role === "admin") {
            req.user = {
                id: decoded.id,
                role: "admin"
            };
            return next();
        }

        const user = await regModel.findById(decoded.id);
        console.log("User:", user);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log("AUTH ERROR:", err);

        return res.status(401).json({
            message: err.message
        });
    }
}

module.exports = auth;