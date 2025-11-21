import { useState } from 'react'
import Auth from './pages/Auth'
import ChatLayout from './components/ChatLayout'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <>
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <ChatLayout user={user} onLogout={handleLogout} />
      )}
    </>
  )
}

export default App
