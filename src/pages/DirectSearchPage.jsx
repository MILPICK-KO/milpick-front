import { useEffect, useMemo, useRef } from 'react';
import { useDirectSearch } from '../context/DirectSearchContext';
import { ResultCard } from '../components/ResultCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const RECRUITMENT_TYPES = [
  '전체',
  '기술행정병',
  '전문특기병',
  '취업맞춤특기병',
  '어학병',
  '카투사'
];

export function DirectSearchPage() {
  const {
    keyword,
    setKeyword,
    selectedType,
    setSelectedType,
    allSpecialties,
    isLoadingData,
    visibleCount,
    setVisibleCount,
    saveScrollY,
    getScrollY,
    resetDirectSearch
  } = useDirectSearch();

  // 1. 브라우저 주소창에 남아있는 ?q= 파라미터가 있다면 깔끔하게 제거
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 2. 스크롤 실시간 추적 (메모리에 보관)
  useEffect(() => {
    const handleScroll = () => {
      saveScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [saveScrollY]);

  // 3. 상세페이지에서 뒤로 복귀 시 저장된 스크롤 위치 복원
  const isRestoredRef = useRef(false);
  useEffect(() => {
    if (!isLoadingData && !isRestoredRef.current) {
      isRestoredRef.current = true;
      const savedY = getScrollY();
      if (savedY > 0) {
        window.scrollTo(0, savedY);
        const rId = requestAnimationFrame(() => {
          window.scrollTo(0, savedY);
        });
        const timer = setTimeout(() => {
          window.scrollTo(0, savedY);
        }, 50);
        return () => {
          cancelAnimationFrame(rId);
          clearTimeout(timer);
        };
      }
    }
  }, [isLoadingData, getScrollY]);

  // 4. 공백, 점(.), 슬래시(/), 하이픈(-), 괄호 등 정규화 헬퍼 함수
  const normalize = (str) => (str || '').toLowerCase().replace(/[\s./()_·\-,~[\]]/g, '');

  // 5. 실시간(Live) 필터링 로직: 특기명과 특기번호(코드)로만 매칭
  const filteredSpecialties = useMemo(() => {
    const normalizedQuery = normalize(keyword);

    return allSpecialties.filter(item => {
      // (1) 모집구분 탭 필터링
      if (selectedType !== '전체' && item.recruitment_type !== selectedType) {
        return false;
      }

      // (2) 키워드가 없으면 해당 탭 전체 반환
      if (!normalizedQuery) {
        return true;
      }

      // (3) 특기명(specialty_name)과 특기번호(specialty_code)로만 매칭
      const normName = normalize(item.specialty_name);
      const normCode = normalize(item.specialty_code);

      return normName.includes(normalizedQuery) || normCode.includes(normalizedQuery);
    });
  }, [allSpecialties, keyword, selectedType]);

  // 화면에 렌더링할 목록
  const displayList = useMemo(() => {
    return filteredSpecialties.slice(0, visibleCount);
  }, [filteredSpecialties, visibleCount]);

  const handleClear = () => {
    resetDirectSearch();
  };

  return (
    <div className="direct-search-page">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Container */}
      <main className="direct-container">
        <div className="direct-hero">
          <h1 className="direct-title">전체 군사특기 검색</h1>
          <p className="direct-subtitle">
            특기명이나 특기번호로 검색해요.
          </p>
        </div>

        {/* 3. Live Search Input Box */}
        <div className="direct-search-box">
          <span className="direct-search-icon">🔍</span>
          <input
            type="text"
            className="direct-search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="특기명이나 특기번호 입력"
          />
          {keyword && (
            <button 
              type="button" 
              className="direct-clear-btn" 
              onClick={handleClear}
              title="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>

        {/* 4. Recruitment Type Filter Tabs */}
        <div className="direct-filter-tabs">
          {RECRUITMENT_TYPES.map(type => (
            <button
              key={type}
              type="button"
              className={`direct-tab-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 5. Live Search Results Section */}
        {isLoadingData ? (
          <div className="direct-empty-state">
            <div className="loading-state" style={{ padding: '24px 0' }}>
              <div className="glyph">●</div>
              <p>전체 군사특기 목록을 서버에서 불러오는 중입니다...</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="direct-results-meta">
              <span className="direct-results-count">
                {keyword ? (
                  <>
                    "<b>{keyword}</b>" 검색 결과 <b>{filteredSpecialties.length}</b>건
                  </>
                ) : (
                  <>
                    {selectedType === '전체' ? '전체 군사특기' : selectedType} <b>{filteredSpecialties.length}</b>개
                  </>
                )}
                {selectedType !== '전체' && keyword && ` · ${selectedType}`}
              </span>
              {keyword && (
                <button 
                  type="button"
                  className="link-btn"
                  onClick={handleClear}
                  style={{ fontSize: '12px' }}
                >
                  초기화
                </button>
              )}
            </div>

            {displayList.length > 0 ? (
              <div 
                className="direct-results-list"
                onClickCapture={() => {
                  saveScrollY(window.scrollY);
                }}
              >
                {displayList.map((item, idx) => (
                  <ResultCard key={item.specialty_code || idx} result={item} />
                ))}

                {filteredSpecialties.length > displayList.length && (
                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button 
                      type="button"
                      className="landing-btn-secondary"
                      style={{ padding: '12px 28px', fontSize: '14px' }}
                      onClick={() => setVisibleCount(prev => prev + 40)}
                    >
                      특기 더 보기 (+{filteredSpecialties.length - displayList.length}건 남음)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="direct-empty-state">
                <div className="direct-empty-icon">📂</div>
                <h3 className="direct-empty-title">검색된 군사특기가 없습니다</h3>
                <p className="direct-empty-desc">
                  {keyword ? `'${keyword}'에 해당하는 군사특기를 찾지 못했어요.` : '해당 분류에 등록된 군사특기가 없습니다.'}<br />
                  검색어를 다시 한 번 확인시거나 필터를 '전체'로 변경해보세요.
                </p>
                {selectedType !== '전체' && (
                  <button 
                    type="button" 
                    className="landing-btn-secondary" 
                    style={{ padding: '10px 20px', fontSize: '14px' }}
                    onClick={() => setSelectedType('전체')}
                  >
                    전체 모집구분에서 찾기
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
