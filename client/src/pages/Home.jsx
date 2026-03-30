import { useState, useEffect } from 'react';
import TextDiff from '../components/TextDiff';

function Home() {
  const [data, setData] = useState({ hafs: [], warsh: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toArabicNumbers = (num) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, function (w) {
      return arabicNumbers[w];
    });
  };

  useEffect(() => {
    fetch('/api/quran/dual')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dual quran data');
        return res.json();
      })
      .then(fetchedData => {
        if (fetchedData.hafs && fetchedData.warsh) {
          setData(fetchedData);
        } else {
          throw new Error('API returned invalid dual structure');
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

  if (loading) return <div className="loading">Loading Dual Quran...</div>;
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
        {data.hafs.map((hafsSurah, index) => {
          const warshSurah = data.warsh[index];
          if (!warshSurah) return null;

          const hafsFullText = hafsSurah.ayahs.map(a => `${a.text} ﴿${toArabicNumbers(a.numberInSurah)}﴾`).join(' ');
          const warshFullText = warshSurah.ayahs.map(a => `${a.text} ﴿${toArabicNumbers(a.numberInSurah)}﴾`).join(' ');

          return (
            <div key={hafsSurah.number} className="surah-block">
              <div className="surah-block-header">
                <div className="surah-number">{hafsSurah.number}</div>
                <div className="surah-name-arabic">{hafsSurah.name}</div>
              </div>
              <div className="surah-text-container">
                <div className="surah-text-line">
                  <TextDiff warshText={warshFullText} hafsText={hafsFullText} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
