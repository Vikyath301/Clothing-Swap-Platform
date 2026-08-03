const dns=require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"]);

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://vikyathkotian9_db_user:vikki123@fsdvikki.yxsapxe.mongodb.net/?appName=FSDVikki");


const clothingSchema = new mongoose.Schema({

    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    ownerName:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    brand:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    size:{
        type:String,
        required:true
    },

    condition:{
        type:String,
        required:true
    },

    swapValue:{
        type:Number,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },
    
    isAvailable:{
        type:Boolean,
        default:true
    },
    
    dealStatus:{
        type:String,
        enum:["none","pending","confirmed"],
        default:"none"
    }

},
{
    timestamps:true
});

const clothingModel = mongoose.model("Clothing", clothingSchema);

module.exports = {
    clothingModel
};