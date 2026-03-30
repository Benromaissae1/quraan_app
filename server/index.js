const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Default endpoint
app.get('/', (req, res) => {
  res.send('Quran App API Server is running');
});

// Proxy API to get all Surahs
app.get('/api/surahs', async (req, res) => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching surahs:', error);
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
});

// Proxy API to get a specific Surah with its Ayahs
// Uses 'quran-uthmani' edition to get the standard Arabic text
app.get('/api/surahs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching surah ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch surah ${req.params.id}` });
  }
});

// Proxy API to get the entire Quran
app.get('/api/quran', async (req, res) => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching entire quran:', error);
    res.status(500).json({ error: 'Failed to fetch entire quran' });
  }
});

// Proxy API to get dual versions for entire Quran
app.get('/api/quran/dual', async (req, res) => {
  try {
    const [hafsRes, warshRes] = await Promise.all([
      fetch('https://api.alquran.cloud/v1/quran/quran-uthmani'),
      fetch('https://api.alquran.cloud/v1/quran/quran-warsh-asim')
    ]);
    const hafsData = await hafsRes.json();
    const warshData = await warshRes.json();

    if (hafsData.code !== 200 || warshData.code !== 200) {
      throw new Error(`API error`);
    }
    res.json({ hafs: hafsData.data.surahs, warsh: warshData.data.surahs });
  } catch (error) {
    console.error('Error fetching dual quran:', error);
    res.status(500).json({ error: 'Failed to fetch dual quran' });
  }
});

// Proxy API to get dual versions for specific Surah
app.get('/api/surahs/:id/dual', async (req, res) => {
  try {
    const { id } = req.params;
    const [hafsRes, warshRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${id}/quran-warsh-asim`)
    ]);
    const hafsData = await hafsRes.json();
    const warshData = await warshRes.json();

    if (hafsData.code !== 200 || warshData.code !== 200) {
      throw new Error(`API error`);
    }
    res.json({ hafs: hafsData.data, warsh: warshData.data });
  } catch (error) {
    console.error(`Error fetching dual surah ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch dual surah ${req.params.id}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
