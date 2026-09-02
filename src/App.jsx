import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { StartPage } from './pages/StartPage';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import './milpick.css';

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/detail/:code" element={<DetailPage />} />
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;
