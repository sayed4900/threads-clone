const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const {io, getRecipientSocketId } = require("../socket/socket");

const sendMessage = async (req,res)=>{
  try {
    const {recipientedId, message} = req.body;
    const senderId = req.user._id ; 
    if (senderId === recipientedId){
      return res.status(400).json({error:"You can't send a message to your self"})
    }
    let conversation = await Conversation.findOne({
      participants: {$all : [senderId, recipientedId]}
    }) ; 
    if (!conversation){
      conversation = new Conversation({
        participants: [senderId, recipientedId],
        lastMessage:{
          text:message,
          sender:senderId
        }
      })

      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender:senderId,
      text:message
    })

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage:{
          text: message,
          sender:senderId
        }
      })
    ]) 

    const recipientSocketId = getRecipientSocketId(recipientedId) ; 
    if (recipientSocketId){  
      io.to(recipientSocketId).emit("newMessage",newMessage)
    }

    res.status(201).json(newMessage)

  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

const getMessages = async (req,res)=>{
  const {otherUserId} = req.params ; 
  const userId = req.user._id ;
  try{
    const conversation = await Conversation.findOne({participants:{$all :[otherUserId, userId]}
    })

    if (!conversation){
      return res.status(404).json({error:"Conversation not found"})
    }

    const messages = await Message.find({conversationId:conversation._id}).sort({createdAt:1}) ; 

    res.status(200).json(messages)

  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const getConversations = async (req,res)=>{
  
  const userId = req.user._id ;
  try{
    const conversations = await Conversation.find({participants: userId}).populate({
      path:"participants",
      select:"username profilePic"
    }) ; 

    // remove the current user from participants 

    conversations.forEach(conversation => {
      conversation.participants = conversation.participants.filter(
        participant => participant._id.toString() !== userId.toString()
      );
    })

    res.status(200).json(conversations) ;
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}


module.exports = {sendMessage, getMessages, getConversations}