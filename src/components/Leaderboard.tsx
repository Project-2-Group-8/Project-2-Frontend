import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [category, setCategory] = useState<'Running' | 'Walking'>('Running');

  useEffect(() => {
    fetch(`http://localhost:8080/api/hikes/leaderboard?type=${category}`)
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error("Error:", err));
  }, [category]);

  return (
    <div className="login-card" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2 style={{ color: '#166534' }}>Fastest {category} Times</h2>
      
      {/* Category Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setCategory('Running')} style={{ marginRight: '10px' }}>Running</button>
        <button onClick={() => setCategory('Walking')}>Walking</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Rank</th>
            <th>Hiker ID</th>
            <th>Personal Best</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #f9f9f9' }}>
              <td>{index + 1}</td>
              <td style={{ padding: '10px' }}>User #{row[0]}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>
              {row[1] ? parseFloat(row[1]).toFixed(1) : "0.0"} mins
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/"><button>Back to Dashboard</button></Link>
      </div>
    </div>
  );
};

export default Leaderboard;