import { useNavigate } from "react-router";
import "../Style/Login.css"
import React, { useState } from 'react'
import axios from "axios";
import { SERVER_URL } from "../config/ServerUrl";
import Toast from "./Toast";
import Spinner from "../mycomponents/Spinner"
const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!email.trim() || !password.trim()) {
      setToast({ message: "Both fields are required", type: "error" })
      setLoading(false)
      return
    }
    try {
      const config = {
        headers: {
          "content-type": "application/json"
        }
      }
      const { data } = await axios.post(`${SERVER_URL}/api/user/login`, {
        email, password
      }, config)
      setLoading(false)
      setToast({ message: "Login success", type: "success" })
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats")
    } catch (error) {
      setToast({ message: "some error occured", type: "error" })
      setLoading(false)
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
      <div className="form">
        <h1 id="heading">Textu Login</h1>
        <form onSubmit={handleSubmit} className='myform'>

          <div>
            <label htmlFor="email">Enter Email</label>
            <input type="text" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div>
            <label htmlFor="pass">Enter Password</label>
            <div className="password-container">
              <input
                type={show ? 'text' : 'password'}
                id="pass"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <i
                className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'} toggle-icon`}
                onClick={handleClick}
              ></i>
            </div>
          </div>

          <div>
            {loading && <Spinner />}
            <input type="submit" />
          </div>
        </form>

      </div>
    </>
  )
}

export default Login
