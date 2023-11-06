import { Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [loading, setLoading] = useState(true)
  const showToast = useShowToast(); 
  useEffect(()=>{
    const getFeedPosts = async()=>{
      setLoading(true)
      try {
        const res = await fetch('/api/posts/feed') ;
        const data = await res.json() ; 
        // console.log(data)
        setPosts(data)
        
        if (data.error){
          showToast('Error', data.error, 'error')
          return ;
        }

      } catch (error) {
        showToast('Error',error.message, 'error')
      }finally{
        setLoading(false)
      }
    }
    getFeedPosts();
  },[showToast, setPosts])
  return (
    <>
      {loading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"}/>
        </Flex>
      )}
      {!loading && posts.length === 0 && <h1>Follow some users to see feed</h1>}

      {posts.map((post)=>(
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default HomePage