import { SearchIcon} from '@chakra-ui/icons'
import {GiConversation} from 'react-icons/gi'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorMode, useColorModePreference } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import MessageContainer from '../components/MessageContainer'
import Message from '../components/Message'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'

const ChatPage = () => {
  const [loadingConversations, setLoadingConversations] = useState(true) ; 
  const [searchText, setSearchText] = useState("") ; 
  const [searchingUser, setSearchingUser] = useState(false) ;
  const [conversations, setConversations] = useRecoilState(conversationAtom) ;
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const currentUser = useRecoilValue(userAtom) ;
  const showToast = useShowToast() ;
  const {socket, onlineUsers} = useSocket() 

  
  

  useEffect(() => {
    // if (selectedConversation._id === "") {
      socket?.on("newMessage", ({message,unseenMessagesCount}) => {
        setConversations((prev) => {
          const updatedConversations = prev.map((conversation) => {
            if (conversation._id === message.conversationId) {
              return {
                ...conversation,
                lastMessage: {
                  text: message.text,
                  sender: message.sender,
                },
                unseenMessagesCount:unseenMessagesCount === 0 ? 1 : unseenMessagesCount+1
              };
            }
            
            return conversation
            // return {...conversation, unseenMessagesCount};
          });
          
          // Sort conversations to move the one with new message to the top
          updatedConversations.sort((a, b) => {
            if (a._id === message.conversationId) return -1;
            if (b._id === message.conversationId) return 1;
            return 0;
          });
          
          return updatedConversations;
        });
      });
    // }
      console.log(conversations);
    return () => socket?.off("newMessage");
  }, [socket, selectedConversation, setConversations]);
  

  useEffect(()=>{
    
    const getConversations = async () => {
      if (selectedConversation.mock) return ;
      try{
        const res = await fetch("/api/messages/conversations") ; 
        const data = await res.json() ; 
        
        if (data.error){
          showToast("Error", data.error, "error")
          return ;
        }
        console.log(data)
        setConversations(data)
      }catch (error) {
        showToast("Error", error.message, "error")
      }finally{
        setLoadingConversations(false);
      }
    
    }

    getConversations();
  },[showToast, setConversations, selectedConversation])


  useEffect(()=>{
    socket?.on("messageSeen",({conversationId})=>{
      setConversations(prev => {
        const updatedConversations = prev.map((conversation) =>{
          if (conversation._id === conversationId){
            
            return {
              ...conversation,
              lastMessage:{
                ...conversation.lastMessage,
                seen:true
              }
            }
          }
          return conversation
        })
        return updatedConversations;
      })
    })
  },[socket, conversations, setConversations])

  const handleConversationSearch = async (e) => {
    e.preventDefault()
    setSearchingUser(true) ;
    try {
      const res = await fetch(`/api/users/profile/${searchText}`) ; 
      const searchedUser = await res.json() ;
      if (searchedUser.error){
        showToast("Error", searchedUser.error, "error")
        return ;
      }
      console.log(searchedUser) ;

      if (searchedUser._id === currentUser._id){
        showToast("Error", "You can't message your self", "error") ;
        return ;
      } 

      // If user is already on conversation
      const foundConversation = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (foundConversation){
        setSelectedConversation({
          _id:foundConversation._id,
          userId:searchedUser._id,
          username:searchedUser.username,
          userProfilePic:searchedUser.profilePic
        })
        setConversations((prevConvs) => [ foundConversation, ...prevConvs])

        return ;
      }
      
      // if there is no conversation
      
      const mockConversation = {
        mock:true,
        lastMessage:{
          text:"",
          sender:""
        },
        _id:Date.now(),
        participants:[
          {
          _id: searchedUser._id,
          username: searchedUser.username,
          profilePic: searchedUser.profilePic
          }
        ]
      }
      
      setConversations((prevConvs) => [ mockConversation, ...prevConvs])

    } catch (error) {
      showToast("Error", error.message, "error")
    }finally{
      setSearchingUser(false) ;
    }
  }



  return (
    <Box position={"absolute"}
      left={"50%"}
      w={{
        base:"100%",
        md :"80%",
        lg :"750px",
        
      }}
      p={4}
      transform={"translateX(-50%)"}
      
    >
      <Flex
        gap={4}
        flexDirection={{
          base:"column",
          md:"row"
        }}
        maxW={{
          sm:"400px",
          md:"full"
        }}
        mx={"auto"}
      >
        <Flex flex={30} 
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm:"250px",
            md:"full"
          }}
          mx={"auto"}
        >
          <Text fontWeight={700} color={useColorModePreference("gray.600", "gray.400")}>
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder='Search for a user'
              onChange={(e) => setSearchText(e.target.value)}/>

              <Button size={"sm"} alignItems={"center"}
              isLoading={searchingUser}
              onClick={handleConversationSearch}  >
              
                <SearchIcon/>
              </Button>
            </Flex>
          </form>
          {loadingConversations && (
            [0, 1, 2, 3, 4].map((_, i)=>(
              <Flex key={i} gap={4} alignItems={"center"} padding={1} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={10}/>
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>

            ))
          )}

          {!loadingConversations && 
            conversations.map((conversation)=>(
              <Conversation key={conversation._id} conversation={conversation}
                isOnline={onlineUsers.includes(conversation?.participants[0]?._id)}
              />
            ))
          }
          
          
        </Flex>
        {!selectedConversation._id &&(<Flex 
          flex={70}
          borderRadius={"md"}
          flexDir={"column"}
          p={2}
          alignItems={"center"}
          justifyContent={"center"}
          // height={"400px"}
        >
          <GiConversation size={100}/>
          <Text fontSize={20}>Select a conversation to start messaging</Text>
        </Flex>)}
        {selectedConversation._id && <MessageContainer />}

      </Flex>
    </Box>
  )
}

export default ChatPage