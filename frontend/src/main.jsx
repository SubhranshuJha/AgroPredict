import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './contexts/theme/ThemeProvider.jsx'
import DataProvider from './contexts/data/DataProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <ThemeProvider>

        <App />

      </ThemeProvider>
    </DataProvider>
  </StrictMode>,
)
