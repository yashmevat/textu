import React from 'react'
import Signup from "../mycomponents/Signup"
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat'
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState
  return (
    <div className='w-75'>
       <div className="d-md-flex">
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
       </div>
    </div>
  )
}

export default ChatBox

