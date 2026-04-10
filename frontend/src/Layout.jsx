import React from 'react'
import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Components/Footer'

function Layout() {
    return (
        <div className='flex flex-col min-h-screen'>

            <Navbar />

            <main className='grow'>
                <Outlet />
            </main>

            <Footer />
            
        </div>
    )
}

export default Layout