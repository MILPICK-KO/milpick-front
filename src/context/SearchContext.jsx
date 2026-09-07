import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { config } from '../utils/config';

const SearchContext = createContext();

const API_BASE_URL = config.API_BASE_URL;

export function SearchProvider({ children }) {
  const isInitialized = useRef(false);

  // Global API states
  const [apiStatus, setApiStatus] = useState('API 연결 확인 중…');
  const [apiError, setApiError] = useState(false);
  const [allFields, setAllFields] = useState([]);
  const [commonExclusions, setCommonExclusions] = useState([]);

  // Form states
  const [recruitmentTypes, setRecruitmentTypes] = useState([]);
  const [majorInput, setMajorInput] = useState('');
  const [recommendedFields, setRecommendedFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  
  const [excludeInput, setExcludeInput] = useState('');
  const [excludeList, setExcludeList] = useState([]);
  
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [grade, setGrade] = useState('');
  const [vision, setVision] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [resultTab, setResultTab] = useState('전체');
  const [searchedRelation, setSearchedRelation] = useState('none');

  const [hasSearchedMajor, setHasSearchedMajor] = useState(false);
  const [unlockedStep, setUnlockedStep] = useState(1);

  // Initialize API data once when app loads (guarded against duplicate invocations)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initData = async () => {
      try {
        const [fieldsRes, exclusionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/search/fields`),
          fetch(`${API_BASE_URL}/search/exclusions`)
        ]);
        
        if (fieldsRes.ok && exclusionsRes.ok) {
          const fieldsData = await fieldsRes.json();
          const exclusionsData = await exclusionsRes.json();
          setAllFields(fieldsData.fields || []);
          setCommonExclusions(exclusionsData.exclusions || []);
          setApiStatus('API 연결 성공');
          setApiError(false);
        } else {
          throw new Error('API request failed');
        }
      } catch (err) {
        console.error(err);
        setApiStatus('API 연결 실패');
        setApiError(true);
      }
    };
    initData();
  }, []);

  const value = {
    apiStatus, setApiStatus,
    apiError, setApiError,
    allFields, setAllFields,
    commonExclusions, setCommonExclusions,
    recruitmentTypes, setRecruitmentTypes,
    majorInput, setMajorInput,
    recommendedFields, setRecommendedFields,
    selectedFields, setSelectedFields,
    excludeInput, setExcludeInput,
    excludeList, setExcludeList,
    height, setHeight,
    weight, setWeight,
    grade, setGrade,
    vision, setVision,
    searchResults, setSearchResults,
    hasSearched, setHasSearched,
    resultTab, setResultTab,
    searchedRelation, setSearchedRelation,
    hasSearchedMajor, setHasSearchedMajor,
    unlockedStep, setUnlockedStep
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
