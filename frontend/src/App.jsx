import { useEffect, useState } from 'react'
import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { Home, Dashboard, CommodityInfo, AboutUs, MarketOverview } from './Pages'
import Layout from './Layout'
import { GlobalLoader } from './Components'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>

      <Route index element={<Home />} />
      <Route path='commodityInformation/:commodity_Type/:commodityId' element={<CommodityInfo />} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='about' element={<AboutUs />} />
      <Route path='market-overview' element={<MarketOverview />} />

    </Route >
  )
)


function App() {

  return (
    <div className='w-full min-h-screen 
    bg-[#f1f1f0]
    dark:bg-black
    text-gray-800 dark:text-white'>

      {/* <GlobalLoader /> */}
      <RouterProvider router={router} />

    </div>
  )
}

export default App