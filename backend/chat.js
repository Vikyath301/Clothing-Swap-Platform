const express = require("express");
const router = express.Router();
const auth = require("./auth");
const { chatModel } = require("../mongo/chat");
const { clothingModel } = require("../mongo/home");
const { notificationModel } = require("../mongo/notification");

const { dealModel } = require("../mongo/deal");

router.post("/chat/send", auth, async (req, res) => {
    try {
        const { clothId, message, receiverId: explicitReceiverId } = req.body;

        const cloth = await clothingModel.findById(clothId);
        if (!cloth) {
            return res.status(404).json({
                message: "Cloth not found"
            });
        }

        let receiverId = explicitReceiverId;
        let receiverName = "";

        if (!receiverId) {
            if (req.user._id.toString() === cloth.ownerId.toString()) {
                // Owner is sending: find customer from chat history or deals
                const lastOtherChat = await chatModel.findOne({
                    clothId,
                    senderId: { $ne: req.user._id }
                }).sort({ createdAt: -1 });

                if (lastOtherChat) {
                    receiverId = lastOtherChat.senderId;
                    receiverName = lastOtherChat.senderName;
                } else {
                    const deal = await dealModel.findOne({ clothId }).sort({ createdAt: -1 });
                    if (deal) {
                        receiverId = deal.customerId;
                        receiverName = deal.customerName;
                    }
                }
            } else {
                receiverId = cloth.ownerId;
                receiverName = cloth.ownerName;
            }
        }

        const chat = await chatModel.create({
            clothId,
            senderId: req.user._id,
            senderName: req.user.name,
            receiverId: receiverId || cloth.ownerId,
            receiverName: receiverName || cloth.ownerName,
            message
        });

        // Create notification
        let notification = null;
        if (receiverId && receiverId.toString() !== req.user._id.toString()) {
            notification = await notificationModel.create({
                clothId,
                receiverId,
                senderId: req.user._id,
                senderName: req.user.name,
                message: `${req.user.name}: "${message.length > 35 ? message.slice(0, 32) + '...' : message}"`,
                type: "chat"
            });
        }

        // Real-time WebSocket emission
        const io = req.app.get("io");
        if (io) {
            io.to(clothId.toString()).emit("chat_message", chat);
            if (receiverId && notification) {
                io.to(`user_${receiverId.toString()}`).emit("new_notification", notification);
            }
        }

        res.status(201).json(chat);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.get("/chat/meta/:clothId", auth, async (req, res) => {
    try {
        const cloth = await clothingModel.findById(req.params.clothId);
        if (!cloth) {
            return res.status(404).json({ message: "Cloth not found" });
        }

        const deals = await dealModel.find({
            clothId: req.params.clothId,
            $or: [
                { ownerId: req.user._id },
                { customerId: req.user._id }
            ]
        }).sort({ createdAt: -1 });

        res.json({
            cloth,
            deals,
            currentUser: {
                id: req.user._id,
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/chat/:clothId", auth, async (req, res) => {
    try {
        const chats = await chatModel.find({
            clothId: req.params.clothId
        }).sort({
            createdAt: 1
        });
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;