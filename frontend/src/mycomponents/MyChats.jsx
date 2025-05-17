import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import Spinner from './Spinner'
import "../Style/MyChats.css"
import { getSender } from '../config/ChatLogics'
import GroupChatModal from './miscellaneous/GroupChatModal'
import axios from 'axios'
import { SERVER_URL } from '../config/ServerUrl'

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
  const [toast, setToast] = useState(null)

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`${SERVER_URL}/api/chat`, config)
      setChats(data)
    } catch (error) {
      setToast({ message: "Unable to fetch chats", type: "error" })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])

  // RESPONSIVE CLASSES
  const displayClass = selectedChat ? "d-none d-lg-flex" : "d-flex"

  return (
    <div className={`chats flex-column align-items-center my-3 h-100 ${displayClass}`} style={{ width: '100%', maxWidth: '350px' }}>
      <div className="chat-header w-100 d-flex justify-content-between align-items-center mb-2">
        <h2 className="fs-5 m-0">My Chats</h2>
        <button
          type="button"
          className="btn btn-dark btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal1"
        >
          Group+
        </button>
        <GroupChatModal />
      </div>

      <div className="main-chats d-flex flex-column align-items-center justify-content-start gap-2 w-100">
        {
          chats ? (
            chats.map((chat) => (
              <div
                className="card p-2 w-100"
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                style={{ cursor: "pointer" }}
              >
                <div className="chat-body text-center">
                  <p className="chat-name fw-semibold mb-0">
                    {!chat.isgroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <Spinner />
          )
        }
      </div>
    </div>
  )
}

export default MyChats
