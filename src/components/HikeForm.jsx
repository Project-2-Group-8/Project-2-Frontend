import { useState } from 'react';

function HikeForm({ onHikeAdded }) {
  const [trailName, setTrailName] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [activityType, setActivityType] = useState('Walking');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newHike = {
      trailName: trailName,
      distanceMiles: parseFloat(distance),
      durationMinutes: parseInt(duration),
      userEmail: "guest@tester.com",
      activityType: activityType
    };

    fetch('http://localhost:8080/api/hikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHike),
    })
    .then(res => res.json())
    .then(data => {
      onHikeAdded(data);
      setTrailName('');
      setDistance('');
      setDuration('');
    })
    .catch(err => console.error("Error saving hike:", err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
      <h3>Log a New Activity</h3>
      
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

      {/* New Duration Input */}
      <input 
        type="number" 
        placeholder="Minutes" 
        value={duration} 
        onChange={e => setDuration(e.target.value)} 
        required 
      />

      <div style={{ margin: '10px 0' }}>
        <label>Activity: </label>
        <select value={activityType} onChange={e => setActivityType(e.target.value)}>
          <option value="Walking">Walking</option>
          <option value="Running">Running</option>
        </select>
      </div>

      <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px' }}>
        Save Activity
      </button>
    </form>
  );
}

export default HikeForm;