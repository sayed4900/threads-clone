import {atom} from 'recoil' ;

export const conversationAtom = atom({
  key:"conversationAtom",
  default:[]
})

export const selectedConversationAtom = atom({
  key:"selectedConversationAtom",
  default:{
  _id:"", // id of the conversation
  userId:"", // the other user that we chat with him..
  username:"",
  userProfilePic:"",
  unseenMessagesCount:0
  }

})