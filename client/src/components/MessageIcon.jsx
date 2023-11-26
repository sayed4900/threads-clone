import { Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { BsFillChatQuoteFill } from "react-icons/bs";
import NotificationItem from './NotificationItem';
import { Link } from 'react-router-dom';


const MessageIcon = ({ notifications, currentUser }) => {
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
      // document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    } else {
      // document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  useEffect(()=>{
    
    setSeenNotifications( notifications.reduce((count, notification) => {
      return notification.seen === false && notification.type === "message" && notification.sender._id != currentUser._id?
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
        {/* <Link to={'/chat'}> */}
        <BsFillChatQuoteFill size="20" />
        {/* </Link> */}
      </Box>
      {isOpen && (
        <>
        <Box
          width="370px"
          height="280px"
          borderRadius="md"
          bg="gray.700"
          position="absolute"
          top="40px"
          right="-15px"
          flexDirection="column"
          ref={notificationBoxRef}
          overflowY={"scroll"}
          
        >         
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const ids = [notification.sender, notification.recipient];
            
              // Filter out the current user's ID from the array
              const recipientId = ids.find(id => id?._id !== currentUser._id);
              
              if (recipientId) {
                // Here, recipientId will be the ID of the recipient
                return (
                  <NotificationItem
                    key={index}
                    notification={notification}
                    recipient={recipientId}
                    setIsOpen={setIsOpen}
                  />
                );
              }
            
              return null; // If recipientId is not found or matches currentUser, return null (skip rendering)
            })
          ) : (
            <Text textAlign="center" my="50px" color="white">
              No new notifications
            </Text>
          )}
        </Box>
        <Link to="/chat">
          <Box
            position="absolute"
            top="1400%"
            right="73px" 
            width="200px" 
            height="40px" 
            bg="gray.600" 
            borderRadius={"6px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={()=>console.log("clicked")}
          >
        
          See All Conversation
          </Box>
        </Link>
    </>
      )}
      
    </Box>
  );
};

export default MessageIcon;
