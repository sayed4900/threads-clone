import { Flex } from '@chakra-ui/react'
import React from 'react'
import Notification from '../components/Notification'

const NotificationsPage = () => {
  return (
    <Flex direction={"column"}>
      <Notification/>
    </Flex>
  )
}

export default NotificationsPage