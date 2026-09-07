import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { config } from '../utils/config';

const DirectSearchContext = createContext();

export function DirectSearchProvider({ children }) {
  // 새로고침 시 초기화되도록 순수 인메모리 상태로 관리
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('전체');
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [visibleCount, setVisibleCount] = useState(40);
  const scrollYRef = useRef(0);

  const isInitialized = useRef(false);

  // 이전 세션스토리지 잔재 삭제
  useEffect(() => {
    sessionStorage.removeItem('direct_keyword');
    sessionStorage.removeItem('direct_type');
    sessionStorage.removeItem('direct_scroll_y');
    sessionStorage.removeItem('direct_visible_count');
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    async function fetchAllSpecialties() {
      setIsLoadingData(true);
      try {
        const res = await fetch(`${config.API_BASE_URL}/specialties/all`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setAllSpecialties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('전체 군사특기 로드 오류:', err);
        setAllSpecialties([]);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchAllSpecialties();
  }, []);

  const saveScrollY = useCallback((y) => {
    scrollYRef.current = y;
  }, []);

  const getScrollY = useCallback(() => {
    return scrollYRef.current;
  }, []);

  const updateKeyword = useCallback((val) => {
    setKeyword(val);
    scrollYRef.current = 0;
    setVisibleCount(40);
  }, []);

  const updateSelectedType = useCallback((val) => {
    setSelectedType(val);
    scrollYRef.current = 0;
    setVisibleCount(40);
  }, []);

  const resetDirectSearch = useCallback(() => {
    setKeyword('');
    setSelectedType('전체');
    scrollYRef.current = 0;
    setVisibleCount(40);
  }, []);

  const value = {
    keyword,
    setKeyword: updateKeyword,
    selectedType,
    setSelectedType: updateSelectedType,
    allSpecialties,
    setAllSpecialties,
    isLoadingData,
    visibleCount,
    setVisibleCount,
    saveScrollY,
    getScrollY,
    resetDirectSearch
  };

  return (
    <DirectSearchContext.Provider value={value}>
      {children}
    </DirectSearchContext.Provider>
  );
}

export const useDirectSearch = () => {
  const context = useContext(DirectSearchContext);
  if (!context) {
    throw new Error('useDirectSearch must be used within a DirectSearchProvider');
  }
  return context;
};
