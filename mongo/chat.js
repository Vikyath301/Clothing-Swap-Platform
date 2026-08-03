const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const chatSchema = new mongoose.Schema({

    clothId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    senderName: {
        type: String,
        required: true
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    receiverName: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = {
    chatModel
};