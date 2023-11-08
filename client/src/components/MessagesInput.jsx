import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import {IoSendSharp} from 'react-icons/io5'

const MessagesInput = () => {
  return (
    <form >
      <InputGroup >
        <Input w={"full"} placeholder='Type a message' />
        <InputRightElement>
          <IoSendSharp cursor={"pointer"} />
        </InputRightElement>
      </InputGroup>
    </form>
  )
}

export default MessagesInput