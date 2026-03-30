import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TextDiff from '../components/TextDiff';

function SurahDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toArabicNumbers = (num) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, function (w) {
      return arabicNumbers[w];
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/surahs/${id}/dual`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dual surah details');
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
  }, [id]);

  if (loading) return <div className="loading">Loading Ayahs...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!data) return <div className="error-message">Surah not found.</div>;

  const hafsSurah = data.hafs;
  const warshSurah = data.warsh;

  return (
    <div>
      <div className="detail-header">
        <Link to="/" className="back-button">
          &larr; Back
        </Link>
        <h2 className="detail-title">{hafsSurah.name}</h2>
      </div>

      <div className="legend">
        <span className="legend-item"><span className="legend-dot warsh-bg"></span> Warsh</span>
        <span className="legend-item"><span className="legend-dot hafs-bg"></span> Hafs</span>
      </div>
      
      <div className="ayahs-container">
        {hafsSurah.ayahs.map((hafsAyah, index) => {
          const warshAyah = warshSurah.ayahs[index];
          if (!warshAyah) return null;

          return (
            <div key={hafsAyah.numberInSurah} className="ayah">
              <div className="ayah-text">
                <TextDiff warshText={warshAyah.text} hafsText={hafsAyah.text} />
                <span className="ayah-number"> ﴿{toArabicNumbers(hafsAyah.numberInSurah)}﴾</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SurahDetail;
