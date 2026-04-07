import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home, Dashboard, Login, Register } from './Pages/index'
import Navbar from './Components/Navbar'

function App() {

  return (
    <div className='w-full min-h-screen bg-white dark:bg-[#020617] text-gray-900 dark:text-white'>
      <Navbar />
      <Routes className=''>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>

    </div>
  )
}

export default App
