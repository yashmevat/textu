import React, { useState } from 'react'
import "../../Style/SideDrawer.css"
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router'
import Toast from '../Toast'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import Spinner from '../Spinner'
import { SERVER_URL } from '../../config/ServerUrl'
import { getSender } from '../../config/ChatLogics'


const SideDrawer = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const { user, setUser, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState()
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  const [toast, setToast] = useState(null)
  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    setToast({message:"loggedout Success",type:"success"})
    navigate("/")

  }

  const handleSearch = async () => {
    console.log("search", search)
    if (!search) {
      setToast({ message: "add something in search field", type: "error" })
      return
    }
    else {

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const { data } = await axios.get(`${SERVER_URL}/api/user?search=${search}`, config)
        setLoading(false)
        setSearchResult(data)
      } catch (error) {

        setToast({ message: "failed to load search results", type: "error" })
      }
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(`${SERVER_URL}/api/chat`, { userId }, config)
      if (!chats.find((c) => c._id === data._id)) {
        console.log(chats)
        setChats([data, ...chats])
      }
      setSelectedChat(data);
      setLoadingChat(false)
        setToast({ message: "Chat Created success", type: "success" })
    } catch (error) {

        setToast({ message: "unable to create chat ", type: "error" })
    }
  }
  return (
    <>
      {
        toast &&
        (<Toast message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)} />)
      }
      <div className="container main-div d-flex justify-content-between align-items-center bg-dark py-2 px-4">
        <button
          type="button"
          className="btn btn-light"
          data-bs-placement="top"
          title="Search user to chat"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
        >
          <i class="fa-solid fa-magnifying-glass my-2 mx-2"></i>
        </button>

        <h1 className="text-white fs-3 m-0">Textu</h1>

        <div className="menu d-flex justify-content-center align-items-center gap-3">

          <div className="dropdown position-relative">
            <button
              className="bg-transparent border-0 position-relative"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ outline: "none" }}
            >
              <i className="fa-solid fa-bell text-white fs-5"></i>

              {/* Notification badge */}
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                </span>
              )}
            </button>

            <ul
              className="dropdown-menu dropdown-menu-end p-2 shadow"
              aria-labelledby="dropdownMenuLink"
              style={{ width: "300px", maxHeight: "300px", overflowY: "auto" }}
            >
              {!notifications.length ? (
                <li>
                  <span className="dropdown-item text-muted">No New Notification</span>
                </li>
              ) : (
                notifications.map((notif) => (
                  <li key={notif._id}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotifications(notifications.filter((n) => n !== notif));
                      }}
                    >
                      {notif.chat.isgroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message From ${getSender(user, notif.chat.users)}`}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>



          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="profile-icon">
                <img src={user ? user.pic : ""} alt="" />
                <span>{user.name}</span>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  My Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={logoutHandler}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="drawer">
        <div
          className="offcanvas offcanvas-start"
          data-bs-scroll="true"
          data-bs-backdrop="false"
          tabIndex="-1"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasScrollingLabel">Search Users</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter user name"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              ))
            )}
            {
              loadingChat && <Spinner />
            }
          </div>
        </div>
      </div>


      <ProfileModal user={user} />
    </>
  )
}

export default SideDrawer
