import { Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { BsFillChatQuoteFill } from "react-icons/bs";
import NotificationItem from './NotificationItem';
import { Link } from 'react-router-dom';


const MessageIcon = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [seenNotifications, setSeenNotifications] = useState(0) ;

  const toggleBell = () => {
    setIsOpen(!isOpen);
  };

  const notificationBoxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (notificationBoxRef.current && !notificationBoxRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleEscKey = (event) => {
    if (event.keyCode === 27) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  useEffect(()=>{
    
    setSeenNotifications( notifications.reduce((count, notification) => {
      return notification.seen === false && notification.type === "message"?
      count+1 : count  ;
    }, 0))
  },[notifications])




  return (
    <Box onClick={toggleBell} position="relative" zIndex="100" cursor="pointer">
      {notifications.length > 0 && seenNotifications > 0 && (
        <Box
          position="absolute"
          top="-5px"
          right="-5px"
          bg="red"
          width="16px"
          height="16px"
          borderRadius="50%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="white" fontSize="10px" fontWeight="bold">
            {seenNotifications }
          </Text>
        </Box>
      )}
      <Box>
        <BsFillChatQuoteFill size="20" />
      </Box>
      {isOpen && (
        <>
        <Box
          width="370px"
          height="280px"
          borderRadius="sm"
          bg="gray.700"
          position="absolute"
          top="40px"
          right="-15px"
          flexDirection="column"
          ref={notificationBoxRef}
          overflowY={"scroll"}
        >
          {/* {notifications.length > 0 && <Text textAlign="center">Show All Notifications</Text  >} */}
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              notification.type==="message" && (<NotificationItem key={index} notification={notification} setIsOpen={setIsOpen} />)
            ))
          ) : (
            <Text textAlign="center" my="50px" color="white">
              No new notifications
            </Text>
          )}
        </Box>
        <Box
          position="absolute"
          top="1400%"
          right="73px" /* Adjust the right position as needed */
          width="200px" /* Adjust width as needed */
          height="40px" /* Adjust height as needed */
          bg="gray.600" /* Background color */
          borderRadius={"6px"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
      >
        <Link to="/chat">
          <Text>See All Conversation</Text>
        </Link>
      </Box>
    </>
      )}
      
    </Box>
  );
};

export default MessageIcon;
