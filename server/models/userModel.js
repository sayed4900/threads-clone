const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  username: {
    type:String,
    required: true,
    unique:true,
  },
  email:{
    type: String,
    required,
    unique:true
  },
  password:{
    type: String,
    required:true
  },
  profilePic:{
    type: String,
    default:""
  },
  followers:{
    type:[String],
    default:[]
  },
  following:{
    type:[String],
    default:[]
  },
  bio:{
    type:String,
    default:""
  }
},{
  timestapms:true
})

const User = mongoose.model('User', userSchema);