import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import NewsApp from './components/news1.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <NewsApp /> */}
  </StrictMode>,
)
