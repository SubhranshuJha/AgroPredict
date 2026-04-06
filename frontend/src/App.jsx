import { useEffect, useState } from 'react'
import './App.css'
import useTheme from './contexts/theme.jsx';

function App() {
  const { themeMode, toggleTheme } = useTheme();

  return (

    <div className='w-full h-screen  bg-amber-400 dark:bg-amber-950 '>

      <p className='text-2xl w-fit mx-auto'>Hello</p>

      <button
        className='bg-blue-400 w-50 mx-auto p-6'
        onClick={toggleTheme}

      >
        toggle( {themeMode} )
      </button>
    </div>
  )
}

export default App
