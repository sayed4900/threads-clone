import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React, { useState } from 'react'
import {IoSendSharp} from 'react-icons/io5'
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue } from 'recoil';
import { selectedConversationAtom } from '../atoms/messagesAtom';

const MessagesInput = ({setMessages}) => {
  const [messageText, setMessageText] = useState("") ;
  const showToast = useShowToast() ;
  const selectedConversation = useRecoilValue(selectedConversationAtom)

  const handleSendMessage = async(e) =>{
    e.preventDefault() ;
    if (!messageText) return;

    try {
      const res = await fetch(`/api/messages/`,{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          message:messageText,
          recipientedId: selectedConversation.userId
        })
      })
      const data = await res.json() ;
      console.log(data)
      if (data.error){
        showToast("Error", data.error, "error") ; 
        return ;
      }
      setMessages((messages)=>[...messages, data])
      setMessageText("")
    } catch (error) {
      console.error('Error:', error);
      showToast("Error", error.message, "error")
    }
  }
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup >
        <Input w={"full"} placeholder='Type a message'
          onChange={(e)=>setMessageText(e.target.value)} 
          value={messageText}
        />
        <InputRightElement onClick={handleSendMessage}>
          <IoSendSharp cursor={"pointer"} />
        </InputRightElement>
      </InputGroup>
    </form>
  )
}

export default MessagesInput