const express = require("express");
const router = express.Router();

const auth=require("./auth");
const { disputeModel } = require("../mongo/disputes");

router.get("/admin/disputes", auth, async (req, res) => {

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }
        const disputes = await disputeModel.find().sort({ createdAt: -1 });
        res.json(disputes);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.patch("/admin/disputes/:id", auth, async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }

        const { status } = req.body;

        if (!["Resolved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const dispute = await disputeModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!dispute) {
            return res.status(404).json({
                message: "Dispute not found"
            });
        }
        res.json({
            message: "Dispute updated successfully",
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