const express = require("express");
const router = express.Router();
const auth = require("./auth");
const { chatModel } = require("../mongo/chat");
const { clothingModel } = require("../mongo/home");
const { notificationModel } = require("../mongo/notification");

router.post("/chat/send", auth, async (req, res) => {

    try {
        const {
            clothId,
            message
        } = req.body;

        const cloth = await clothingModel.findById(clothId);

        if (!cloth) {
            return res.status(404).json({
                message: "Cloth not found"
            });
        }
        let receiverId;
        let receiverName;
        
        if (req.user._id.toString() === cloth.ownerId.toString()) {
            // Owner is sending the message
            // Send notification to the other user
            const lastChat = await chatModel.findOne({
                clothId
            }).sort({ createdAt: -1 });
            receiverId = lastChat.senderId;
            receiverName = lastChat.senderName;
        }
        else {                                                       // Send notification to owner // Customer is sending the message
            receiverId = cloth.ownerId;
            receiverName = cloth.ownerName;
        }
        
        const chat = await chatModel.create({
            clothId,
            senderId: req.user._id,
            senderName: req.user.name,
            receiverId,
            receiverName,
            message
        });
        res.status(201).json(chat);

        await notificationModel.create({
            clothId,
            receiverId ,
            senderId: req.user._id,        
            senderName: req.user.name,
            message: `${req.user.name} sent you a message`,
            type: "chat"
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
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
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;