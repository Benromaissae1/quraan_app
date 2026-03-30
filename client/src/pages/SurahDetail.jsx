import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import TextDiff from '../components/TextDiff';

function SurahDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentAyah, setCurrentAyah] = useState(1);
  const [restoredText, setRestoredText] = useState('');
  const containerRef = useRef(null);
  const ayahsRef = useRef(new Map());

  const toArabicNumbers = (num) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, function (w) {
      return arabicNumbers[w];
    });
  };

  useEffect(() => {
    setLoading(true);
    const apiUrl = import.meta.env.PROD 
      ? `https://quraan-app.onrender.com/api/surahs/${id}/dual` 
      : `/api/surahs/${id}/dual`;

    fetch(apiUrl)
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

  useEffect(() => {
    if (data && containerRef.current && ayahsRef.current.size > 0) {
      const saved = localStorage.getItem(`surah_${id}_progress`);
      if (saved) {
        const savedAyah = Number(saved);
        const el = ayahsRef.current.get(savedAyah);
        if (el) {
          // Use setTimeout to ensure the DOM is fully laid out before scrolling
          setTimeout(() => {
            el.scrollIntoView({ inline: 'end', block: 'nearest' });
            setCurrentAyah(savedAyah);
            setRestoredText(`↩ استأنف من الآية ${toArabicNumbers(savedAyah)}`);
            // clear the restored text after 3 seconds
            setTimeout(() => setRestoredText(''), 3000);
          }, 100);
        }
      }
    }
  }, [data, id]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const checkPoint = containerRect.right - (containerRect.width * 0.3); // 30% from the right edge
    
    let visibleAyah = currentAyah;
    for (const [ayahNum, el] of ayahsRef.current.entries()) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.left <= checkPoint && rect.right >= checkPoint) {
        visibleAyah = ayahNum;
        break;
      }
    }
    
    if (visibleAyah !== currentAyah) {
      setCurrentAyah(visibleAyah);
      localStorage.setItem(`surah_${id}_progress`, visibleAyah);
    }
  };

  if (loading) return <div className="loading">Loading Ayahs...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!data) return <div className="error-message">Surah not found.</div>;

  const hafsSurah = data.hafs;
  const warshSurah = data.warsh;

  const totalAyahs = hafsSurah.ayahs.length;

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
      
      <div className="surah-block" style={{ marginTop: '24px', position: 'relative' }}>
        <div 
          className="surah-text-container" 
          ref={containerRef} 
          onScroll={handleScroll}
        >
          <div className="surah-text-line">
            {hafsSurah.ayahs.map((hafsAyah, index) => {
              const warshAyah = warshSurah.ayahs[index];
              if (!warshAyah) return null;

              const ayahNumStr = ` ﴿${toArabicNumbers(hafsAyah.numberInSurah)}﴾`;
              const hText = hafsAyah.text + ayahNumStr;
              const wText = warshAyah.text + ayahNumStr;

              return (
                <span 
                  key={hafsAyah.numberInSurah} 
                  ref={el => ayahsRef.current.set(hafsAyah.numberInSurah, el)}
                  style={{ display: 'inline-block' }}
                >
                  <TextDiff warshText={wText} hafsText={hText} />
                </span>
              );
            })}
          </div>
        </div>
        
        {/* Ayah Progress Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <div>
            {restoredText && <span style={{ color: 'var(--primary-color)' }}>{restoredText}</span>}
          </div>
          <div style={{ fontFamily: '"Amiri", serif', fontSize: '18px' }} dir="rtl">
            الآية {toArabicNumbers(currentAyah)} / {toArabicNumbers(totalAyahs)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurahDetail;
