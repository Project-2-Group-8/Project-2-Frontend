import { useEffect, useState } from 'react'

function App() {
  const [hikes, setHikes] = useState([])

  useEffect(() => {
    // Fetch from Java Backend (Port 8080)
    fetch('http://localhost:8080/api/hikes')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        console.log("Data received:", data); // Should be able to be seen in browser console
        setHikes(data);
      })
      .catch(err => console.error("Is your Java app running?", err));
  }, [])

  return (
    <div className="App">
      
      <div className="card">
        <h2>Recent Hikes</h2>
        {hikes.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {hikes.map(hike => (
              <li key={hike.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
                <strong>{hike.trailName}</strong> <br />
                {hike.distanceMiles} miles | {hike.activityType} <br />
                <small>Hiker: {hike.userEmail}</small>
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

export default App