
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import {  useRecoilState, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import userPreviewImg from '../hooks/userPreviewImg'


export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom)
  const [inputs, setInputs] = useState({
    name:user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePic:user.profilePic,
    password:""
  })
  const fileRef = useRef(null)

  const {handleImageChange, imgUrl} = userPreviewImg()

  console.log(user)
  return (
    <Flex
      align={'center'}
      justify={'center'}
      my={6}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl >
          {/* <FormLabel>User Icon</FormLabel> */}
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl   isRequired>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="Sayed Abdo"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={e => setInputs({...inputs, name:e.target.value})}
            value={user.name}
          />
        </FormControl>
        <FormControl   isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={e => setInputs({...inputs, username:e.target.value})}
            value={user.username}
          />
        </FormControl>
        <FormControl   isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            onChange={e => setInputs({...inputs, email:e.target.value})}
            value={user.email}
          />
        </FormControl>
        <FormControl   isRequired>
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Your bio."
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={e => setInputs({...inputs, bio:e.target.value})}
            value={user.bio}
          />
        </FormControl>
        <FormControl   isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"

          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}