const mongoose = require('mongoose');
 const MessageSchema = new mongoose.Schema({
    conversation: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required: true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        
    },
    message:{
        type:String,
        required:true,
        trim: true, 
    },
 },{timestamps:true});

 module.exports = mongoose.model("Message", MessageSchema);