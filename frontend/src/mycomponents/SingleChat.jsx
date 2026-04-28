import React, { useState, useEffect, useRef } from 'react';
import '../Style/ChatMessage.css';
import { useMediaQuery } from 'react-responsive';
import { FaPaperclip, FaCamera } from 'react-icons/fa';
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
    const [messageLoading, setMessageLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    // Camera modal logic (desktop only)
    useEffect(() => {
        let stream;
        if (showCamera && !isMobile && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(s => {
                    stream = s;
                    videoRef.current.srcObject = stream;
                });
        }
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [showCamera, isMobile]);

    const handleOpenCamera = () => {
        if (isMobile) {
            document.getElementById('camera-upload').click();
        } else {
            setShowCamera(true);
        }
    };

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (blob) handleFileUpload(new File([blob], 'captured.jpg', { type: 'image/jpeg' }), 'image');
            }, 'image/jpeg');
            setShowCamera(false);
        }
    };

    // Cloudinary config (same as Signup)
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dpbkgo4b7/auto/upload`;
    const UPLOAD_PRESET = 'chat-app';

    // Handle document/image upload
    const handleFileUpload = async (file, type = 'auto') => {
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', UPLOAD_PRESET);
        data.append('cloud_name', 'dpbkgo4b7');
        try {
            const res = await fetch(CLOUDINARY_URL, {
                method: 'post',
                body: data
            });
            const json = await res.json();
            setUploading(false);
            if (json.url) {
                await sendFileMessage(json.url, file.name, type);
            }
        } catch (err) {
            setUploading(false);
            alert('Upload failed!');
        }
    };

    // Send file message
    const sendFileMessage = async (fileUrl, fileName, fileType) => {
        setMessageLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        try {
            const { data } = await axios.post(
                `${SERVER_URL}/api/message`,
                {
                    content: '',
                    chatId: selectedChat._id,
                    file: fileUrl,
                    fileName,
                    fileType,
                },
                config
            );
            setMessages([...messages, data]);
            setMessageLoading(false);
            socket.emit('new-message', data);
        } catch (error) {
            setMessageLoading(false);
            alert('Unable to send file');
        }
    };

    useEffect(() => {
        if (!user) return;

        socket = io(SERVER_URL, {
            withCredentials: true,
            transports: ["websocket"],
        });
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

    useEffect(() => {
        if (!socket) return;

        socket.on("message-recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare.current ||
                selectedChatCompare.current._id !== newMessageRecieved.chat._id
            ) {
                if (!notifications.includes(newMessageRecieved)) {
                    setNotifications([newMessageRecieved, ...notifications]);
                    setFetchAgain(!fetchAgain);
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
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        console.log("clicked", e.key, newMessage);
        let newm = newMessage;
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
                setMessageLoading(false);
                socket.emit("new-message", data);
            } catch (error) {
                console.error("Unable to send message:", error);
                setMessageLoading(false);
            }
        }
    };

    const sendMessageClick = async () => {
        setMessageLoading(true);
        try {
            let newm = newMessage;
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
            setMessageLoading(false);
            socket.emit("new-message", data);
        } catch (error) {
            console.error("Unable to send message:", error);
            setMessageLoading(false);
        }
    };

    return (
        <>
            {selectedChat ? (
                <div className="container-fluid">
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
                                                className={`chat-message-container mb-1 p-1 rounded ${msg.sender._id === user._id ? 'bg-success text-white align-self-end' : 'bg-light text-black align-self-start'}`}
                                                style={{ maxWidth: '75%' }}
                                            >
                                                <div className="small fw-bold">{msg.sender.name}</div>
                                                {/* File/Image Preview WhatsApp style */}
                                                {msg.file ? (
                                                    msg.fileType === 'image' ? (
                                                        <div style={{ margin: '8px 0' }}>
                                                            <img src={msg.file} alt={msg.fileName || 'image'} style={{ maxWidth: '180px', maxHeight: '220px', borderRadius: '10px', boxShadow: '0 2px 8px #0001' }} />
                                                            {msg.fileName && <div className="small text-muted mt-1">{msg.fileName}</div>}
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f1f1', borderRadius: '8px', padding: '10px', margin: '8px 0', boxShadow: '0 2px 8px #0001' }}>
                                                            <div style={{ fontSize: 32, color: '#6c63ff', marginRight: 12 }}>
                                                                <FaPaperclip />
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontWeight: 500, fontSize: 15, color: '#333' }}>{msg.fileName || 'Document'}</div>
                                                                <a href={msg.file} download={msg.fileName} target="_blank" rel="noopener noreferrer" style={{ color: '#6c63ff', fontSize: 13, textDecoration: 'underline' }}>Download</a>
                                                            </div>
                                                        </div>
                                                    )
                                                ) : null}
                                                {/* Show text content if present */}
                                                {msg.content && <div>{msg.content}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3 mt-2 d-flex gap-2 align-items-center">
                                {/* Document upload */}
                                <label htmlFor="doc-upload" className="btn btn-outline-secondary btn-sm mb-0" title="Send Document">
                                    <FaPaperclip size={18} />
                                </label>
                                <input
                                    id="doc-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.csv,.mp3,.mp4,.avi,.mkv,.json,.xml,.html,.js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"
                                    style={{ display: 'none' }}
                                    onChange={e => {
                                        if (e.target.files[0]) handleFileUpload(e.target.files[0], 'document');
                                        e.target.value = '';
                                    }}
                                />
                                {/* Camera upload */}
                                <button type="button" className="btn btn-outline-secondary btn-sm mb-0" title="Send Image" onClick={handleOpenCamera}>
                                    <FaCamera size={18} />
                                </button>
                                {/* Hidden file input for mobile */}
                                <input
                                    id="camera-upload"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    style={{ display: 'none' }}
                                    onChange={e => {
                                        if (e.target.files[0]) handleFileUpload(e.target.files[0], 'image');
                                        e.target.value = '';
                                    }}
                                />
                                            {/* Camera Modal for desktop */}
                                            {showCamera && !isMobile && (
                                                <div style={{
                                                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px #0004', position: 'relative' }}>
                                                        <video ref={videoRef} autoPlay style={{ width: 320, height: 240, borderRadius: 8, background: '#222' }} />
                                                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                                                        <div className="d-flex justify-content-between mt-3">
                                                            <button className="btn btn-success me-2" onClick={handleCapture}>Capture</button>
                                                            <button className="btn btn-danger" onClick={() => setShowCamera(false)}>Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                    onChange={e => setNewMessage(e.target.value)}
                                    value={newMessage}
                                    disabled={uploading}
                                />
                                {(messageLoading || uploading) ? (
                                    <Spinner />
                                ) : (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={sendMessageClick}
                                        disabled={messageLoading || !newMessage.trim()}
                                    >
                                        Send
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="d-flex flex-column justify-content-center align-items-center text-center w-100"
                    style={{
                        minHeight: "400px",
                        padding: "1rem",
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
