const dns = require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"]);

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const dealSchema = new mongoose.Schema({

    clothId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Clothing",
        required:true
    },

    clothTitle: {
        type: String,
        default: ""
    },

    clothImage: {
        type: String,
        default: ""
    },

    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "register",
        required:true
    },

    ownerName:{
        type:String,
        required:true
    },

    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "register",
        required:true
    },

    customerName:{
        type:String,
        required:true
    },

    offeredClothId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Clothing"
    },

    offeredClothTitle: {
        type: String,
        default: ""
    },

    offeredClothImage: {
        type: String,
        default: ""
    },

    status:{
        type:String,
        enum:["pending","accepted","rejected","completed"],
        default:"pending"
    }

},{
    timestamps:true
});

const dealModel = mongoose.model("Deal",dealSchema);

module.exports = {
    dealModel
};