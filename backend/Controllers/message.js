const conversation = require("../Models/conversation");
const MessageModal= require("../Models/message");
const mongoose = require('mongoose');


exports.sendMessage = async(req,res)=>{
    try{
        let {conversation, content} = req.body;

        let addMessage = new MessageModal({
            sender: req.user._id,
            conversation,
            message:content
        })
        await addMessage.save();
        let populatedMessage = await addMessage.populate("sender", "-password");

        res.status(201).json(populatedMessage);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}

exports.getMessage = async(req,res)=>{
    try{
        let {convId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(convId)) {
            return res.status(400).json({ error: "Invalid conversation ID!" });
        }
        
        let messages = await MessageModal.find({
            conversation : convId
        }).populate("sender","-password")
    
        res.status(200).json({messages:"Fetched Message Successfully", messages})
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}