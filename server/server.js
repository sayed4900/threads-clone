const express = require('express') ;
const dotenv = require('dotenv') ;
const connectDB = require('./db/connectDB');

connectDB();

dotenv.config(); 


const app = express(); 

const port = process.env.PORT ;

app.listen(port, ()=> console.log("server is running on port "+port))