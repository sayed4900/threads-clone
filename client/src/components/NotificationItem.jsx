import { Avatar, Box, Divider, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { TiDelete } from "react-icons/ti";
import useShowToast from '../hooks/useShowToast'
import notificationAtom from '../atoms/notificationAtom'


const NotificationItem = ({notification}) => {
  const currentUser = useRecoilValue(userAtom)
  const showToast = useShowToast() ;
  const setNotificationsState = useSetRecoilState(notificationAtom)
  const [isRemoving, setIsRemoving] = useState(false);

  
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
    }
  }
  const handleSeenPost = async(event)=>{
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
      
    } catch (error) {
      showToast("Error", error.message, "error")
    }
  }
  return (
    <>
      <Flex my={"5px"} alignItems={"center"} padding={"3px"}
        style={{
          // transition: 'transform 0.5s ease-out', // CSS transition for transform
          // transform: isRemoving ? 'translateX(-100%)' : 'translateX(0)', // Move item offscreen on removal
        }}
      >
        {!notification.seen &&
        <Box width={"8px"} h={"8px"} borderRadius={"50%"}  padding={"1px"} mx={"7px"} bg={"red.500"}></Box>}
        <Avatar src={notification.sender.profilePic} mx={"10px"} my={"10px"}/>
        {notification.type==="like" ? <Link to={`/${currentUser.username}/post/${notification.postId}`} onClick={handleSeenPost}>{notification.sender.username} liked your post</Link> : <Text>{notification.sender.username} reply on your post</Text>}
        <Box ml={"auto"} mr={"25px"}
          style={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
          
        >
          <TiDelete size={"25"} onClick={handleDeleteNotification} />
        </Box>
      </Flex>
      <Divider />
    </>
  )
}

export default NotificationItem