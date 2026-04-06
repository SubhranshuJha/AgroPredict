import { useEffect, useState } from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import { Home, Dashboard, Login, Register } from './Pages/index'
import Navbar from './components/Navbar'
import Nav from './Components/Nav'

function App() {

  return (
    <div className='w-full h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white'>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>

    </div>
  )
}

export default App
