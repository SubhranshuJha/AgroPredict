import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { Home, Dashboard, Login, Register, CommodityInfo } from './Pages'
import Layout from './Layout'
import GlobalLoader from './Components/GlobalLoader'

function App() {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>

        <Route index element={<Home />} />
        <Route path='commodityInformation/:commodityId' element={<CommodityInfo />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

      </Route >
    )
  )


  return (
    <div className='w-full min-h-screen bg-white dark:bg-[#020617] text-gray-900 dark:text-white'>
      {/* <Navbar />
      <Routes className=''>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes> */}
      {/* <GlobalLoader /> */}
      <RouterProvider router={router} />

    </div>
  )
}

export default App
