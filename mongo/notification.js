const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://vikyathkotian9_db_user:vikki123@fsdvikki.yxsapxe.mongodb.net/?appName=FSDVikki");

const notificationSchema = new mongoose.Schema({

    clothId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }, 
    
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    senderName:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },

    type:{
        type:String,
        default:"chat"
    },

    isRead:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

const notificationModel = mongoose.model("Notification",notificationSchema);

module.exports={
    notificationModel
};