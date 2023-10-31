const User = require("../models/userModel");
const Post = require("../models/postModel");

const cloudinary = require('../middlewares/cloudinary')


const createPost = async (req, res) => {
  try{
    const {postedBy, text} = req.body;
    let {img} = req.body;
    
    if (!postedBy || !text) 
      return res.status(400).json({error:"Posted by and text fields are required"})

    const user = await User.findById(postedBy) ;
    
    if (!user)
      return res.status(404).json({error:"User not found"}) ;

    if (req.user._id.toString() !== postedBy)
      return res.status(401).json({error:"Unauthorized to create a post"}) ; 
    
    let maxLength = 500;
    if (text.length > maxLength)
      return res.status(400).json({error:`Text must be less than ${maxLength} characters`}) ; 

    if (img){
      const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
    }
    const post = new Post({
      postedBy,
      text,
      img,
    })
    await post.save(); 

    res.status(200).json({message:"Post has been created", post})

  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}

const getPost = async(req, res) => {
  try{
    const post = await Post.findById(req.params.id);
  
    if (!post)
      return res.status(404).json({error:"Post not found"})
    
    res.status(200).json({post})
  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}
const deletePost = async(req, res) => {
  try{

    const post = await Post.findById(req.params.id);
    
    if (!post)
      return res.status(404).json({error:"Post not found"})
    
    if (post.postedBy.toString() != req.user._id.toString())
      return res.status(401).json({error:"Unauthorized to delete this post"}) ;

    // delete the post
    await Post.findByIdAndDelete(req.params.id);


    res.status(204).json({message:"post has been deleted"}) ;
  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}

const likeUnlikePost = async(req, res) => {
  try{
    const postId = req.params.id;
    const userId= req.user._id;
    const post = await Post.findById(postId);
    if (!post){
      return res.status(400).json({error:"No post to like it"}) ; 
    }
    
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost){
      // unlike post
      await Post.findOneAndUpdate({_id:postId},{$pull:{likes:userId}});
      res.status(200).json({message: "Post unliked successfully"});
    }else{
      // like post
      await Post.updateOne({_id:postId},{$push:{likes:userId}});
      res.status(200).json({message:"Post liked successfully"});
    }
    
  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}
const replyToPost = async(req,res)=>{
  try{
    const postId = req.params.id;
    const {text} = req.body;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    
    
    if (!text)
    return res.status(400).json({error:"Text field is required"}) ;
  
    const post = await Post.findById(postId);
  
    if (!post)
      return res.status(400).json({error:"Post not found"}) ;
    
    const reply = {userId, text, userProfilePic, username} ;
    post.replies.push(reply); 

    await post.save() ;

    res.status(200).json({message:"Reply added successfully",post})

  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}

const getFeedPosts = async(req,res)=>{
  try{
    const userId = req.user._id ; 
    const user = await User.findById(userId);
    if (!user)
      return res.status(400).json({error:"User not found"}) ;

    const following = user.following;
    
    
    console.log(following); //[ '65257fa1a8218bb3ffcce0ea' ]

    const posts = await Post.find({postedBy:{$in: following }}).sort({createdAt:-1});
    
    res.status(200).json(posts)
  }catch(err){
    res.status(500).json({error:err.message})
    console.log(err);
  }
}

module.exports = {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts} ; 