import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, RouterProvider } from 'react-router'; // ✅ correct package
import ChatProvider from './context/ChatProvider.jsx';


createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
</BrowserRouter>
)
