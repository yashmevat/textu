import React from 'react'
import "../../Style/UserBadge.css"
const UserBadge = ({ user, handleFunction }) => {
    return (
        <>
                <span class="badge text-bg-primary cursor-pointer m-1">{user.name}
                    <i class="fa-solid fa-xmark m-1 cursor-pointer" onClick={handleFunction}></i></span>
        </>

    )
}

export default UserBadge
