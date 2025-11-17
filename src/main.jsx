import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import App from './App'
import Test from './Test'
import Admin from './components/Admin'
import LoreView from './components/LoreView'
import './index.css'

function LorePage() {
  const { id } = useParams()
  return (
    <div className="min-h-screen bg-[#0a0c11] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/" className="text-white/60 hover:text-white">← Back</a>
        <div className="mt-6">
          <LoreView id={id} />
        </div>
      </div>
    </div>
  )
}

function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0a0c11] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Admin />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/lore/:id" element={<LorePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
