import axios from 'axios'
import React, { useState } from 'react'
import Spinner from '../Spinner'
import UserListItem from '../userAvatar/UserListItem'
import { ChatState } from '../../context/ChatProvider'
import UserBadge from './UserBadge'
import { SERVER_URL } from '../../config/ServerUrl'
import Toast from '../Toast'

const GroupChatModal = () => {
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchReasult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)

    const { user, chats, setChats } = ChatState();
    // const [search,setSearch] = useState()
    const handleSearch = async (query) => {
        setSearch(query)
        console.log(search)
        console.log("handlesearch")
        if (!query) {
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${SERVER_URL}/api/user/?search=${query}`, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            setToast({ message: "search unsuccesful", type: "error" })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("submit")
        if (!groupChatName || !selectedUsers) {
            setToast({ message: "all fields are required", type: "error" })
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${SERVER_URL}/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            setSearch("");
            setSelectedUsers([])
            setGroupChatName("")
            setToast({ message: "group created successfully", type: "success" })
        } catch (error) {

            setToast({ message: "group not created", type: "error" })
        }
    };



    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id))
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            setToast({ messsage: "user already there", type: "error" })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }
    return (
<>
        {
        toast && 
         ( <div><Toast message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)} />
            </div>)
      }
        <div>
            <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Create a group chat</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div class="mb-3">
                                    <label for="chatname" class="form-label">Chat Name</label>
                                    <input type="text" class="form-control" id="chatname" aria-describedby="emailHelp" placeholder='Enter Chat Name'
                                        value={groupChatName || ""}
                                        onChange={(e) => setGroupChatName(e.target.value)} />
                                </div>
                                <div class="mb-3">
                                    <label for="addusers" class="form-label">Add users</label>
                                    <input type="text" class="form-control" id="addusers" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder='Add Users e.g yash ravi raju' />
                                </div>
                                  <div className="mb-3">
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
                            <button type="button" class="btn btn-danger mx-2" data-bs-dismiss="modal">Close</button>
                        </div>
                            </form>
                             {
                            selectedUsers.map((u) => (

                                <UserBadge key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))
                        }
                        <div className="mb-2">
                            {
                                loading ? <Spinner /> :
                                    (searchReasult?.slice(0, 4).map((user) => (
                                        <UserListItem key={user._id}
                                            user={user}
                                            handleFunction={() => handleGroup(user)} />

                                    )))

                            }
                        </div>
                        </div>
                      
                       
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default GroupChatModal
