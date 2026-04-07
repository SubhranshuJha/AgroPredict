import { Link } from 'react-router-dom'
import useTheme from '../contexts/theme'

function Navbar() {
  const { themeMode, toggleTheme } = useTheme();
  return (
    <div className='text-black dark:text-black fixed top-0 bg-amber-50 dark:bg-green-50 w-full h-10 flex items-center justify-around'>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>

      <button onClick={toggleTheme} className='px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded text-sm cursor-pointer'>
        {themeMode === "light" ? "Dark Mode" : "Light Mode"}
      </button>
      
    </div>
  )
}

export default Navbar
