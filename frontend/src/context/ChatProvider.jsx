import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

const ChatContext = createContext()
const ChatProvider = ({children}) => {
    
   const [user, setUser] = useState();
   const [selectedChat,setSelectedChat] =useState()
   const [chats,setChats] =useState([])
   const [notifications,setNotifications] = useState([])
   const navigate = useNavigate()
   useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) 
        navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  return (
    <ChatContext.Provider value={{user,setUser,setSelectedChat,selectedChat,chats,setChats,notifications,setNotifications}}>
        {children}
    </ChatContext.Provider>
  )
};
export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider
