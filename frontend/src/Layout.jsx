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
    return (
        <div className='w-full flex flex-col min-h-screen'>

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