import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabase'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HikeList from './components/HikeList'
import HikeForm from './components/HikeForm'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'

// Types
type BackendUser = {
  authenticated: boolean
  sub?: string
  email?: string
  role?: string
}

type Hike = {
  id: number
  name: string
  location: string
  distance: number
  date: string
}

function App() {
  // --- Supabase Auth State ---
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [tokenPreview, setTokenPreview] = useState('')
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const [message, setMessage] = useState('')

  // --- Hikes State ---
  const [hikes, setHikes] = useState<Hike[]>([])

  // --- Supabase auth effect ---
  useEffect(() => {
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setIsLoggedIn(true)
        setEmail(session.user.email ?? '')
        setTokenPreview(session.access_token ? `${session.access_token.slice(0, 25)}...` : '')
        await checkBackend(session.access_token)
      } else {
        setIsLoggedIn(false)
        setEmail('')
        setTokenPreview('')
        setBackendUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // --- Auth Functions ---
  async function checkAuth() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.getSession()

    if (error) {
      setMessage(`Session error: ${error.message}`)
      setIsLoggedIn(false)
      setLoading(false)
      return
    }

    const session = data.session

    if (!session) {
      setIsLoggedIn(false)
      setEmail('')
      setTokenPreview('')
      setBackendUser(null)
      setLoading(false)
      return
    }

    setIsLoggedIn(true)
    setEmail(session.user.email ?? '')
    setTokenPreview(session.access_token ? `${session.access_token.slice(0, 25)}...` : '')
    await checkBackend(session.access_token)
    setLoading(false)
  }

  async function checkBackend(token: string) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const text = await response.text()
        setMessage(`Backend auth check failed: ${response.status} ${text}`)
        setBackendUser(null)
        return
      }

      const data = await response.json()
      setBackendUser(data)
    } catch (err) {
      setMessage(`Backend request failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setBackendUser(null)
    }
  }

  async function handleLogin() {
    setMessage('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback',
      },
    })

    if (error) {
      setMessage(`Login error: ${error.message}`)
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setMessage(`Logout error: ${error.message}`)
      return
    }

    setIsLoggedIn(false)
    setEmail('')
    setTokenPreview('')
    setBackendUser(null)
    setMessage('Logged out successfully.')
  }

  // --- Hike Functions ---
  const fetchHikes = () => {
    fetch('http://localhost:8080/api/hikes/all')
      .then((res) => res.json())
      .then((data) => setHikes(data))
      .catch((err) => console.error('Error fetching hikes:', err))
  }

  useEffect(() => {
    fetchHikes()
  }, [])

  const handleHikeAdded = (newHike: Hike) => {
    fetchHikes() // Refresh list after adding
  }

  return (
    <Router>
      <div className="app-shell">
        <nav className="top-nav">
          <Link to="/">Home</Link>
          {backendUser && <Link to="/profile">Profile</Link>}
          {backendUser?.role === 'admin' && <Link to="/admin">Admin</Link>}
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav>

        {message && <p className="message">{message}</p>}

        <Routes>
          <Route
            path="/"
            element={
              <div className="login-card">
                <h1>Monterey Bay Hiking App</h1>
                <p className="subtitle">Google login through Supabase</p>

                {loading ? (
                  <p>Loading session...</p>
                ) : isLoggedIn ? (
                  <>
                    <div className="info-box">
                      <p>
                        <strong>Email:</strong> {email || 'N/A'}
                      </p>
                      <p>
                        <strong>Token preview:</strong> {tokenPreview || 'N/A'}
                      </p>
                    </div>

                    <div className="info-box">
                      <p>
                        <strong>Backend authenticated:</strong>{' '}
                        {backendUser?.authenticated ? 'Yes' : 'No'}
                      </p>
                      <p>
                        <strong>Backend email:</strong> {backendUser?.email ?? 'N/A'}
                      </p>
                      <p>
                        <strong>Backend user ID:</strong> {backendUser?.sub ?? 'N/A'}
                      </p>
                      <p>
                        <strong>Backend role:</strong> {backendUser?.role ?? 'N/A'}
                      </p>
                    </div>

                    <div className="dashboard-container">
                      <header className="dashboard-header">
                        <h2>Hike Tracker Dashboard</h2>
                        <p>
                          Welcome back, <strong>{email}</strong>!
                        </p>
                      </header>

                      <main className="dashboard-content">
                        <section className="form-section">
                          <HikeForm onHikeAdded={handleHikeAdded} />
                        </section>

                        <section className="list-section">
                          <HikeList hikes={hikes} />
                        </section>
                      </main>
                    </div>
                  </>
                ) : (
                  <>
                    <p>You are not logged in.</p>
                    <button onClick={handleLogin}>Sign in with Google</button>
                  </>
                )}
              </div>
            }
          />

          <Route path="/profile" element={<ProfilePage backendUser={backendUser} />} />
          <Route path="/admin" element={<AdminPage backendUser={backendUser} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App