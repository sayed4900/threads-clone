const express = require('express') ;
const dotenv = require('dotenv') ;
const connectDB = require('./db/connectDB');
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const {v2 : cloudinary} = require('cloudinary')


connectDB();
dotenv.config(); 


const app = express(); 
const port = process.env.PORT ;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

app.use(express.json()); // to parse JSON data on req.body
app.use(express.urlencoded({extended:true})) // to parse form data on req.body
app.use(cookieParser())

// routes
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

app.listen(port, ()=> console.log("server is running on port "+port))