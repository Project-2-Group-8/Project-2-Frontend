import { useState, FormEvent } from 'react'

// Type for a Hike object
export interface Hike {
  hikeId?: number
  hikeName: string
  location: string
  lengthMi: number
  difficulty: number
  imageUrl: string
}

// Props for HikeForm
interface HikeFormProps {
  onHikeAdded: (hike: Hike) => void
}

const HikeForm: React.FC<HikeFormProps> = ({ onHikeAdded }) => {
   const [hikeName, setHikeName] = useState('')
  const [location, setLocation] = useState('')
  const [lengthMi, setLengthMi] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  // const [activityType, setActivityType] = useState<'Walking' | 'Running'>('Walking')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const newHike = {
      hikeName,
      location,
      lengthMi: parseFloat(lengthMi),
      difficulty: parseFloat(difficulty),
      imageUrl
    }

    console.log(newHike)
    fetch('http://localhost:8080/api/hikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHike),
    })
      .then((res) => res.json())
      .then((data: Hike) => {
        onHikeAdded(data)
        setHikeName('')
        setLocation('')
        setLengthMi('')
        setDifficulty('')
        setImageUrl('')
      })
      .catch((err) => console.error('Error saving hike:', err))
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ margin: '20px 0', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}
    >
      <h3>Create A New Hike</h3>

      <input
        type="text"
        placeholder="Hike Name"
        value={hikeName}
        onChange={(e) => setHikeName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <input

        type="number"
        step="0.1"
        placeholder="Miles"
        value={lengthMi}
        onChange={(e) => setLengthMi(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        required
      />
<input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      {/* <div style={{ margin: '10px 0' }}>
        <label>Activity: </label>
        <select value={activityType} onChange={(e) => setActivityType(e.target.value as 'Walking' | 'Running')}>
          <option value="Walking">Walking</option>
          <option value="Running">Running</option>
        </select>
      </div> */}

      <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px' }}>
        Save Activity
      </button>
    </form>
  )
}

export default HikeForm