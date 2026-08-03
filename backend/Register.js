const express = require("express");
const bcrypt = require("bcryptjs");
const {regModel}= require ("../mongo/register.js")
const router = express.Router();


router.post("/register", async(req,res)=>{

    try{

        const {name,email,password,location}=req.body;

        const existingUser=await regModel.findOne({email});

        if(existingUser){

            return res.status(400).json({
                message:"User already exists"
            });

        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser = await regModel.create({
            name,
            email,
            password: hashedPassword,
            location
        });

        res.status(201).json({
            message:"Registration Successful"
        });

    }

    catch(err){

        console.log(err);
        res.status(500).json({
            message:err.message
        });

    }

});

module.exports=router;