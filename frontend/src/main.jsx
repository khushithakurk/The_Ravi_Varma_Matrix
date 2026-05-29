import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' // FIXED: Explicitly imports your immersive museum engine!
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)