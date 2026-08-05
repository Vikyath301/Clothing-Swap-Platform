const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { regModel } = require("../mongo/register.js");

const router = express.Router();

const JWT_SECRET = "mysecretkey";

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        if (
            email === "admin@gmail.com" &&
            password === "admin123"
        ) {
            const token = jwt.sign(
                {
                    id: "admin",
                    role: "admin"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "30d"
                }
            );
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
        
            return res.status(200).json({
                message: "Admin Login Successful",
                role: "admin"
            });
        }

        const user = await regModel.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            });

        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({
                message: "Incorrect Password"
            });

        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d"
            }
        );

        // Store token in HttpOnly Cookie
        res.cookie("token", token, {

            httpOnly: true,
            secure: true,      // Change to true after deployment (HTTPS)
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000

        });

        res.status(200).json({

            message: "Login Successful"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;