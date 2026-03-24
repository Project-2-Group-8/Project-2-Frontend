import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import { supabase } from './supabase'
import HikeList from './components/HikeList'
import HikeForm from './components/HikeForm'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import EditHikePage from './pages/EditHikePage'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import type { Hike } from './components/HikeForm'

type BackendUser = {
  authenticated: boolean
  sub?: string
  email?: string
  role?: string
}

function Dashboard() {
  const [email, setEmail] = useState('')
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const [hikes, setHikes] = useState<Hike[]>([])

async function handleLogout() {
    await supabase.auth.signOut()
    setEmail('')
    setBackendUser(null)
  }

  function fetchHikes() {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hikes/all`)
      .then(res => res.json())
      .then(data => setHikes(data))
      .catch(err => console.error('Error fetching hikes:', err))
  }
  async function checkBackend(token: string) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setBackendUser(await res.json())
    } catch (err) {
      console.error('Backend check failed:', err)
    }
  }

  
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setEmail(data.session.user.email ?? '')
        await checkBackend(data.session.access_token)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setEmail(session.user.email ?? '')
        await checkBackend(session.access_token)
      } else {
        setEmail('')
        setBackendUser(null)
      }
    })

    fetchHikes()
    return () => subscription.unsubscribe()
  }, [])

  
  

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <Link to="/">Home</Link>
        {backendUser && <Link to="/profile">Profile</Link>}
        {backendUser?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {email
          ? <button onClick={handleLogout}>Logout</button>
          : <Link to="/login"><button>Login</button></Link>
        }
      </nav>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Hike Tracker Dashboard</h2>
          {email && <p>Welcome back, {email}!</p>}
        </header>
        <main className="dashboard-content">
          <section className="form-section">
            <HikeForm onHikeAdded={fetchHikes} />
          </section>
          <section className="list-section">
            <HikeList hikes={hikes} />
          </section>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/profile" element={<ProfilePage backendUser={null} />} />
      <Route path="/admin" element={<AdminPage backendUser={null} />} />
      <Route path="/edit/:id" element={<EditHikePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}