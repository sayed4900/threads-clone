const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'reply', 'message'],
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    
  },
  conversationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Conversation"
  },
  seen: {
    type: Boolean,
    default: false,
  },
  reply:{
    type:String
  }
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
