import React, { useState, useEffect, useRef } from 'react';
import { ChatState } from '../context/ChatProvider';
import { getSender, getFull } from '../config/ChatLogics';
import MyProfileModal from './MyProfileModal';
import UpdateGroupChat from './miscellaneous/UpdateGroupChat';
import Spinner from './Spinner';
import axios from 'axios';
import io from 'socket.io-client';
import { SERVER_URL } from '../config/ServerUrl';
var socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const selectedChatCompare = useRef();
    const [messageLoading, setMessageLoading] = useState(false)

    useEffect(() => {
        if (!user) return;

        socket = io(SERVER_URL, {
            withCredentials: true,
            transports: ["websocket"], // force WebSocket transport
        });;
        socket.emit("setup", user);

        socket.on("connected", () => {
            console.log("Socket connected");
            setSocketConnected(true);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare.current = selectedChat;
    }, [selectedChat]);
    // console.log(notifications, ".......")
    useEffect(() => {
        if (!socket) return;

        socket.on("message-recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare.current ||
                selectedChatCompare.current._id !== newMessageRecieved.chat._id
            ) {
                if (!notifications.includes(newMessageRecieved)) {
                    setNotifications([newMessageRecieved, ...notifications])
                    setFetchAgain(!fetchAgain)
                }

            } else {
                setMessages(prev => [...prev, newMessageRecieved]);
            }
        });

        return () => {
            socket.off("message-recieved");
        };
    });

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);
            const { data } = await axios.get(`${SERVER_URL}/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socket.emit("join-chat", selectedChat._id);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const sendMessage = async (e) => {
        console.log("clicked", e.key, newMessage)
        let newm = newMessage
        if (e.key === "Enter" && newm) {
            try {
                setMessageLoading(true);
                setNewMessage("");
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                
                const { data } = await axios.post(
                    `${SERVER_URL}/api/message`,
                    {
                        content: newm,
                        chatId: selectedChat._id,
                    },
                    config
                );
                
                setMessages([...messages, data]);
                setMessageLoading(false)
                socket.emit("new-message", data);
            } catch (error) {
                console.error("Unable to send message:", error);
                setMessageLoading(false)
            }
        }
    };
    const sendMessageClick = async () => {
        
        setMessageLoading(true);
        try {
            let newm = newMessage
            setNewMessage("")
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                `${SERVER_URL}/api/message`,
                {
                    content: newm,
                    chatId: selectedChat._id,
                },
                config
            );
       
            setNewMessage("");
            setMessages([...messages, data]);
            setMessageLoading(false)
            socket.emit("new-message", data);
        } catch (error) {

            console.error("Unable to send message:", error);
            setMessageLoading(false)
        }
    }

    return (
        <>
            {selectedChat ? (
                <div className="container-fluid px-3 py-2">
                    {/* Header: Back button, chat title, and actions */}
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        {/* Back button for small screens */}
                        <button
                            className="btn btn-dark d-lg-none"
                            onClick={() => setSelectedChat('')}
                        >
                            ← Back
                        </button>

                        {/* Chat Title and Actions */}
                        <div className="flex-grow-1 text-center">
                            {!selectedChat.isgroupChat ? (
                                <>
                                    <h4 className="mb-1">
                                        {getSender(user, selectedChat.users)}
                                    </h4>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#mypmodal"
                                    >
                                        View Profile
                                    </button>
                                    <MyProfileModal user={getFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    <h4 className="mb-1 text-uppercase">
                                        {selectedChat.chatName}
                                    </h4>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#updatemodal"
                                    >
                                        Manage Group
                                    </button>
                                    <UpdateGroupChat
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-wrapper border" style={{ height: '78vh' }}>
                        <div className="chat-content d-flex flex-column h-100 px-2">
                            <div className="messages flex-grow-1 overflow-auto">
                                {loading ? <Spinner /> : (
                                    <div className="d-flex flex-column">
                                        {messages.map(msg => (
                                            <div
                                                key={msg._id}
                                                className={`mb-1 p-1 rounded ${msg.sender._id === user._id ? 'bg-success text-white align-self-end' : 'bg-light text-black align-self-start'}`}
                                                style={{ maxWidth: '100%' }}
                                            >
                                                <div className="small fw-bold">{msg.sender.name}</div>
                                                <div>{msg.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3 mt-2 d-flex justify-content-between">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message..."
                                    style={{
                                        borderRadius: '20px',
                                        padding: '10px 15px',
                                        border: '1px solid #ccc',
                                        fontSize: '14px'
                                    }}
                                    onKeyDown={sendMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    value={newMessage}
                                />
                                {messageLoading?(<Spinner/>):(<button className="btn btn-success btn-sm py-0" onClick={sendMessageClick}
                                    disabled={messageLoading}>send</button>)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (

                <div
                    className="d-flex flex-column justify-content-center align-items-center text-center w-100 h-100"
                    style={{
                        minHeight: "100vh", // adjust based on your layout
                        padding: "1rem",// optional background
                        borderRadius: "10px"
                    }}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2950/2950652.png"
                        alt="Start Chat"
                        style={{ width: "80px", marginBottom: "15px", opacity: 0.8 }}
                    />
                    <h5 className="text-secondary mb-2 fw-semibold">No Chat Selected</h5>
                    <p className="text-muted" style={{ maxWidth: "400px", fontSize: "1rem" }}>
                        Click on a user to open the conversation.
                    </p>
                </div>


            )}
        </>
    );
};

export default SingleChat;
