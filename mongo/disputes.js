const dns=require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"]);

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://vikyathkotian9_db_user:vikki123@fsdvikki.yxsapxe.mongodb.net/?appName=FSDVikki");



const disputeSchema = new mongoose.Schema(
{
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deal",
        required: true
    },

    clothId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clothing",
        required: true
    },

    raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Register",
        required: true
    },

    raisedByName: {
        type: String,
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Register"
    },

    ownerName: String,

    reason: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Resolved", "Rejected"],
        default: "Pending"
    }
},
{
    timestamps: true
});

const disputeModel = mongoose.model("Dispute", disputeSchema);

module.exports = {
    disputeModel
};