const express = require("express");

const router = express.Router();

const auth = require("./auth");

const { regModel } = require("../mongo/register");
const { dealModel } = require("../mongo/deal");

router.get("/profile", auth, async (req, res) => {

    try {
        const user = await regModel.findById(req.user._id)
        .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const pendingDeals = await dealModel.countDocuments({
            $or: [
                { ownerId: req.user._id },
                { customerId: req.user._id }
            ],
            status: "pending"
        });

        const swapHistory = await dealModel.find({
            $or: [
                { ownerId: req.user._id },
                { customerId: req.user._id }
            ],
            status: "completed"
        })
        .sort({ updatedAt: -1 })
        .select("ownerName customerName clothId status updatedAt");
        res.json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            profilePic: user.profilePic,
            pendingDeals,
            swapHistory
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.json({
        message: "Logged Out Successfully"
    });
});

module.exports = router;