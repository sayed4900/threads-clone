import { Box, Button, Flex, Image, Link, Text, useColorMode } from "@chakra-ui/react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import {AiFillHome} from 'react-icons/ai'
import {RxAvatar} from 'react-icons/rx'
import {Link as RouterLink} from 'react-router-dom'
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import {FaBell} from 'react-icons/fa' ;
import notificationAtom from '../atoms/notificationAtom';
import { useState } from "react";
import NotificationItem from "./NotificationItem";

const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout() ;
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const notifications = useRecoilValue(notificationAtom)

  const [isOpen, setIsOpen] = useState(false) ; 

  const toggleBell = () =>{
    setIsOpen(!isOpen)
  }
  
  
  return (
    <Flex justifyContent={"space-between"} mt={"6"} mb={"12"}>

      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={"24"}/>
        </Link>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={()=>setAuthScreen("login")}>
          Login
        </Link>
      )}
      <Image cursor={"pointer"} alt="logo"
        w={6} 
        src={colorMode==='dark' ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        
        <Flex alignItems={"center"} gap={4}>
              
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={"24"}/>
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={"20"}/>
          </Link>
          <Box onClick={toggleBell} position={"relative"} zIndex={"100"}>
            <FaBell size={"18"}/>
          {isOpen && 
          
            <Box width={"370px"} h={"270px"} borderRadius={"sm"}
              bg={"gray.700"} position={"absolute"} top={"40px"} right={"-15px"}
              flexDirection={"column"}
            >
              {notifications.length > 0 && <Text color={"black"} textAlign={"center"} > Show All Notifications</Text> }
              {notifications.length > 0 ? (
              notifications.slice(-3).reverse().map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
          ))
          ) : (
            <Text textAlign={"center"} my={"50px"}  color={"white"}>No new notifications</Text>
          )}
            </Box>
            
          }
          </Box>
          <Button
            onClick={logout}
            size={"xs"}
          >
            <FiLogOut size={20}/>
          </Button>
        </Flex>
        
      )}

      {!user && (
        <Link as={RouterLink}  to={"/auth"} onClick={()=>setAuthScreen("signup")}>
          Sign up
        </Link>
      )}
    </Flex>
  )
}

export default Header