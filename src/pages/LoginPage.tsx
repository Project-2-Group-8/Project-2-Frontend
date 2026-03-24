import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function LoginPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to home
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/')
      setLoading(false)
    })
  }, [navigate])

  async function handleLogin() {
    setMessage('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setMessage(`Login error: ${error.message}`)
  }

  if (loading) return <p>Checking session...</p>

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center', padding: '2rem' }}>
      <h1>Monterey Bay Trail Tracker</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Sign in to log your hikes
      </p>
      <button
        onClick={handleLogin}
        style={{
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Sign in with Google
      </button>
      {message && <p style={{ color: 'red', marginTop: '1rem' }}>{message}</p>}
    </div>
  )
}