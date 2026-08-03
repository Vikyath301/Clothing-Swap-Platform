const express = require("express");

const router = express.Router();
const auth = require("./auth");
const { clothingModel } = require("../mongo/home");

router.post("/swap/value", auth, async (req, res) => {
    try {
        const { myClothId, targetClothId } = req.body;
        const myItem = await clothingModel.findById(myClothId);
        const targetItem = await clothingModel.findById(targetClothId);

        if (!myItem || !targetItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });

        }
        const myScore = myItem.swapValue;
        const targetScore = targetItem.swapValue;
        const difference = Math.abs(myScore - targetScore);
        let recommendation = "";

        if (difference <= 50)
            recommendation = "Excellent Match";

        else if (difference <= 150)
            recommendation = "Fair Match";

        else
            recommendation = "Unfair Swap";

        res.json({
            success: true,
            myScore,
            targetScore,
            difference,
            recommendation
        });
    }

    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;