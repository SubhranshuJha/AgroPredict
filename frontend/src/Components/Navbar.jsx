import { Link } from 'react-router-dom'
import ThemeButton from './ThemeButton'
import Logo from '../../Public/icons/Logo.png'

function Navbar() {
  const items = [
    { path: '/', name: 'Home' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
  ]

  return (
    <nav className='sticky top-0 z-50 mx-auto my-4 w-full lg:max-w-7xl h-20 flex items-center justify-between px-8 bg-gray-100/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl transition-all duration-300'>
      <Link to={'/'} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img src={Logo} alt="AgroPredict" className='h-10 w-16' />
        <span className="text-xl font-black tracking-tighter dark:text-white hidden sm:block">
          AGRO<span className="text-emerald-500">PREDICT</span>
        </span>
      </Link>

      <div className='flex items-center gap-3'>
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className='px-4 py-2 text-sm font-medium transition-all rounded-xl 
                       text-gray-700 hover:bg-gray-200 
                       dark:text-gray-200 dark:hover:bg-white/10 dark:border-white/10'
          >
            {item.name}
          </Link>
        ))}

        <div className="h-6 w-px bg-gray-300 dark:bg-white/20 mx-2" />

        <ThemeButton />
      </div>
    </nav>
  )
}

export default Navbar