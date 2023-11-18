import { Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import NotificationItem from './NotificationItem';

const NotificationBell = ({ notifications }) => {
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
      return notification.seen ? count : count + 1;
    }, 0)
    )
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
        <FaBell size="18" />
      </Box>
      {isOpen && (
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
              <NotificationItem key={index} notification={notification} setIsOpen={setIsOpen} />
            ))
          ) : (
            <Text textAlign="center" my="50px" color="white">
              No new notifications
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationBell;
