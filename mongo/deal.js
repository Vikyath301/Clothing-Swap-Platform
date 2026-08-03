const dns = require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"]);

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const dealSchema = new mongoose.Schema({

    clothId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    ownerName:{
        type:String,
        required:true
    },

    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    customerName:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }

},{
    timestamps:true
});

const dealModel = mongoose.model("Deal",dealSchema);

module.exports = {
    dealModel
};