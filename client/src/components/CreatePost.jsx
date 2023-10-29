import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import {BsFillImageFill} from 'react-icons/bs'
import React, { useRef } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import usePreviewImg from '../hooks/usePreviewImg'
import { useState } from 'react'
import{useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [postText, setPostText] = useState("")
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom)
  const showToast = useShowToast();

  const handleTextChange = (e)=> {
    const inputText = e.target.value ; 
    if (inputText.length > MAX_CHAR ){
      const truncatedText = inputText.slice(0, MAX_CHAR) ; 
      setPostText(truncatedText);
      setRemainingChar(0)
    }else{
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length) ;

    }
  }

  const handleCreatePost =async () => {
    const res = await fetch('/api/posts/create', {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({postedBy: user._id, text: postText, image:imgUrl})
    })
    const data = await res.json() ; 

    if (data.error){
      showToast("Error", data.error, "error")
      return ;
    }
    showToast("Success", data.message, "success") 
    onClose();

  }

  return (
    <>
      <Button 
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder='post content goes here ...'
                onChange={handleTextChange}
                value={postText}
              />
              <Text fontSize="xs"
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{marginLeft:"5px", cursor:"pointer"}}
                size={16}
                onClick={()=> imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img"/>
                <CloseButton
                  onClick={()=>{
                    setImgUrl("")
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost