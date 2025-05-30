
import React, { useState } from 'react'
import Toast from './Toast';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { SERVER_URL } from '../config/ServerUrl';
import Spinner from './Spinner';

const Signup = () => {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const [show, setShow] = useState(false);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const handleClick = () => setShow(!show);
  const handleConfirmClick = () => setShowConfirm(!showConfirm);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(toast)
    if(!name || !email || !password ||!confirmpassword){
      setToast({ message: "fill up all fields", type: "error" })
      return   
    }
    if(password !== confirmpassword){
      
      setToast({ message: "password and confirm password must be same", type: "error" })
      return;
    }
    try {
      setLoading(true)
      const config = {
        headers :{
          "content-type": "application/json"
        }
      }
      const {data} = await axios.post(`${SERVER_URL}/api/user`,{
        name,email,password,pic
      },config)
      if(data){
        setLoading(false)
        setToast({message:"Registration success",type:"success"})
        localStorage.setItem("userInfo",JSON.stringify(data));
        navigate("/chats")
      }else{
        
        setLoading(false)
        navigate("/signup")
      }
    } catch (error) {
      setToast({message :"some error occured",type:"error"})
        setLoading(false)
    }
  
  }
  const postDetails = async (pics) => {
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dpbkgo4b7/image/upload`
    setPicLoading(true)
    if (pics === undefined) {
      console.log(toast)
      setToast({ message: "please select an image", type: "warning" })
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics)
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dpbkgo4b7")
      try {
        const res = await fetch(CLOUDINARY_URL, {
          method: "post",
          body: data
        })
        const json = await res.json();
        console.log(json)
        setPic(json.url.toString())
        setPicLoading(false)
        setToast({ message: "image uploaded success", type: "success" })

      } catch (error) {
        console.log(err)
        setPicLoading(false)

      }
    }
    else {
      setToast({ message: "please select an image", type: "warning" })
      setPicLoading(false)
      return;
    }
  }
  return (
    <>
     {
        toast && 
         ( <Toast message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)} />)
      }
      <div className="form">
        <h1 id="heading">Textu Signup</h1>
        <form onSubmit={handleSubmit} className='myform'>
          <div>
            <label htmlFor="name">Enter Name</label>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} value={name} />
          </div>
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
            <label htmlFor="cpass">Confirm Password</label>
            <div className="password-container">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="cpass"
                onChange={(e) => setConfirmpassword(e.target.value)}
                value={confirmpassword}
              />
              <i
                className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} toggle-icon`}
                onClick={handleConfirmClick}
              ></i>
            </div>
          </div>

          
          <div>
            <label htmlFor="pic">Upload Image</label>
            <input type="file" p={.5} accept="image/*" id="pic" onChange={(e) => postDetails(e.target.files[0])} />
            <span>{picLoading&&(<><p>uploading...</p><Spinner/></>)}</span>
          </div>
          <div>
            {
              loading&&<Spinner/>
            }
            {
              picLoading?
                <input type="submit" disabled /> :
                <input type="submit" />
            }
          </div>
        </form>

      </div>
    </>

  )
}

export default Signup
