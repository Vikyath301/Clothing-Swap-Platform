const express = require("express");
const router = express.Router();

const { clothingModel } = require("../mongo/home");

router.get("/item/:id", async (req, res) => {
    try {
        const cloth = await clothingModel.findById(req.params.id);
        if (!cloth) {
            return res.status(404).json({
                message: "Clothing item not found"
            });
        }
        res.json(cloth);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }

});

module.exports = router;