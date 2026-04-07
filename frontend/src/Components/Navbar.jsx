import { Link } from 'react-router-dom'

function Navbar() {

  const items = [
    { path: '/', name: 'Home' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
  ]

  return (
    <div className='w-full h-1/9 border-b border-amber-900 flex gap-4'>
      <div className='flex gap-4 p-5'>
        {
        items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className='px-3 border justify-center items-center flex rounded-2xl '
          >
            {item.name}
          </Link>
        ))
      }
      </div>


    </div>
  )
}

export default Navbar
