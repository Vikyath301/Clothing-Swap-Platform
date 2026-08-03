const express = require("express");
const router = express.Router();
const auth = require("./auth");

const { regModel } = require("../mongo/register");
const { clothingModel } = require("../mongo/home");
const { dealModel } = require("../mongo/deal");

router.get("/admin/users", auth, async (req, res) => {

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }
        const users = await regModel.find().select("-password");
        res.json(users);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.delete("/admin/user/:id", auth, async (req, res) => {

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }
        
        await clothingModel.deleteMany({
            ownerId: req.params.id
        });

        const user = await regModel.findById(req.params.id);
        await regModel.findByIdAndDelete(req.params.id);
        res.json({
            message: "User Deleted Successfully"
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});


router.get("/admin/analytics", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }
        const totalUsers = await regModel.countDocuments();

        const totalListings = await clothingModel.countDocuments();

        const availableListings = await clothingModel.countDocuments({
            isAvailable: true
        });
        const pendingDeals = await clothingModel.countDocuments({
            dealStatus: "Pending"
        });
        const completedSwaps = await clothingModel.countDocuments({
            dealStatus: "Completed"
        });
        res.json({
            totalUsers,
            totalListings,
            availableListings,
            pendingDeals,
            completedSwaps
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.get("/admin/swaps", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }
        const swaps = await dealModel.find()
            .sort({ createdAt: -1 });
        res.json(swaps);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});



module.exports = router;