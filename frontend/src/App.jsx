
import './App.css'
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router";
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Signup from './mycomponents/Signup';
import NavBar from './mycomponents/NavBar';
import { Route, Routes } from 'react-router';

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <div>
//       <NavBar />
//       <Home />
//     </div>,
//   },{
//     path: "/chats",
//     element: <div>

//       <NavBar />
//       <ChatPage />
//     </div>,
//   },
//   {
//     path: "/signup",
//     element: <div>

//       <NavBar />
//       <Signup />
//     </div>,
//   },
// ]);


function App() {

  return (
    <>
      <div className="App">
         <Routes>
        <Route path="/" element={<><Home /></>} exact/>
        <Route path="/chats" element={<><ChatPage /></>} exact/>
        <Route path="/signup" element={<><Signup /></>} exact/>
      </Routes>
      </div>
    </>
  )
}
export default App
