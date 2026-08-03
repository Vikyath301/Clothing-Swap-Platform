const dns=require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"]);

const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        default:""
    },

    location:{
        type:String,
        default:""
    },

    profilePic:{
        type:String,
        default:""
    }

});

const regModel = mongoose.model("register",registerSchema);

module.exports = {regModel};