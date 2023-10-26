const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require('../utils/helpers/generateToken');
const cloudinary = require('../middlewares/cloudinary')



const signupUser = async (req,res) =>{
  try{
    const {name, email, username, password} = req.body;
    const user = await User.findOne({$or:[{email},{username}]}) ; 
    if (user)
      return res.status(400).json({error:"User already exists"})

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
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        profilePic: newUser.profilePic,
        bio: newUser.bio
      })
    }else
      res.status(400).json({error: 'Invalid user data'})

  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}
const loginUser = async (req,res) =>{
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username}) ; 
    
    
    const isPasswordCorrect = await bcrypt.compare(password, user?.password||"") ;
    
    if (!isPasswordCorrect || !user) 
      return res.status(400).json({error:"Invalid username or password"})
    
    generateTokenAndSetCookie(user._id,res) ; 


    res.status(200).json({
      _id: user._id,
      name:user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic:user.profilePic
    })

  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}
const logoutUser = async(req,res)=>{
  try{
    res.cookie("jwt","",{maxAge:1}); 
    res.status(200).json({ message:"User logout successfully"}) ;
  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}
const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		// await Post.updateMany(
		// 	{ "replies.userId": userId },
		// 	{
		// 		$set: {
		// 			"replies.$[reply].username": user.username,
		// 			"replies.$[reply].userProfilePic": user.profilePic,
		// 		},
		// 	},
		// 	{ arrayFilters: [{ "reply.userId": userId }] }
		// );

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const followUnfollowUser = async(req,res)=>{
  try{
    
    const {id} = req.params ;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id) ; 
    
    console.log(id);
    console.log(req.user._id);
    if (id === req.user._id.toString())  return res.status(400).json({error:"You can't follow yourself"})
    
    if (!userToModify || !currentUser)  return res.status(400).json({error:"User not found"})

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing){
      //unfollow user
      await User.findByIdAndUpdate(req.user._id, {$pull : {following: id}}) // current user
      await User.findByIdAndUpdate(id, {$pull:{followers:req.user._id}})

      res.status(200).json({message:"User unfollow successfully"})
    }else{
      // follow user 
      await User.findByIdAndUpdate(id, {$push:{followers: req.user._id}} )
      await User.findByIdAndUpdate(req.user._id,{$push:{following: id}} )
      res.status(200).json({message:"User follow successfully"})
    }

    
  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}

const getUserProfile = async (req, res)=>{
  try{
    const user = await User.findOne({username:req.params.username}).select("-password").select("-updatedAt");
    
    if (!user)
      return res.status(400).json({error:"User not found"})
    
    res.status(200).json(user)
  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}

module.exports = {signupUser, loginUser, logoutUser, updateUser, followUnfollowUser, getUserProfile}