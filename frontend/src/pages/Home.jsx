import React, { useContext, useEffect } from 'react'
import "../Style/Home.css"
import { useState } from "react"
import Login from '../mycomponents/Login';
import Signup from '../mycomponents/Signup';
import { NavLink, useNavigate } from 'react-router';
import NavBar from '../mycomponents/NavBar';
import { ChatState } from '../context/ChatProvider';
const Home = () => {
  const {user,setUser} = ChatState()
  
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
     useEffect(()=>{
          const userInfo = JSON.parse(localStorage.getItem("userInfo"))
          setUser(userInfo)
  
          if(userInfo){
               navigate("/chats")
          }
      },[navigate])
  const [value, setValue] = useState("first")
  return (
         <>
         <div className="toggle-auth">
        <button onClick={() => setShowSignup(false)}>Login</button>
        <button onClick={() => setShowSignup(true)}>Sign Up</button>
      </div>
      {showSignup ? <Signup /> : <Login />}
         </>
  )
}

export default Home
