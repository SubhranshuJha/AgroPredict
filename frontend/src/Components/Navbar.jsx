import { Link } from 'react-router-dom'
import ThemeButton from './ThemeButton'
import Logo from '../../Public/icons/Logo.png'

function Navbar() {
  const items = [
    { path: '/', name: 'Home' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/market-overview', name: 'Overview' },
  ]

  return (
    <nav className='sticky top-4 z-50 mx-auto w-[95%] lg:max-w-6xl 
    h-16 flex items-center justify-between 
    px-6 lg:px-8
    bg-[#ffffffcc] dark:bg-slate-900/80 backdrop-blur-xl 
    border border-[#e0ddd7] dark:border-white/10 
    rounded-2xl shadow-md'>

      {/* LEFT */}
      <Link to={'/'} className="flex items-center gap-3">
        <img src={Logo} alt="AgroPredict" className='h-9 w-auto' />
        <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-white hidden sm:block">
          AGRO<span className="text-[#2f855a] dark:text-emerald-400">PREDICT</span>
        </span>
      </Link>

      {/* RIGHT */}
      <div className='flex items-center gap-2 lg:gap-4'>

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
        <div className="hidden sm:block h-5 w-px bg-[#d6d3cd] dark:bg-white/20 mx-2" />

        <div className="ml-1">
          <ThemeButton />
        </div>

      </div>
    </nav>
  )
}

export default Navbar