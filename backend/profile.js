const express = require("express");

const router = express.Router();

const auth = require("./auth");

const { regModel } = require("../mongo/register");
const { dealModel } = require("../mongo/deal");

const { clothingModel } = require("../mongo/home");

router.get("/profile", auth, async (req, res) => {
    try {
        const user = await regModel.findById(req.user._id).select("-password");

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

        const totalListings = await clothingModel.countDocuments({
            ownerId: req.user._id
        });

        const swapHistory = await dealModel.find({
            $or: [
                { ownerId: req.user._id },
                { customerId: req.user._id }
            ],
            status: { $in: ["accepted", "completed"] }
        })
        .populate("clothId")
        .sort({ updatedAt: -1 });

        res.json({
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            profilePic: user.profilePic,
            totalListings,
            pendingDeals,
            swapHistory
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.put("/profile", auth, async (req, res) => {
    try {
        const { name, phone, location, profilePic } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (location !== undefined) updateData.location = location;
        if (profilePic !== undefined) updateData.profilePic = profilePic;

        const updatedUser = await regModel.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
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