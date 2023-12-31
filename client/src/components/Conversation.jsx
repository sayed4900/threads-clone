import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import {useRecoilState, useRecoilValue} from 'recoil';
import userAtom from '../atoms/userAtom'
import {BsCheck2All} from 'react-icons/bs'
import { selectedConversationAtom } from '../atoms/messagesAtom';


const Conversation = ({conversation, isOnline}) => {
  const user = conversation.participants[0] ; // recipent
  const lastMessage = conversation.lastMessage; // has inforamtion about sender
  const currentUser = useRecoilValue(userAtom)
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const colorMode = useColorMode() ;
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor:"pointer",
        bg:useColorModeValue("gray.600", "gray.dark"),
        color: "white"
      }}
      onClick={() => setSelectedConversation({
        _id:conversation._id,
        userId:user._id,
        userProfilePic:user.profilePic,
        username:user.username,
        mock: conversation.mock,
        unseenMessagesCount: user._id !=lastMessage.sender ? 0 : conversation.unseenMessagesCount
      }) }
      borderRadius={"md"}
      bg={selectedConversation._id === conversation._id ? 
        (colorMode==="light" ? "gray.600": "gray.500") : "" }
    >
      <WrapItem>
        <Avatar size={{
          base:"xs",
          sm:"sm",
          md:"md"
        }} src={user.profilePic}>
        {isOnline ? <AvatarBadge boxSize="1em" bg="green.500"/> : ""}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {user.username} <Image src="./verified.png" w={4} h={4} ml={1} />
        </Text>
        <Flex justifyContent={"space-between"}>
          <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {currentUser._id === lastMessage.sender ? 
              <Box color={lastMessage.seen? "blue.400" : ""}><BsCheck2All size={16}/></Box>:"" 
            }
            {lastMessage.text.length > 10 ? lastMessage.text.substring(0, 10)+"...": lastMessage.text}
          </Text>
          {conversation.unseenMessagesCount>0&&user._id ===lastMessage.sender&&

            <Box bg={"green.600"} width={"20px"} height={"20px"} borderRadius={"50%"}
              display={"flex"} justifyContent={"center"} alignItems={"center"}
              ml={"10px"} mr={"auto"}
            >
            
            <Text fontSize={"12px"} >{conversation.unseenMessagesCount}</Text>
          </Box>
          }
        </Flex>
      </Stack>
      
    </Flex>
  )
}

export default Conversation