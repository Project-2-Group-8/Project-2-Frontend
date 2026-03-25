import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Hike = {
  hikeId: number
  hikeName: string
  location: string
  lengthMi: number
  difficulty: string
  imageUrl?: string 
}

function HikeList() {
   const [hikes, setHikes] = useState<Hike[]>([])
   const navigate = useNavigate()

  useEffect(() => {
    // Fetch from Java Backend (Port 8080)
    fetch('http://localhost:8080/api/hikes/all')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data: Hike[]) => {
        console.log("Data received:", data); // Should be able to be seen in browser console
        setHikes(data);
      })
      .catch(err => console.error("Is your Java app running?", err));
  }, [])

  const handleEdit = (hikeId: number) => {
    navigate(`/edit/${hikeId}`)
  }

  const handleAddLog = (hikeId: number) => {
    navigate(`/log/${hikeId}`)
  }

  return (
    <div className="App">
      
      <div className="card">
        <h2>Recent Hikes</h2>
        {hikes.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {hikes.map(hike => (
              <li key={hike.hikeId} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
                <strong>{hike.hikeName}</strong> <br />
                {hike.lengthMi} miles | {hike.location} <br />
                <small>Difficulty: {hike.difficulty}</small>
                 {hike.imageUrl && (
                  <img
                    src={hike.imageUrl}
                    alt={hike.hikeName}
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      height: 'auto',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}
                  />
                )}

                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(hike.hikeId)}>
                    Edit
                  </button>

                  <button onClick={() => handleAddLog(hike.hikeId)}>
                    Add Log
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hikes found.</p>
        )}
      </div>
    </div>
  )
}

export default HikeList