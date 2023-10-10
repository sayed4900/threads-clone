const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require('../utils/helpers/generateToken');

const signupUser = async (req,res) =>{
  try{
    const {name, email, username, password} = req.body;
    const user = await User.findOne({$or:[{email},{username}]}) ; 
    if (user)
      return res.status(400).json({message:"User already exists"})

    const salt = await bcrypt.genSalt(10) ; 
    const hashedPassword =  await bcrypt.hash(password, salt) ;
    
    const newUser = new User({
      name,
      email,
      username,
      password:hashedPassword,
    });
    await newUser.save() ;
    
    if (newUser){
      generateTokenAndSetCookie(newUser._id, res) ;
      res.status(201).json({
        _id:newUser._id,
        name: newUser.name,
        email:newUser.email,
        username: newUser.username
      })
    }else
      res.status(400).json({message: 'Invalid user data'})

  }catch(err){
    res.status(500).json({message:err.message})
    console.log(err);
  }
}
const loginUser = async (req,res) =>{
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username}) ; 
    
    
    const isPasswordCorrect = await bcrypt.compare(password, user?.password||"") ;
    
    if (!isPasswordCorrect || !user) 
      return res.status(400).json({message:"Invalid username or password"})
    
    generateTokenAndSetCookie(user._id,res) ; 


    res.status(200).json({
      _id: user._id,
      name:user.name,
      username: user.username,
      email: username.email
    })

  }catch(err){
    res.status(500).json({message:err.message})
    console.log(err);
  }
}
const logoutUser = async(req,res)=>{
  try{
    res.cookie("jwt","",{maxAge:1}); 
    res.status(200).json({ message:"User logout successfully"}) ;
  }catch(err){
    res.status(500).json({message:err.message})
    console.log(err);
  }
}

const followUnfollowUser = async(req,res)=>{
  try{
    
    const {id} = req.body ;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id) ; 

    if (id === req.user._id)  return res.status(400).json({message:"You can't follow yourself"})
    
    if (!userToModify === !currentUser)  return res.status(400).json({message:"User not found"})

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing){
      //unfollow user
      // await 
    }else{

    }

    res.json(currentUser)
  }catch(err){
    res.status(500).json({message:err.message})
    console.log(err);
  }
}

module.exports = {signupUser, loginUser, logoutUser, followUnfollowUser}