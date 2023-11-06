import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
import { Link } from 'react-router-dom'; // Import Link from React Router

import useShowToast from '../hooks/useShowToast'

const Comment = ({username,  comment, userAvatar}) => {
  const showToast = useShowToast()
  
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Link to={`/${username}`}>
          <Avatar src={userAvatar} size={'sm'} />
        </Link>
        <Flex gap={1} w={"full"} flexDirection={"column"} >
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={'bold'}>{username}</Text>
            {/* <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>{createdAt}</Text>
              <BsThreeDots />
            </Flex> */}
          </Flex>
          <Text>{comment}</Text>
          {/* <Actions liked={liked} setLiked={setLiked}/> */}
          
        </Flex>
      </Flex>
      <Divider my={4}/>
    </>
  )
}

export default Comment