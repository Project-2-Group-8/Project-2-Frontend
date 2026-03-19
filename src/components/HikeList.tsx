import React from 'react'
import { Hike } from './HikeForm'

interface HikeListProps {
  hikes: Hike[]
}

const HikeList: React.FC<HikeListProps> = ({ hikes }) => {
  return (
    <div className="card">
      <h2>Recent Hikes</h2>
      {hikes.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {hikes.map((hike) => (
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
  )
}

export default HikeList