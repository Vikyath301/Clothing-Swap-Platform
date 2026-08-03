const express=require("express");
const router=express.Router();

const auth=require("./auth");

const {notificationModel}=require("../mongo/notification");

router.get("/notifications",auth,async(req,res)=>{
    try{
        const notifications=await notificationModel.find({
            receiverId:req.user._id
        }).sort({
            createdAt:-1
        });
        res.status(200).json(notifications);
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});

router.patch("/notifications/:id",auth,async(req,res)=>{
    try{
        await notificationModel.findByIdAndUpdate(
            req.params.id,
            {
                isRead:true
            }
        );
        res.json({
            message:"Notification Updated"
        });
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});


router.get("/notifications/count",auth,async(req,res)=>{
    try{
        const count=await notificationModel.countDocuments({
            receiverId:req.user._id,
            isRead:false
        });
        res.json({
            count
        });
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }
});

module.exports=router;