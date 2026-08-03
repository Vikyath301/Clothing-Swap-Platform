const express = require("express");
const router = express.Router();

const { clothingModel } = require("../mongo/home");
const auth = require("./auth");

router.get("/my-Listings", auth, async (req, res) => {
    try {

        const clothes = await clothingModel.find({
            ownerId: req.user._id
        });

        res.json(clothes);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});



router.delete("/my-Listings/:id", auth, async (req, res) => {
    try {
        await clothingModel.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.user._id
        });
        res.json({
            message: "Listing Deleted"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});



router.get("/my-Listings/edit/:id", auth, async (req, res) => {
    try {
        const cloth = await clothingModel.findOne({
            _id: req.params.id,
            ownerId: req.user._id
        });
        if (!cloth) {
            return res.status(404).json({
                message: "Listing not found"
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


router.put("/my-Listings/edit/:id", auth, async (req, res) => {
    try {
        const {
            title,
            category,
            size,
            condition,
            swapValue,
            description,
            image
        } = req.body;

        const cloth = await clothingModel.findOneAndUpdate(

            {
                _id: req.params.id,
                ownerId: req.user._id
            },

            {
                title,
                category,
                size,
                condition,
                swapValue,
                description,
                image
            },

            {
                new: true
            }
        );
        if (!cloth) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }
        res.json({
            message: "Listing Updated Successfully",
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