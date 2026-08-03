const express=require("express");
const router = express.Router();

const auth=require("./auth");

const { disputeModel } = require("../mongo/disputes");

router.post("/dispute/create", auth, async (req, res) => {

    try {

        const {
            dealId,
            clothId,
            ownerId,
            ownerName,
            reason
        } = req.body;

        if (!dealId || !clothId || !ownerId || !reason) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const dispute = await disputeModel.create({
            dealId,
            clothId,
            raisedBy: req.user._id,
            raisedByName: req.user.name,
            ownerId,
            ownerName,
            reason
        });

        res.status(201).json({
            message: "Dispute raised successfully",
            dispute
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

module.exports=router