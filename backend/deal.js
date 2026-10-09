const express = require("express");

const router = express.Router();

const auth = require("./auth");

const {dealModel} = require("../mongo/deal");
const {clothingModel} = require("../mongo/home");
const {notificationModel} = require("../mongo/notification");

router.post("/deal/request", auth, async (req, res) => {
    try {
        const { clothId, offeredClothId } = req.body;
        const cloth = await clothingModel.findById(clothId);

        if (!cloth) {
            return res.status(404).json({
                message: "Cloth not found"
            });
        }

        if (cloth.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot request your own cloth"
            });
        }

        if (!cloth.isAvailable) {
            return res.status(400).json({
                message: "This item has already been swapped"
            });
        }

        const alreadyRequested = await dealModel.findOne({
            clothId,
            customerId: req.user._id,
            status: "pending"
        });
        if (alreadyRequested) {
            return res.status(400).json({
                message: "Swap request is already pending for this item"
            });
        }

        let offeredCloth = null;
        if (offeredClothId) {
            offeredCloth = await clothingModel.findById(offeredClothId);
        }

        const deal = await dealModel.create({
            clothId,
            clothTitle: cloth.title,
            clothImage: cloth.image,
            ownerId: cloth.ownerId,
            ownerName: cloth.ownerName,
            customerId: req.user._id,
            customerName: req.user.name,
            offeredClothId: offeredCloth ? offeredCloth._id : null,
            offeredClothTitle: offeredCloth ? offeredCloth.title : "",
            offeredClothImage: offeredCloth ? offeredCloth.image : "",
            status: "pending"
        });

        cloth.dealStatus = "pending";
        await cloth.save();

        const notif = await notificationModel.create({
            clothId,
            receiverId: cloth.ownerId,
            senderId: req.user._id,
            senderName: req.user.name,
            message: `${req.user.name} sent a swap offer for "${cloth.title}"!`,
            type: "deal"
        });

        const io = req.app.get("io");
        if (io) {
            io.to(`user_${cloth.ownerId}`).emit("new_notification", notif);
        }

        res.status(201).json({
            message: "Swap offer sent successfully!",
            deal
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.get("/deal/pending", auth, async (req, res) => {
    try {
        const deals = await dealModel.find({
            ownerId: req.user._id,
            status: "pending"
        })
        .populate("clothId")
        .populate("offeredClothId")
        .sort({ createdAt: -1 });

        res.json(deals);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.put("/deal/accept/:dealId", auth, async (req, res) => {
    try {
        const deal = await dealModel.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                message: "Deal not found"
            });
        }

        deal.status = "accepted";
        await deal.save();

        const cloth = await clothingModel.findById(deal.clothId);
        if (cloth) {
            cloth.isAvailable = false;
            cloth.dealStatus = "confirmed";
            await cloth.save();
        }

        if (deal.offeredClothId) {
            const offeredCloth = await clothingModel.findById(deal.offeredClothId);
            if (offeredCloth) {
                offeredCloth.isAvailable = false;
                offeredCloth.dealStatus = "confirmed";
                await offeredCloth.save();
            }
        }

        const notif = await notificationModel.create({
            clothId: deal.clothId,
            receiverId: deal.customerId,
            senderId: req.user._id,
            senderName: req.user.name,
            message: `Congratulations! Your swap deal for "${deal.clothTitle || "item"}" was accepted! 🎉`,
            type: "deal"
        });

        const io = req.app.get("io");
        if (io) {
            io.to(`user_${deal.customerId}`).emit("new_notification", notif);
        }

        res.json({
            message: "Swap deal accepted! Both items are now reserved.",
            deal
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.put("/deal/reject/:dealId", auth, async (req, res) => {
    try {
        const deal = await dealModel.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                message: "Deal not found"
            });
        }

        deal.status = "rejected";
        await deal.save();

        // Check if other pending deals exist for this cloth
        const remainingPending = await dealModel.countDocuments({
            clothId: deal.clothId,
            status: "pending"
        });

        if (remainingPending === 0) {
            const cloth = await clothingModel.findById(deal.clothId);
            if (cloth && cloth.isAvailable) {
                cloth.dealStatus = "none";
                await cloth.save();
            }
        }

        const notif = await notificationModel.create({
            clothId: deal.clothId,
            receiverId: deal.customerId,
            senderId: req.user._id,
            senderName: req.user.name,
            message: `Your swap offer for "${deal.clothTitle || "item"}" was declined.`,
            type: "deal"
        });

        const io = req.app.get("io");
        if (io) {
            io.to(`user_${deal.customerId}`).emit("new_notification", notif);
        }

        res.json({
            message: "Swap offer rejected",
            deal
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.get("/mydeals", auth, async (req, res) => {
    try {
        const deals = await dealModel.find({
            $or: [
                { customerId: req.user._id },
                { ownerId: req.user._id }
            ]
        })
        .populate("clothId")
        .populate("offeredClothId")
        .sort({ updatedAt: -1 });

        res.json(deals);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


module.exports = router;