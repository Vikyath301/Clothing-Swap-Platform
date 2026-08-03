const express = require("express");

const router = express.Router();

const { clothingModel } = require("../mongo/home");

router.get("/home", async (req, res) => {
    try {
        const location = req.query.location;
        let clothes;
        if (location && location !== "All") {
            clothes = await clothingModel.find({
                location: location
            });
        }
        else {
            clothes = await clothingModel.find();
        }
        res.status(200).json(clothes);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;