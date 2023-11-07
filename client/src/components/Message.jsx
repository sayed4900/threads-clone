import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Message = ({ownMessage}) => {
  return (
    <>
    {ownMessage ? (
      
      <Flex
        gap={2}
        alignSelf={"flex-end"}
      >
        <Text maxW={"350px"} bg={"blue.400"}
          p={1} borderRadius={"md"}
        >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum culpa perferendis quidem? Adipisci soluta cupiditate maiores, distinctio reiciendis magnam suscipit repellat expedita quisquam </Text>
        <Avatar src='' w="7" h="\" />
      </Flex>
    ):(
      <Flex
        gap={2}
        
      >
        <Avatar src='' w="7" h="\" />
        <Text maxW={"350px"} bg={"gray.400"} color={"black"}
          p={1} borderRadius={"md"}
        >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum culpa perferendis quidem? Adipisci soluta cupiditate maiores, distinctio reiciendis magnam suscipit repellat  </Text>
        
      </Flex>
    )}
    </>
  )
}

export default Message