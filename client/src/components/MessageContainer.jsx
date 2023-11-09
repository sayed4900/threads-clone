import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Message from './Message'
import MessagesInput from './MessagesInput'
import useShowToast from '../hooks/useShowToast'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import { useRecoilState } from 'recoil'

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  useEffect(() => {
    const getMessages = async () =>{
      try {
        const res = await fetch(`/api/messages/${selectedConversation.userId}`) ;
        const data = await res.json()
        console.log(data)
        if (data.error){
          showToast("Error", data.error, "error") ;
          return ;
        }
      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }
    getMessages();
  },[showToast, selectedConversation.userId])

  return (
    <Flex flex="70"
      bg={useColorModeValue("gary.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2} p={2}>
        <Avatar src='' size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          Sayed <Image src='./verified.png' w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider/>

      <Flex flexDir={"column"} gap={4} my={4} p={2}
        height={"400px"}  overflowY={"auto"} 
      >
        {false &&(
          [...Array(5)].map((_,i)=>(
            <Flex key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start":"flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"}/>
                <Skeleton h={"8px"} w={"250px"}/>
                <Skeleton h={"8px"} w={"250px"}/>
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))
        )}
        <Message ownMessage={true}/>
        <Message ownMessage={false}/>
        <Message ownMessage={true}/>
        <Message ownMessage={false}/>
        <Message ownMessage={true}/>
        <Message ownMessage={false}/>
        <Message ownMessage={false}/>
        <Message ownMessage={true}/>
      </Flex>
      <MessagesInput />
    </Flex>
  )
}

export default MessageContainer