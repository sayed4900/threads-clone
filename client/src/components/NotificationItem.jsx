import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import React from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { TiDelete } from "react-icons/ti";


const NotificationItem = ({notification}) => {
  const currentUser = useRecoilValue(userAtom)
  console.log(notification)
  return (
    <Flex my={"5px"} alignItems={"center"} padding={"3px"} >
      {!notification.seen &&
      <Box width={"8px"} h={"8px"} borderRadius={"50%"}  padding={"1px"} mx={"7px"} bg={"red.500"}></Box>}
      <Avatar src={notification.sender.profilePic} mx={"10px"} my={"10px"}/>
      {notification.type==="like" ? <Link to={`/${currentUser.username}/post/${notification.postId}`}>{notification.sender.username} liked your post</Link> : <Text>{notification.sender.username} reply on your post</Text>}
      <Box ml={"auto"} mr={"25px"}>
        <TiDelete size={"25"} />
      </Box>
    </Flex>
  )
}

export default NotificationItem