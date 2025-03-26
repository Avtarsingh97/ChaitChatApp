const ConversationModal = require("../Models/conversation");



exports.addConversation = async(req,res)=>{
    try{
        let senderId = req.user._id;
        let {receiverId} = req.body;

        // Check if a conversation already exists
        let existingConversation = await ConversationModal.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (existingConversation) {
            return res.status(200).json({
                message: "Conversation already exists",
                conversation: existingConversation
            });
        }
    
        // If not found, create a new conversation
        let newConversation = new ConversationModal({
            members: [senderId, receiverId]
        });
        
        await newConversation.save();
        res.status(200).json({
            message:"Added Successfully",
            conversation: newConversation
        });

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}

exports.getConversation = async(req,res)=>{
    try{
        let loggedUserId = req.user._id;
       
        let conversations = await ConversationModal.find({
            members:{$in:[loggedUserId]}
        }).populate("members","-password");
        res.status(200).json({
            message:"Fetched Successfully",
            conversations
        });
    
        
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Server Error"});
    }
}