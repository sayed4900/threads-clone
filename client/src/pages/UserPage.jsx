import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";


const UserPage = () => {

  const [user, setUser] = useState(null);
  const {username} = useParams();

  const showToast = useShowToast();

  useEffect(()=>{
    const getUser = async() => {
      try{
        const res = await fetch(`/api/users/profile/${username}`) ;
        const data = await res.json() ; 
        console.log(data)
        
        if (data.error){
          showToast("Error",data.error,"error");
          return ;
        }
        setUser(data);
      }catch(err){
        showToast("Error",err,"error")
      }
    }

    getUser()
  },[username, showToast])

  if(!user)
    return null ;

  return (

    <>
      <UserHeader user={user}/>
      <UserPost likes={1200} replies={455} postImg={"/post1.png"} postTitle="Let's talk about threads."/>
      <UserPost likes={123} replies={123} postImg={"/post2.png"} postTitle="Nice tutorial."/>
      <UserPost likes={546} replies={250} postImg={"/post3.png"} postTitle="I love this guy"/>
      <UserPost likes={1500} replies={357}  postTitle="This in my first thread"/>
    </>
  )
}

export default UserPage