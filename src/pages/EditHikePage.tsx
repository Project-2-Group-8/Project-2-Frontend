// src/pages/EditHikePage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditHikePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [trailName, setTrailName] = useState('')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [activityType, setActivityType] = useState('Walking')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8080/api/hikes/${id}`)
      .then(res => res.json())
      .then(data => {
        setTrailName(data.trailName || '')
        setDistance(data.distanceMiles?.toString() || '')
        setDuration(data.durationMinutes?.toString() || '')
        setActivityType(data.activityType || 'Walking')
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching hike:', err)
        setLoading(false)
      })
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedHike = {
      trailName,
      distanceMiles: parseFloat(distance),
      durationMinutes: parseInt(duration),
      userEmail: 'guest@tester.com',
      activityType
    }

    fetch(`http://localhost:8080/api/hikes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedHike)
    })
      .then(res => res.json())
      .then(() => {
        navigate('/')
      })
      .catch(err => console.error('Error updating hike:', err))
  }

  if (loading) return <p>Loading hike...</p>

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Activity</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          margin: '20px 0',
          padding: '15px',
          border: '1px solid #444',
          borderRadius: '8px'
        }}
      >
        <input
          type="text"
          placeholder="Trail Name"
          value={trailName}
          onChange={e => setTrailName(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.1"
          placeholder="Miles"
          value={distance}
          onChange={e => setDistance(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Minutes"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          required
        />

        <div style={{ margin: '10px 0' }}>
          <label>Activity: </label>
          <select
            value={activityType}
            onChange={e => setActivityType(e.target.value)}
          >
            <option value="Walking">Walking</option>
            <option value="Running">Running</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px',
            marginRight: '10px'
          }}
        >
          Update Activity
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ padding: '10px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  )
}

export default EditHikePage