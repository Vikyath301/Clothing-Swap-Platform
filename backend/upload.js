const express = require("express");

const router = express.Router();

const auth = require("./auth");

const { clothingModel } = require("../mongo/home");

router.post("/upload", auth, async (req, res) => {
    try {

        const {
            title,
            brand,
            category,
            size,
            condition,
            swapValue,
            location,
            image
        } = req.body;

        if (!title || !brand || !category || !size ||  !condition || !swapValue || !location || !image) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const cloth = new clothingModel({
            ownerId: req.user._id,
            ownerName: req.user.name,
            title,
            brand,
            category,
            size,
            condition,
            swapValue,
            location,
            image
        });
        await cloth.save();
        res.status(201).json({
            message: "Clothing uploaded successfully",
            cloth
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports = router;