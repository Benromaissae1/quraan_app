import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.PROD 
      ? 'https://quraan-app.onrender.com/api/surahs' 
      : '/api/surahs';
      
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch surahs list');
        return res.json();
      })
      .then(fetchedData => {
        if (fetchedData.data) {
          setSurahs(fetchedData.data);
        } else {
          throw new Error('API returned invalid surah list structure');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading Surahs...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      <header className="header">
        <h1>Quran App</h1>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot warsh-bg"></span> Warsh</span>
          <span className="legend-item"><span className="legend-dot hafs-bg"></span> Hafs</span>
        </div>
      </header>
      
      <div className="surah-list">
        {surahs.map((surah) => (
          <Link to={`/surah/${surah.number}`} key={surah.number} className="surah-block" style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}>
            <div className="surah-block-header" style={{ marginBottom: 0, borderBottom: 'none' }}>
              <div className="surah-number">{surah.number}</div>
              <div className="surah-name-arabic">{surah.name}</div>
              <div className="surah-name-english" style={{ marginLeft: 'auto', fontSize: '1rem', color: '#666' }}>
                {surah.englishName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
