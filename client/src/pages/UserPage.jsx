import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"


const UserPage = () => {
  return (
    <>
      <UserHeader/>
      <UserPost likes={1200} replies={455} postImg={"/post1.png"} postTitle="Let's talk about threads."/>
      <UserPost likes={123} replies={123} postImg={"/post2.png"} postTitle="Nice tutorial."/>
      <UserPost likes={546} replies={250} postImg={"/post3.png"} postTitle="I love this guy"/>
      <UserPost likes={1500} replies={357}  postTitle="This in my first thread"/>
    </>
  )
}

export default UserPage