
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import SideDrawer from '../mycomponents/miscellaneous/SideDrawer'
import MyChats from '../mycomponents/MyChats'
import ChatBox from '../mycomponents/ChatBox'

const ChatPage = () => {
  const [fetchAgain,setFetchAgain] = useState(false)
  const {user,selectedChat,chats} = ChatState()
  return (
    <>
      {user && <SideDrawer/>}
      <div className="container d-flex justify-content-between w-100">
        {user&& <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </div>
      </>
  )
}

export default ChatPage
