import { Button, Toast } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import {FiLogOut} from 'react-icons/fi'

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast();

  const handleLogout = async () =>{
    try{
      

      const res = await fetch("/api/users/logout",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        }
      })
      const data = await res.json();
      console.log(data)
      if (data.error){
        showToast("Error",data.error,'error')
        return
      }

      localStorage.removeItem("user-threads");
      setUser(null);
    }catch(err){
      showToast("Error", err, 'error')

      console.log(err)
    }
  }
  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      <FiLogOut size={20}/>
    </Button>
  )
}

export default LogoutButton