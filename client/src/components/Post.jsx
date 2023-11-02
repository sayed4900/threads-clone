
import {Avatar, Box, Flex, Text, Image} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import {formatDistanceToNow} from 'date-fns'
import {DeleteIcon} from '@chakra-ui/icons'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

const Post = ({post, postedBy}) => {
  const showToast = useShowToast() ;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom) ;


  useEffect(()=>{
    const getUser = async() => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`) ;
        const data = await res.json() ;
        
        if (data.error){
          showToast("Error", data.error, "error") ;
          return ;
        }

        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error")
        setUser(null)
      }
    }
    getUser();
  },[postedBy, showToast])
  
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
    } catch (error) {
      console.log(error);
      showToast("Error", error.message, "error")
    }
  }

  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic}
            onClick={(e)=> {
              e.preventDefault();
              navigate(`/${user?.username}`)
            }}
          />
          <Box w={"1"} h={"full"} bg={"gray.light"} my={"2"}></Box>
          <Box position={"relative"} w={"full"} >
            {post.replies[0] && (
              <Avatar 
              size={"xs"}
              name={user?.name}
              src={post.replies[0].userProfilePic}
              position={"absolute"}
              top={"0px"}
              left={"15px"}
              padding={"2px"}
              />
              )}
            {post.replies[1] &&(
              <Avatar 
              size={"xs"}
              name='John'
              src={post.replies[1].userProfilePic}
              position={"absolute"}
              bottom={"0px"}
              right={"-5px"}
              padding={"2px"}
              />
            )}
            {post.replies[2] &&(
              <Avatar 
              size={"xs"}
              name='John'
              src={post.replies[2].userProfilePic}
              position={"absolute"}
              bottom={"0px"}
              left={"4px"}
              padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}
                onClick={(e)=> {
                  e.preventDefault();
                  navigate(`/${user?.username}`)
                }}
              >{user?.username}</Text>
              <Image src={"./verified.png"} w={'4'} h={'4'} ml={1}/>
            </Flex>
            <Flex gap={4} alignItems={'center'}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={'gray.light'}>
                {formatDistanceToNow(new Date(post.createdAt))} ago</Text>

                {currentUser?._id === postedBy && <DeleteIcon onClick={handleDeletePost}/>}
            </Flex>
          </Flex>
        
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && 
            <Box  borderRadius={6}
            overflow={'hidden'}
            border={"1px solid gray.light"}
            >
              <Image src={post.img} w={'full'}/>
            </Box>
          }
          <Flex gap={3} my={1}>
            <Actions post={post}/>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  )
}

export default Post