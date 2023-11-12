const {Server} = require('socket.io');
const http = require('http');
const express = require('express')
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

const app = express();
const server = http.createServer(app) ;
const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000", // our react app
    methods:["Get","Post"]
  }
}) ;

const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId] ;
}

const userSocketMap = {} ;// userId: socketId
io.on('connection',(socket)=>{
  console.log("user connected", socket.id)
  const userId = socket.handshake.query.userId ;
  if (userId != "undefined"){
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap)) // [1,2,..."user Ids"] 
  
  socket.on("markMessagesAsSeen", async({conversationId, userId})=>{
    try {
      await Message.updateMany({conversationId:conversationId , seen:false}, {$set:{seen:true}})
      await Conversation.updateOne({_id:conversationId}, {$set:{"lastMessage.seen" : true}})
      io.to(userSocketMap[userId]).emit("messageSeen",{conversationId})
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('disconnect', () => {
    console.log("user disconnected")
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

  })
})

module.exports = {io, server, app, getRecipientSocketId}