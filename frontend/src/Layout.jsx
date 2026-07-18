import { useEffect } from 'react'
import { Navbar, Footer } from './Components'
import { Outlet, useLocation } from 'react-router-dom'

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // window.scrollTo(0,0)
    }, [pathname]);

    return null;
};


function Layout() {
    const { pathname } = useLocation();
    return (
        <div className={`w-full flex flex-col min-h-screen 
        ${
        pathname === "/dashboard"
          ? "bg-[#B4EBE6]/20 dark:bg-[#020617]" 
          : "bg-[#f1f1f0] dark:bg-black"
      }
        `}>

            <Navbar />
            <ScrollToTop />
            <main className='grow'>
                <Outlet />
            </main>

            <Footer />

        </div>
    )
}

export default Layout