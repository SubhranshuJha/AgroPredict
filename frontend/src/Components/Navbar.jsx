import { Link } from 'react-router-dom'
import ThemeButton from './ThemeButton'

function Navbar() {

  const items = [
    { path: '/', name: 'Home' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
  ]

  return (
    <div className='w-full h-1/9  flex gap-4 sticky top-0 z-50 bg-gray-100 dark:bg-slate-900/80 backdrop-blur-md'>
      <div className='flex gap-4 p-5'>
        {
        items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className='px-3 border justify-center items-center flex rounded-2xl dark:text-white dark:border-white/20'
          >
            {item.name}
          </Link>
        ))
      }
      <ThemeButton />
      </div>


    </div>
  )
}

export default Navbar