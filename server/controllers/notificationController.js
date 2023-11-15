const Notification = require('../models/notificationModel') ; 


const getNotifications = async(req,res) =>{
  try {
    const notifications = await Notification.find({recipient:req.user._id}).populate({
      path:"sender",
      select:" _id username profilePic"
    }).sort({createdAt:"-1"}).lean() ; 
    
    res.status(200).json(notifications)
  } catch (err) {
    res.status(500).json({error:err.message})
    console.log(err);
  }
}
const markNotiticationAsSeen = async(req,res)=>{
  try {
    await Notification.findByIdAndUpdate(req.params.id, {$set: {seen:true}})
    res.status(200).json({message:"Notification has been seen"})
  } catch (err) {
    res.status(500).json({error:err.message})
    console.log(err);
  }
}
const deleteNotifiction = async(req,res)=>{
  try {
    await Notification.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"Notification has been deleted"})
  } catch (error) {
    console.log(err);
    res.status(500).json({error:err.message})
  }
}
module.exports = {getNotifications, markNotiticationAsSeen, deleteNotifiction}