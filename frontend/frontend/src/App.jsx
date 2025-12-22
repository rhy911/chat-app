import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Auth from './pages/Auth'
import Chat from './pages/Chat'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on init
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  })

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth onLogin={handleLogin} />} />
        <Route 
          path="/chat" 
          element={user ? <Chat user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
