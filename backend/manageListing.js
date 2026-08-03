const express = require("express");
const router = express.Router();

const { clothingModel } = require("../mongo/home");

router.get("/admin/listings", async (req, res) => {
    try {
        const clothes = await clothingModel.find()
        .sort({ createdAt: -1 });

        res.json(clothes);

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.delete("/admin/listing/:id", async (req, res) => {
    try{
        await clothingModel.findByIdAndDelete(req.params.id);
        res.json({
            message:"Listing Removed"
        });
    }

    catch(err){
        res.status(500).json({
            message:"Server Error"
        });
    }
});

module.exports = router;