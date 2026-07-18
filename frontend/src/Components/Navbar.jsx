import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeButton from './ThemeButton'
import Logo from '/icons/Logo.png'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const items = [
    { path: '/', name: 'Home' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/market-overview', name: 'Overview' },
  ]

  return (
    <nav className='sticky top-2 sm:top-4 z-50 mx-auto w-[95%] lg:max-w-6xl 
    flex flex-col
    px-4 sm:px-6 lg:px-8
    bg-[#ffffffcc] dark:bg-slate-900/80 backdrop-blur-xl 
    border border-[#e0ddd7] dark:border-white/10 
    rounded-2xl shadow-md'>

      <div className='h-14 sm:h-16 flex items-center justify-between'>

        {/* LEFT */}
        <Link to={'/'} className="flex items-center gap-2 sm:gap-3">
          <img src={Logo} alt="AgroPredict" className='h-8 sm:h-9 w-auto' />
          <span className="text-base sm:text-lg font-bold tracking-tight text-gray-800 dark:text-white hidden sm:block">
            AGRO<span className="text-[#2f855a] dark:text-emerald-400">PREDICT</span>
          </span>
        </Link>

        {/* RIGHT (desktop) */}
        <div className='hidden md:flex items-center gap-2 lg:gap-4'>

          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className='px-3 py-2 text-sm font-medium rounded-lg 
              text-gray-700 hover:text-[#2f855a]
              hover:bg-[#f1efe9] 
              transition-all duration-200'
            >
              {item.name}
            </Link>
          ))}

          {/* divider */}
          <div className="h-5 w-px bg-[#d6d3cd] dark:bg-white/20 mx-2" />

          <div className="ml-1">
            <ThemeButton />
          </div>

        </div>

        {/* RIGHT (mobile) */}
        <div className='flex md:hidden items-center gap-1'>
          <ThemeButton />

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className='w-11 h-11 flex items-center justify-center rounded-full
            text-gray-700 dark:text-gray-200
            hover:bg-[#f1efe9] dark:hover:bg-white/10
            transition-colors duration-200'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
              {menuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${menuOpen ? 'max-h-60 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <div className='flex flex-col gap-1 pt-2 border-t border-[#e0ddd7] dark:border-white/10'>
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className='px-3 py-3 text-base font-medium rounded-lg 
              text-gray-700 dark:text-gray-200 hover:text-[#2f855a]
              hover:bg-[#f1efe9] dark:hover:bg-white/10
              transition-all duration-200'
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

    </nav>
  )
}

export default Navbar