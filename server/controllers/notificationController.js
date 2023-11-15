const Notification = require('../models/notificationModel') ; 


const getNotifications = async(req,res) =>{
  try {
    const notifications = await Notification.find({recipient:req.user._id}).populate({
      path:"sender",
      select:" _id username profilePic"
    }).sort({createdAt:"1"}).lean() ; 
    
    res.status(200).json(notifications)
  } catch (err) {
    res.status(500).json({error:err.message})
    console.log(err);
  }
}

module.exports = {getNotifications}