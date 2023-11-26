const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");
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
    conversation = await Conversation.findById(conversation._id)
    .populate({
      path: 'participants',
      select: '_id username profilePic'
    })
    .exec();

    conversation.participants = conversation.participants.filter(
      participant => participant._id.toString() !== senderId.toString()
    );

    const newMessage = new Message({
      conversationId: conversation._id,
      sender:senderId,
      text:message
    })

    // if the there is a notification with the same conversation, change the data on it only else create new one and on the client side 
    let notification = await Notification.findOne({conversationId:conversation._id})
    
    if (!notification){
      notification = await new Notification({
        recipient:recipientedId,
        sender:senderId,
        type:"message",
        conversationId:conversation._id,
        seen:false,
        reply:message,
      })
    }else{
      notification.reply = message;
      notification.recipient = recipientedId ; 
      notification.sender = senderId ; 
      notification.seen = false ;
    }

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        $inc: { unseenMessagesCount: 1 },
        lastMessage:{
          text: message,
          sender:senderId
        }
      }),
      notification.save()
    ]) 
    

    

    const recipientSocketId = getRecipientSocketId(recipientedId) ; 
    if (recipientSocketId){  
      io.to(recipientSocketId).emit("newMessage", {message:newMessage,
        unseenMessagesCount:conversation.unseenMessagesCount})

      io.to(recipientSocketId)
      .emit("messageNotification",{notification,recipient:conversation.participants[0], sender:req.user})
      
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
    const conversation = await Conversation
    .findOne({participants:{$all :[otherUserId, userId]}})

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
    const conversations = await Conversation.find({participants: userId}).sort({ updatedAt: -1 }).populate({
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