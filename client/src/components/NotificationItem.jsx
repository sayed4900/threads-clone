import { Avatar, Box, Divider, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { TiDelete } from "react-icons/ti";
import useShowToast from '../hooks/useShowToast'
import notificationAtom, { messageNotificationAtom } from '../atoms/notificationAtom'
import { selectedConversationAtom } from '../atoms/messagesAtom'


const NotificationItem = ({notification,recipient, setIsOpen}) => {
  const currentUser = useRecoilValue(userAtom)
  const showToast = useShowToast() ;
  const setNotificationsState = useSetRecoilState(notificationAtom)
  const messageNotificationsState = useSetRecoilState(messageNotificationAtom)

  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)

  
  const handleDeleteNotification = async(event)=>{
    event.stopPropagation()
    try {
      setIsRemoving(true)
      

      await fetch(`/api/notifications/${notification._id}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        },
      }) ;
      
      setNotificationsState((prevNotifis)=>{
        const updateNotifications = prevNotifis.filter((n)=>
          n._id !== notification._id )
        return updateNotifications ;
      })
      
    } catch (error) {
      showToast("Error", error.message, "error")
    }finally{
      setIsRemoving(false)
    }
  }
  const handleSeenNotification = async(event)=>{
    event.stopPropagation()
    try {
      
      await fetch(`/api/notifications/${notification._id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
      }) ;
      
      setNotificationsState((prevNotifis)=>{
        const updateNotifications = prevNotifis.map((n)=> {
          if (n._id == notification._id ){
            return {...n, seen:true}
          }
          return n;
        })
        return updateNotifications ;
      })

      if(notification.type === "message"){
        setIsOpen(false)
        
        setSelectedConversation({
          _id:notification.conversationId,
          userId: notification.sender._id,
          username:notification.sender.username,
          userProfilePic:notification.sender.profilePic
        })  
      }

      messageNotificationsState((prevNotifis)=>{
        const updateNotifications = prevNotifis.map(n=>{
          if (n._id === notification._id){
            return {...n, seen: true}
          }
          return n ; 
        })
        return updateNotifications;
      })
      
      console.log(selectedConversation)
    } catch (error) {
      console.log(error)
      showToast("Error", error.message, "error")
    }
  }


  return (
    <>
      <Flex my={"5px"} alignItems={"center"} padding={"3px"}
        style={{
          transition: 'transform 0.5s ease-out', 
          transform: isRemoving ? 'translateX(-100%)' : 'translateX(0)', 
        }}
      >
        {!notification.seen &&notification.sender.username!==currentUser.username&&
        <Box width={"8px"} h={"8px"} borderRadius={"50%"}  padding={"1px"} mx={"7px"} bg={"red.500"}></Box>}
        {/* <Avatar src={notification.sender.profilePic} mx={"10px"} my={"10px"}/> */}
        <Avatar src={recipient.profilePic} mx={"10px"} my={"10px"}/>
        {notification.type==="like" && <Link to={`/${currentUser.username}/post/${notification. postId}`} onClick={handleSeenNotification}>{notification.sender.username} liked your post</Link>
        }
        {notification.type==="reply" &&
        <Flex direction={"column"} gap={"10px"}> 
          <Link to={`/${currentUser.username}/post/${notification.postId}`} onClick={handleSeenNotification}>{notification.sender.username} reply to your post</Link>
          <Text color={"#777"}>{notification.reply?.length > 20 ? notification.reply?.substring(0,20)+"..." : notification.reply }</Text>
        </Flex>
        }
        {notification.type==="message" &&
        <Link to={`/chat`} onClick={handleSeenNotification}>{recipient.username} 
        <Flex direction={"column"} gap={"10px"}> 
          <Text color={"#777"}>{notification.reply?.length > 20 ? notification.reply?.substring(0,20)+"..." : notification.reply }</Text>
        </Flex>
        </Link>
        }
        <Box ml={"auto"} mr={"25px"}
          style={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
        >
          {notification.type!=="message" &&<TiDelete size={"25"}
            onClick={handleDeleteNotification} />}
        </Box>
      </Flex>
      <Divider />
    </>
  )
}

export default NotificationItem