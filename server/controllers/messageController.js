const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

const sendMessage = async (req,res)=>{
  try {
    const {recipientedId, message} = req.body;
    const senderId = req.user._id ; 
    if (senderId === recipientedId){
      return res.status().json({error:"You can't send a message to your self"})
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

    res.status(201).json(newMessage)

  } catch (error) {
    res.status(500).json({error: error.message})
  }
}


module.exports = {sendMessage}