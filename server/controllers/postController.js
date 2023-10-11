const User = require("../models/userModel");
const Post = require("../models/postModel");

const createPost = async (req, res) => {
  try{
    const {postedBy, text, img} = req.body;
    
    if (!postedBy || !text) 
      return res.status(400).json({message:"Posted by and text fields are required"})

    const user = await User.findById(postedBy) ;
    
    if (!user)
      return res.status(404).json({message:"User not found"}) ;

    if (req.user._id.toString() !== postedBy)
      return res.status(401).json({message:"Unauthorized to create a post"}) ; 
    
    let maxLength = 500;
    if (text.length > maxLength)
      return res.status(400).json({message:`Text must be less than ${maxLength} characters`}) ; 

    const post = new Post({
      postedBy:postedBy,
      text: text,
      img: img || "",
    })

    await post.save(); 

    res.status(200).json({message:"Post has been created", post})

  }catch(err){
    res.status(500).json({message:err.message})
    console.log(err);
  }
}

const getPost = async(req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    console.log(post);
    console.log(req.params.id);
    if (!post)
      return res.status(404).json({message:"Post not found"})
    
    res.status(200).json({post})
  }catch(err){
    res.status(500).json({message:err.message})
    console.log(err);
  }
}
const deletePost = async(req, res) => {
  try{

    const post = await Post.findById(req.params.id);
    
    if (!post)
      return res.status(404).json({message:"Post not found"})
    
    if (post.postedBy !== req.user._id.toString())
      return res.status(401).json({message:"Unauthorized to delete this post"}) ;

    // delete the post
    await Post.findByIdAndDelete(req.params.id);


    res.status(204).json({message:"post has been deleted"}) ;
  }catch(err){
    res.status(500).json({message:err.message})
    console.log(err);
  }
}

module.exports = {createPost, getPost, deletePost} ; 