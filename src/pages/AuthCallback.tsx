import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/')
      } else {
        navigate('/login')
      }
    })
  }, [navigate])

  return <p style={{ textAlign: 'center', marginTop: '80px' }}>Signing you in...</p>
}