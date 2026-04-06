import { useEffect, useState } from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import { Home, Dashboard, Login, Register } from './Pages/index'
import Navbar from './components/Navbar'
import useTheme from './contexts/theme.jsx';

function App() {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    

    <div className='w-full h-screen  bg-amber-400 dark:bg-amber-950 '>

      <p className='text-2xl w-fit mx-auto'>Hello</p>

      <button
        className='bg-blue-400 w-50 mx-auto p-6'
        onClick={toggleTheme}

      >
        toggle( {themeMode} )
      </button>
      </div>
    </div>
  )
}

export default App
