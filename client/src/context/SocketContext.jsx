import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import io from 'socket.io-client' ;
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import notificationAtom from "../atoms/notificationAtom";
import {messageNotificationAtom} from "../atoms/notificationAtom";


const SocketContext = createContext() ;

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({children}) =>{
  const [socket, setSocket] = useState(null) ;
  const user = useRecoilValue(userAtom);
  const [onlineUsers, setOnlineUsers] = useState([]) ;
  const [notifications, setNotifications] = useRecoilState(notificationAtom) ;
  const [messageNotifications, setMessageNotifications] = useRecoilState(messageNotificationAtom) ;

  const showToast = useShowToast() ;

  useEffect(()=>{
    const socket = io('http://localhost:5000',{
      query:{
        userId: user?._id
      }
    }) ;
    setSocket(socket)

    socket.on("getOnlineUsers",(users)=>{
      setOnlineUsers(users);
    })

    socket.on("newNotification",({notification,senderUser,})=>{
      notification.sender={} ;
      notification.sender.username= senderUser.username
      notification.sender.profilePic= senderUser.profilePic
      
      setNotifications((prev)=>[notification,...prev])
      
      console.log(notification.sender)
      
      if (senderUser._id !== user._id)
        showToast("Notification", "You have a new notification", "success")
    })
    
    socket.on("messageNotification",({notification, recipient, sender}) => {
      // 
      notification.recipient={} ; 
      notification.recipient.username = recipient.username ;
      notification.recipient.profilePic= recipient.profilePic ;
      
      notification.sender={} ; 
      notification.sender.username = sender.username ;
      notification.sender.profilePic= sender.profilePic ;
      
        setMessageNotifications((prevNots)=>prevNots.filter(n => n.conversationId !== notification.conversationId)) ; 

        setMessageNotifications((prevNots)=> [notification, ...prevNots])
      
    })
    

    return () => socket && socket.close();
  },[ user?._id])
  // console.log("online users ",onlineUsers)
  

  

  useEffect(()=>{
    if (!user) return ;
    const getNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications/`) ;
          const data = await res.json()
          console.log(data)
          if (data.error){
            showToast("Error", data.error, "error") ;
            return ;
          }
        setNotifications(data)
        console.log(data)
      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }
    const getMessageNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications/message-notification`) ;
          const data = await res.json()
          console.log(data)
          if (data.error){
            showToast("Error", data.error, "error") ;
            return ;
          }
        setMessageNotifications(data)
        console.log(data)
      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }
    getNotifications();
    getMessageNotifications();
  },[showToast, user])

  console.log(notifications)
  
  return(
    <SocketContext.Provider value={{socket, onlineUsers}}>
      {children}
    </SocketContext.Provider>
  )
}