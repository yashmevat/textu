import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadge from './UserBadge'
import axios from 'axios'
import Spinner from '../Spinner'
import UserListItem from '../userAvatar/UserListItem'
import { SERVER_URL } from '../../config/ServerUrl'
import Toast from '../Toast'

const UpdateGroupChat = ({ fetchAgain, setFetchAgain ,fetchMessages}) => {
    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const { user, selectedChat, setSelectedChat } = ChatState()
    const handleRemove = async() => {
           try {
                setLoading(true)
                const config={
                    headers:{
                        Authorization:`Bearer ${user.token}`
                    }
                };

                const {data} = await axios.put(`${SERVER_URL}/api/chat/groupremove`, {
                    chatId:selectedChat._id,
                    userId:user1._id
                },config)
                user1._id===user._id ? setSelectedChat() : setSelectedChat(data)
                setFetchAgain(!fetchAgain)
                setLoading(false)
            } catch (error) {
                setToast({message:"unable to rename" ,type:"error"})
                setLoading(false)
            }

    }
    const handleRename = async() => {
            if(!groupChatName)
                 return

            try {
                setRenameLoading(true)
                const config={
                    headers:{
                        Authorization:`Bearer ${user.token}`
                    }
                };

                const {data} = await axios.put(`${SERVER_URL}/api/chat/rename`, {
                    chatId:selectedChat._id,
                    chatName:groupChatName
                },config)

                setSelectedChat(data)
                setFetchAgain(!fetchAgain)
                setRenameLoading(false)
                setGroupChatName("")
                setToast({message:"Renamed success" ,type:"success"})
            } catch (error) {
                setToast({message:"unable to rename" ,type:"error"})
                setRenameLoading(false)
            }
    }
    
    const handleDelete = async(user1) => {
 if(selectedChat.groupAdmin._id !==user._id && user1._id!==user._id){
            setToast({message:"admins can remove",type:"error"})
            return
         }
           try {
                setLoading(true)
                const config={
                    headers:{
                        Authorization:`Bearer ${user.token}`
                    }
                };

                const {data} = await axios.put(`${SERVER_URL}/api/chat/groupremove`, {
                    chatId:selectedChat._id,
                    userId:user1._id
                },config)
                user1._id===user._id ? setSelectedChat() : setSelectedChat(data)
                setFetchAgain(!fetchAgain)
                fetchMessages()
                setLoading(false)
                setToast({message:"Deleted success" ,type:"success"})
            } catch (error) {
                setToast({message:"unable to rename" ,type:"error"})
                setLoading(false)
            }

    }
    const handleSearch = async(query)=>{

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

    const handleAddUser = async(user1)=>{
       if(selectedChat.users.find((u)=>u._id===user1._id)){
        setToast({message:"user already there",type:"error"})
        return
       }
       try {
        setLoading(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
            const {data} = await axios.put(`${SERVER_URL}/api/chat/groupadd`,{
                chatId:selectedChat._id,
                userId:user1._id
            }, config)
           setSelectedChat(data)
           setFetchAgain(!fetchAgain)
           setLoading(false);
            setToast({ message: "Added succesfully", type: "success" })
       } catch (error) {
        
            setToast({ message: "adding unsuccesful", type: "error" })
            setLoading(false)
       }
       
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

            <div class="modal fade" id="updatemodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5 text-center" id="exampleModalLabel">{selectedChat.chatName}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                                <div class="mb-3">
                                    <label for="grpname" class="form-label">Rename</label>
                                    <input type="text" class="form-control" id="grpname" aria-describedby="emailHelp" onChange={(e)=>setGroupChatName(e.target.value)} placeholder="Rename Group"/>
                                    <button onClick={handleRename} data-bs-dismiss="modal" class="btn btn-primary my-2">rename</button>
                                </div>
                                <div class="mb-3">
                                    <label for="exampleInputPassword1" class="form-label" >Add User</label>
                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder='search for user' value={search} onChange={(e)=>handleSearch(e.target.value)}/>
                                </div>
                            {
                                selectedChat.users.map((u) => (
                                    <UserBadge key={u._id} user={u} handleFunction={()=>handleDelete(u)} />
                                ))
                            }
                                 <div class="mb-3">
                                    <button class="btn btn-danger my-2" data-bs-dismiss="modal" onClick={()=>handleDelete(user)}>Leave group</button>
                                </div>
                        </div>
                        {
                            loading?(
                                <Spinner/>
                            ):(
                                searchResult?.map((u)=>(
                                  <UserListItem
                                   key={u._id}
                                   user={u}
                                   handleFunction={()=>handleAddUser(u)}
                                  />

                                ))
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
        
        </>
    )
}

export default UpdateGroupChat
