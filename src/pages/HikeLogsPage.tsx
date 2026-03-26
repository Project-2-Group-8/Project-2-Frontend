import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

type HikeLog = {
  id: number
  activityType: string
  distanceMile: number
  createdAt: string
}

function HikeLogsPage() {
  const { hikeId } = useParams()
   const navigate = useNavigate()
  const [logs, setLogs] = useState<HikeLog[]>([])

  useEffect(() => {
    fetch(`http://localhost:8080/api/hike-logs/hike/${hikeId}`)
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error(err))
  }, [hikeId])

  return (
    <div>
      <h2>Logs for Hike {hikeId}</h2>
      <button onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      {logs.length > 0 ? (
        <ul>
          {logs.map(log => (
            <li key={log.id}>
              {log.activityType} - {log.distanceMile} miles <br />
              <small>{log.createdAt}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No logs found.</p>
      )}
    </div>
  )
}

export default HikeLogsPage