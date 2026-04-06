import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='sticky bottom-0'>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>

      <button className='bg-black text-white px-4 py-2 rounded-md ml-4' >
        hello
      </button>
      
    </div>
  )
}

export default Navbar
