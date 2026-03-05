import { useEffect, useState } from 'react'
import './App.css'
import HikeList from './components/HikeList'
import HikeForm from './components/HikeForm'

function App() {
  const [hikes, setHikes] = useState([])

  // Function to fetch all hikes
  const fetchHikes = () => {
    fetch('http://localhost:8080/api/hikes')
      .then(res => res.json())
      .then(data => setHikes(data))
      .catch(err => console.error("Error fetching hikes:", err));
  }

  // Fetch data on initial load
  useEffect(() => {
    fetchHikes();
  }, [])

  // This function is passed to the Form; it runs after a successful POST
  const handleHikeAdded = (newHike) => {
    fetchHikes(); 

  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hike Tracker Dashboard</h1>
        <p>Welcome back, <strong>Hiker</strong>!</p>
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
  )
}

export default App