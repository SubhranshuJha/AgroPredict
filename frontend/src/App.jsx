import './App.css'
import {Routes, Route} from 'react-router-dom'
import { Home, Dashboard, Login, Register } from './Pages/index'
import Navbar from './components/Navbar'

function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
