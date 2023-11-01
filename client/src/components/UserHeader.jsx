import { VStack, Box, Flex, Avatar,Link, Text, MenuButton, MenuItem, Portal, MenuList, Menu, Button } from '@chakra-ui/react'
import {BsInstagram} from 'react-icons/bs'
import {CgMoreO} from 'react-icons/cg'
import { Link as RouterLink } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import { useState } from 'react'
import useShowToast from "../hooks/useShowToast";


const UserHeader = ({user}) => {
  const toast = useToast()
  const currentUser = useRecoilValue(userAtom); // current loggined user
  const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))
  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  const copyURL = () =>{
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(()=>{
      toast({description:'Copied'})
    })
  }

  const handleFollowUnfollow = async () =>{
    if (!currentUser){
      showToast("Error", "Please login to follow", "error");
      return;
    }
    setUpdating(true);
    try{
      const res = await fetch(`/api/users/follow/${user._id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }
      });
      const data = await res.json(); 

      if (data.error){
        showToast("Error",data.error, "error") ;
        return; 
      }

      if (following){
        showToast("Success",`Unfollow ${user.name}`, "success")
        user.followers.pop();
      }else{
        showToast("Success",`Follow ${user.name}`, "success")
        user.followers.push(currentUser?._id)
      }
      

      setFollowing(!following);

      console.log(data);
    }catch(err){
      console.log(err);
    }finally{
      setUpdating(false)
    }
  }

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2x1"} fontWeight={'bold'}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text fontSize={"xs"}  bg={"#1E1E1E"} color={"#616161"} p={1}
              borderRadius={"full"}
            >threads.net</Text>
            
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (

            <Avatar
            name='Mark'
            src={user.profilePic}
            size={"xl"}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>
      {currentUser?._id === user._id &&(
        <Link as ={RouterLink} to='/update'>
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id &&(
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow": "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light "}>{user.followers.length} followers</Text>
          <Text bg={"gray.light"} w={"1"} h={"1"} borderRadius={"full"}></Text>
          <Link color={"gray.light"}>Instgram.com</Link>
        </Flex>
        <Flex>
          <Box className='icon-container'>
            <BsInstagram size={"24"} cursor={"pointer"}/>
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton> 
                <CgMoreO size={"24"} cursor={"pointer"}/>
              </MenuButton>
              <Portal>
              <MenuList bg={"gray.dark"}>
                <MenuItem bg={"gray.dark"} onClick={copyURL}>Link</MenuItem>
              </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"} >
        <Flex flex={1}  justifyContent={"center"} borderBottom={"1.5px solid white"} pb={3} cursor={'pointer'}>
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>
        <Flex flex={1}  justifyContent={"center"} borderBottom={"1px solid gray"} color={"gray.light"} pb={3} cursor={'pointer'}>

          <Text>Replies</Text>
        </Flex>
        
      </Flex>
    </VStack>
  )
}

export default UserHeader