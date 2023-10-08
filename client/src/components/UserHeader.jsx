import { VStack, Box, Flex, Avatar, Text, MenuButton, MenuItem, Portal, MenuList, Menu } from '@chakra-ui/react'
import {BsInstagram} from 'react-icons/bs'
import {CgMoreO} from 'react-icons/cg'
import { Link } from 'react-router-dom'
const UserHeader = () => {
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2x1"} fontWeight={'bold'}>
            Mark Zuck
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>markzuck</Text>
            <Text fontSize={"xs"}  bg={"#1E1E1E"} color={"#616161"} p={1}
              borderRadius={"full"}
            >threads.net</Text>
            
          </Flex>
        </Box>
        <Box>
          <Avatar
            name='Mark'
            src='/zuck-avatar.png'
            size={"xl"}
          />
        </Box>
      </Flex>
      <Text>Co-founder</Text>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light "}>3.2k followers</Text>
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
                <MenuItem bg={"gray.dark"}>Link</MenuItem>
              </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader