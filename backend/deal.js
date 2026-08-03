const express = require("express");

const router = express.Router();

const auth = require("./auth");

const {dealModel} = require("../mongo/deal");
const {clothingModel} = require("../mongo/home");
const {notificationModel} = require("../mongo/notification");

router.post("/deal/request",auth,async(req,res)=>{

    try{
        const {clothId}=req.body;
        const cloth = await clothingModel.findById(clothId);

        if(!cloth){
            return res.status(404).json({
                message:"Cloth not found"
            });
        }

        if(cloth.ownerId.toString()===req.user._id.toString()){
            return res.status(400).json({
                message:"You cannot request your own cloth"
            });
        }

        if(!cloth.isAvailable){
            return res.status(400).json({
                message:"Deal already completed"
            });
        }
        const alreadyRequested = await dealModel.findOne({
            clothId,
            customerId:req.user._id,
            status:"pending"
        });
        if(alreadyRequested){
            return res.status(400).json({
                message:"Request already sent"
            });
        }
        const deal = await dealModel.create({
            clothId,
            ownerId:cloth.ownerId,
            ownerName:cloth.ownerName,
            customerId:req.user._id,
            customerName:req.user.name
        });

        cloth.dealStatus="pending";
        await cloth.save();
        await notificationModel.create({
            clothId,
            receiverId:cloth.ownerId,
            senderId:req.user._id,
            senderName:req.user.name,
            message:`${req.user.name} wants to confirm the swap.`,
            type:"deal"
        });
        res.status(201).json({
            message:"Deal request sent",
            deal
        });
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});


router.get("/deal/pending",auth,async(req,res)=>{
    try{
        const deals = await dealModel.find({
            ownerId:req.user._id,
            status:"pending"
        });
        res.json(deals);
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});


router.put("/deal/accept/:dealId",auth,async(req,res)=>{

    try{
        const deal = await dealModel.findById(req.params.dealId);

        if(!deal){
            return res.status(404).json({
                message:"Deal not found"
            });
        }
        deal.status="accepted";
        await deal.save();
        const cloth = await clothingModel.findById(deal.clothId);
        cloth.isAvailable=false;
        cloth.dealStatus="confirmed";
        await cloth.save();
        await notificationModel.create({
            clothId:deal.clothId,
            receiverId:deal.customerId,
            senderId:req.user._id,
            senderName:req.user.name,
            message:"Your deal has been accepted.",
            type:"deal"
        });
        res.json({
            message:"Deal accepted"
        });
    }

    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});

router.put("/deal/reject/:dealId",auth,async(req,res)=>{

    try{
        const deal = await dealModel.findById(req.params.dealId);

        if(!deal){
            return res.status(404).json({
                message:"Deal not found"
            });
        }
        deal.status="rejected";
        await deal.save();
        await notificationModel.create({
            clothId:deal.clothId,
            receiverId:deal.customerId,
            senderId:req.user._id,
            senderName:req.user.name,
            message:"Your deal request was rejected.",
            type:"deal"
        });
        res.json({
            message:"Rejected"
        });
    }

    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});




router.get("/mydeals",auth,async(req,res)=>{

    try{
        const deals = await dealModel.find({
            customerId:req.user._id
        });
        res.json(deals);
    }

    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});


module.exports = router;