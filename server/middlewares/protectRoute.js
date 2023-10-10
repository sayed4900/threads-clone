const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const protectRoute = async(req, res, next)=>{
  try{
    const token = req.cookies.jwt ;
    
    if (!token)
      return res.status(401).json({message:"Unauthorized"}) ;
    
    const decode = jwt.verify(token, process.env.JWT_SECRET) ; 
  
    const user = await User.findById(decode.userId).select('-password');
    
    req.user = user ;
    next();
  }catch(err){
    res.status(500).json({message:err.message}) ;
    console.log(err);
  }
}
module.exports = protectRoute;