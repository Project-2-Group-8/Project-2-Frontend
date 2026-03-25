import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditHikePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [hikeName, setHikeName] = useState('')
  const [location, setLocation] = useState('')
  const [lengthMi, setLengthMi] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8080/api/hikes/${id}`)
      .then(res => res.json())
      .then(data => {
        setHikeName(data.hikeName || '')
        setLocation(data.location || '')
        setLengthMi(data.lengthMi?.toString() || '')
        setDifficulty(data.difficulty?.toString() || '')
        setImageUrl(data.imageUrl || '')
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
      hikeName,
      location,
      lengthMi: parseFloat(lengthMi),
      difficulty: parseFloat(difficulty),
      imageUrl
    }
    console.log('Submitting updated hike:', updatedHike)

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
      <h2>Edit Hike</h2>

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
          placeholder="Hike Name"
          value={hikeName}
          onChange={e => setHikeName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Length (miles)"
          value={lengthMi}
          onChange={e => setLengthMi(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Difficulty"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />

        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px',
            marginRight: '10px'
          }}
        >
          Update Hike
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