const express = require('express') ;
const dotenv = require('dotenv') ;
const connectDB = require('./db/connectDB');
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const {app, server} = require('./socket/socket.js')




connectDB();
dotenv.config(); 

// 

const port = process.env.PORT ;



app.use(express.json({limit:"50mb"})); // to parse JSON data on req.body
app.use(express.urlencoded({extended:true})) // to parse form data on req.body
app.use(cookieParser())

// routes
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/notifications',notificationRoutes);

server.listen(port, ()=> console.log("server is running on port "+port))