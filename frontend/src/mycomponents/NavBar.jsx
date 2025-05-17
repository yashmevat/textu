import React from 'react'
import { NavLink } from 'react-router'
import "../Style/Navbar.css"
const NavBar = () => {
  return (
    <div>
         <nav>
          <ul>
            <li><NavLink to="/signup">signup</NavLink></li>
            <li><NavLink to="/">login</NavLink></li>
          </ul>
         </nav>
    </div>
  )
}

export default NavBar
