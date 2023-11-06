
import {Container} from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage" //////////////////
import PostPage from "./pages/PostPage"
import HomePage from "./pages/HomePage"
import Header from "./components/Header"
import AuthPage  from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import CreatePost from "./components/CreatePost"
import UpdateProfilePage from "./pages/UpdateProfilePage"


function App() {
  const user = useRecoilValue(userAtom);
  
  return (
    <Container maxW="620">
      <Header/>
      <Routes>
        <Route path="/" element={user ? <HomePage/> :<Navigate to="/auth"/> }/>
        <Route path="/auth" element={!user ? <AuthPage/>: <Navigate to="/"/> }/>
        <Route path="/update" element={user ? <UpdateProfilePage/>: <Navigate to="/auth"/> }/>

        <Route path="/:username" element=
        {
          <>
          {user ? (
            <>
              <UserPage />
              <CreatePost/>
            </>
          ) : (
            <UserPage/>
          )
          
          }
          </>
        }/>
        <Route path="/:username/post/:pid" element={<PostPage />}/>
      </Routes>

    
    
    </Container>
  )
}

export default App
