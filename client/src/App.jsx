import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SurahDetail from './pages/SurahDetail';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/surah/:id" element={<SurahDetail />} />
      </Routes>
    </div>
  );
}

export default App;
