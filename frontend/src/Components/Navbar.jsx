import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='sticky bottom-0'>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>

    </div>
  )
}

export default Navbar
