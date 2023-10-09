import { Avatar, Flex, Text, Image, Box, Divider, Button} from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react"
import Comment from "../components/Comment"

const PostPage = () => {
  const [liked, setLiked] = useState(false)
  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark"/>
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>markzuck</Text>
            <Image src="/verified.png" w={4} h={4} ml={4}/>
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={4}>
          <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
          <BsThreeDots/>
        </Flex>
      </Flex>
      <Text my={3}>Let&apos;s talk about threads</Text>
      <Box  borderRadius={6}
            overflow={'hidden'}
            border={"1px solid gray.light"}
            >
            <Image src={'/post1.png'} w={'full'}/>
      </Box>
      <Flex gap={3}>
        <Actions liked={liked} setLiked={setLiked}/>
      </Flex>

      <Flex gap={2} alignItems={'center'}>
        <Text color={"gray.light"} fontSize={"sm"}>238 Replies</Text>
        <Box w={.5} h={.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>{200 + (liked ? 1 : 0)} Likes</Text>
      </Flex>
      <Divider my={4}/>

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋🏽</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4}/>
      <Comment
        comment="Looks realy good"
        createdAt="2d"
        likes={100}
        username={"John"}
        userAvatar="https://bit.ly/dan-abramov"
      />  
    </>
  )
}

export default PostPage