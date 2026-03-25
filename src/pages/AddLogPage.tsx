import { useState, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export interface HikeLog {
  logId?: number
  userId: number
  durationMin: number
  rating: number
  date: string
  notes: string
  activityType: 'Walking' | 'Running'
  hike: {
    hikeId: number
  }
}

const AddLogPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [userId, setUserId] = useState('')
  const [durationMin, setDurationMin] = useState('')
  const [rating, setRating] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [activityType, setActivityType] = useState<'Walking' | 'Running'>('Walking')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!id) {
      console.error('Missing hike id')
      return
    }

    const newLog: HikeLog = {
      userId: parseInt(userId),
      durationMin: parseFloat(durationMin),
      rating: parseInt(rating),
      date,
      notes,
      activityType,
      hike: {
        hikeId: parseInt(id)
      }
    }

    console.log('Submitting new log:', newLog)

    fetch('http://localhost:8080/api/hike-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to save log: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log('Saved log:', data)
        navigate('/')
      })
      .catch((err) => console.error('Error saving log:', err))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Hike Log</h2>

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
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.1"
          placeholder="Duration (minutes)"
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div style={{ margin: '10px 0' }}>
          <label>Activity: </label>
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value as 'Walking' | 'Running')}
          >
            <option value="Walking">Walking</option>
            <option value="Running">Running</option>
          </select>
        </div>

        <button
          type="submit"
          style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', marginRight: '10px' }}
        >
          Save Log
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

export default AddLogPage