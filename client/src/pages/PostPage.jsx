import { Avatar, Flex, Text, Image, Box, Divider, Button, Spinner} from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useEffect, useState } from "react"
import Comment from "../components/Comment"
import useGetUserProfile from "../hooks/useGetUserProfile"
import { useNavigate, useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { formatDistanceToNow } from "date-fns"
import { DeleteIcon } from "@chakra-ui/icons"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"

const PostPage = () => {
  const {user, loading} = useGetUserProfile() ;
  const [post, setPost] = useState(null)
  const {pid} = useParams() ;
  const {currentUser} = useRecoilValue(userAtom)
  const showToast = useShowToast() ;
  const navigate = useNavigate() ;

  useEffect(()=>{
    const getPost = async ()=>{
      try {
        const res = await fetch(`/api/posts/${pid}`)
        const data = await res.json() ; 
        setPost(data)
        console.log(data) ; 
        if (data.error){
          showToast("Error", data.message, "error")
          return ; 
        }
      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }
    getPost()
  },[pid,showToast])

  const handleDeletePost = async(e) => {
    try {
      e.preventDefault(); 
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      
      const res =  await fetch(`/api/posts/delete/${post._id}`,{
        method:"DELETE",
      });
      const data = await res.json() ;
      
      if (data.error){
        showToast("Error", data.error, "error") ;
        return ;
      }
      showToast("Success","Post has been deleted", "success")
      navigate(`/${user.username}`) ;
    } catch (error) {
      console.log(error);
      showToast("Error", error.message, "error")
    }
  }

  if (!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }
  if (!post)
    return null ;

  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic}/>

          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={4}/>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={'gray.light'}>
            {formatDistanceToNow(new Date(post.createdAt))} ago</Text>

          {currentUser?._id === user._id && <DeleteIcon onClick={handleDeletePost}/>}
        </Flex>
      </Flex>
      <Text my={3}>{post.text}</Text>
      { post.img &&(
        <Box  borderRadius={6}
        overflow={'hidden'}
        border={"1px solid gray.light"}
        >
          <Image src={`${post.img}`} w={'full'}/>
        </Box>
      )}
      <Flex gap={3}>
        <Actions post={post} />
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
      
      {post.replies.map((replay)=>(
        <Comment key={replay._id}
          username={replay.username}
          // likes={replay.}
          comment={replay.text}
          // createdAt={replay.}
          userAvatar={replay.userProfilePic}
        />
      ))}
      
    </>
  )
}

export default PostPage