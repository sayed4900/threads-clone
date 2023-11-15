import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import io from 'socket.io-client' ;
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import notificationAtom from "../atoms/notificationAtom";


const SocketContext = createContext() ;

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({children}) =>{
  const [socket, setSocket] = useState(null) ;
  const user = useRecoilValue(userAtom);
  const [onlineUsers, setOnlineUsers] = useState([]) ;
  const [notifications, setNotifications] = useRecoilState(notificationAtom) ;

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

    socket.on("newNotification",(notification)=>{
      setNotifications((prev)=>[...prev, notification])
      console.log(notification.sender)
      if (notification.sender !== user._id)
        showToast("Notification", "new notification", "success")
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
    getNotifications();
  },[showToast, user])


  
  return(
    <SocketContext.Provider value={{socket, onlineUsers}}>
      {children}
    </SocketContext.Provider>
  )
}