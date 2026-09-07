import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { DirectSearchProvider } from './context/DirectSearchContext';
import { AlertProvider } from './context/AlertContext';
import { StartPage } from './pages/StartPage';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import { DirectSearchPage } from './pages/DirectSearchPage';
import './milpick.css';

function App() {
  return (
    <AlertProvider>
      <SearchProvider>
        <DirectSearchProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/direct" element={<DirectSearchPage />} />
              <Route path="/all" element={<DirectSearchPage />} />
              <Route path="/detail/:code" element={<DetailPage />} />
            </Routes>
          </BrowserRouter>
        </DirectSearchProvider>
      </SearchProvider>
    </AlertProvider>
  );
}

export default App;
