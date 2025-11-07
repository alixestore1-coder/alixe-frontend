import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  console.error('root elementi bulunamadı!')
} else {
  createRoot(rootEl).render(<App />)
}