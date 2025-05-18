import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import "../../Style/UserListItem.css"
const UserListItem = ({ user, handleFunction }) => {
  return (
    <div onClick={handleFunction} className='list' data-bs-dismiss="offcanvas">
      <div className="card user-card">
        <img src={user ? user.pic : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} className="card-img-top profile-img" alt="Profile" />
        <div className="card-body">
          <p className="card-text">{user ? user.email : ""}</p>
        </div>
      </div>
    </div>
  )
}

export default UserListItem
