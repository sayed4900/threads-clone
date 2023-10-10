const mongoose = require('mongoose') ; 
require('dotenv').config()
const connectDB = async()=>{
  try{
    console.log(process.env.DATABASE);
    await mongoose.connect(process.env.DATABASE,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    }) ; 

    console.log(`MongoDB Connected`);
  }catch(err){
    console.error(`Error ${err.message}`);
    process.exit(1);
  }
}
module.exports= connectDB ;