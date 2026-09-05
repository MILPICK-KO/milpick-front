import { useState, useRef, useEffect } from 'react';
import { useNavigationType } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { ResultCard } from '../components/ResultCard';
import { Footer } from '../components/Footer';
import { config } from '../utils/config';

const API_BASE_URL = config.API_BASE_URL;

export function SearchPage() {
  const {
    setApiError, apiError,
    allFields, commonExclusions,
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
  } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const GENERAL_SUB_TYPES = ['기술행정병', '전문특기병', '취업맞춤특기병'];
  const SPECIAL_REC_TYPES = ['어학병', '카투사'];
  const REC_TYPE_INFO = {
    '전체': {
      detail: '어학병, 카투사를 제외한 전체 모집분류에서 검색해요.'
    },
    '기술행정병': {
      summary: '자신의 학과나 자격증과 관련된 임무를 수행해요.',
      detail: '본인이 보유한 자격증, 면허, 전공학과 등을 바탕으로 지원할 수 있어요.전문특기병만큼 선발이 까다롭진 않지만, 일부 특기는 전공뿐만 아니라 자격증을 요구하기도 해요.'
    },
    '전문특기병': {
      summary: '해당 분야에 대한 고도의 임무를 수행해요.',
      detail: '자격증이나 지원 분야와 관련된 전공을 필요로 하는 고도의 전문 임무를 수행해요. 선발 과정에 시험과 면접이 포함될 수 있어요.'
    },
    '취업맞춤특기병': {
      summary: '기술훈련을 받고 해당 분야의 기술병으로 복무해요.',
      detail: '고졸 이하자 등이 입대 전 본인의 적성에 맞는 기술훈련을 받고 이와 연계된 분야의 기술병으로 복무하는 제도에요. 이를 통해 취업 등 안정적인 사회진출을 지원해요.'
    },
    '어학병': {
      summary: '어학 지식을 바탕으로 한 임무를 수행해요.',
      detail: '대한민국 육군 내의 외국어 통역, 번역 및 외국어를 수반한 행정업무를 수행해요.해당 언어에 대한 자격증, 전공 혹은 유학 경험을 요구해요.'
    },
    '카투사': {
      summary: '미군과 같이 복무해요.',
      detail: '카투사는 미8군에 증강된 한국군 육군 요원(한국군지원단 소속)으로 한미연합 관련 임무를 수행해요. 영어 어학성적이 있어야만 지원이 가능해요.'
    }
  };

  const resetConditions = () => {
    // 2단계 (분야/전공) 초기화
    setMajorInput('');
    setRecommendedFields([]);
    setSelectedFields([]);
    setHasSearchedMajor(false);
    setShowAllFields(false);

    // 3단계 (신체조건/제외조건) 초기화
    setHeight('');
    setWeight('');
    setGrade('');
    setVision('');
    setExcludeInput('');
    setExcludeList([]);
    setShowCommonExclusions(false);

    // 검색 결과 및 단계 잠금 초기화
    setSearchResults([]);
    setHasSearched(false);
    setResultTab('전체');
    setSearchedRelation('none');
    setUnlockedStep(1);
  };

  const cascadeTimers = useRef([]);

  const clearCascadeTimers = () => {
    cascadeTimers.current.forEach(t => clearTimeout(t));
    cascadeTimers.current = [];
  };

  useEffect(() => {
    return () => clearCascadeTimers();
  }, []);

  const toggleRecType = (type) => {
    clearCascadeTimers();
    resetConditions();

    if (type === '어학병' || type === '카투사') {
      if (recruitmentTypes.includes(type)) {
        setRecruitmentTypes([]);
      } else {
        setRecruitmentTypes([type]);
      }
      return;
    }

    if (type === '전체') {
      const isCurrentlyAll = recruitmentTypes.includes('전체') || 
        GENERAL_SUB_TYPES.every(t => recruitmentTypes.includes(t));

      if (isCurrentlyAll) {
        setRecruitmentTypes([]);
      } else {
        // 전체 먼저 선택 후, 기행병 -> 전특병 -> 취맞특병 순차적으로 선택되는 캐스케이드 모션
        setRecruitmentTypes(['전체']);

        const t1 = setTimeout(() => {
          setRecruitmentTypes(['전체', '기술행정병']);
        }, 60);

        const t2 = setTimeout(() => {
          setRecruitmentTypes(['전체', '기술행정병', '전문특기병']);
        }, 130);

        const t3 = setTimeout(() => {
          setRecruitmentTypes(['전체', '기술행정병', '전문특기병', '취업맞춤특기병']);
        }, 200);

        cascadeTimers.current = [t1, t2, t3];
      }
    } else {
      let currentSub = recruitmentTypes.filter(t => GENERAL_SUB_TYPES.includes(t));
      if (currentSub.includes(type)) {
        currentSub = currentSub.filter(t => t !== type);
      } else {
        currentSub = [...currentSub, type];
      }

      if (currentSub.length === 0) {
        setRecruitmentTypes([]);
      } else if (GENERAL_SUB_TYPES.every(t => currentSub.includes(t))) {
        setRecruitmentTypes(['전체', ...GENERAL_SUB_TYPES]);
      } else {
        setRecruitmentTypes(currentSub);
      }
    }
  };

  // Local UI states
  const [showAllFields, setShowAllFields] = useState(false);
  const [showCommonExclusions, setShowCommonExclusions] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPsychTooltip, setShowPsychTooltip] = useState(false);
  const isSpecialRecType = recruitmentTypes.length === 1 && (recruitmentTypes[0] === '어학병' || recruitmentTypes[0] === '카투사');
  
  useEffect(() => {
    if (recruitmentTypes.length === 0) {
      setUnlockedStep(1);
    }
  }, [recruitmentTypes]);

  const showStep2 = unlockedStep >= 2 && !isSpecialRecType;
  const showStep3 = unlockedStep >= 3 || (unlockedStep >= 2 && isSpecialRecType);

  const step2Ref = useRef(null);
  const step3Ref = useRef(null);

  const isInitialMount = useRef(true);
  const navType = useNavigationType();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (navType === 'POP') {
      return;
    }

    if (unlockedStep === 2 && showStep2) {
      if (step2Ref.current) setTimeout(() => step2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else if (showStep3 && (unlockedStep === 3 || (unlockedStep === 2 && isSpecialRecType))) {
      if (step3Ref.current) setTimeout(() => step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [unlockedStep, showStep2, showStep3, isSpecialRecType, navType]);

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!majorInput.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/search/recommend?major=${encodeURIComponent(majorInput)}`);
      const data = await res.json();
      setRecommendedFields(data.recommended_fields || []);
      setHasSearchedMajor(true);
    } catch (err) {
      console.error(err);
      setApiError(true);
    }
  };

  const toggleField = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const toggleExclude = (cond) => {
    if (excludeList.includes(cond)) {
      setExcludeList(excludeList.filter(c => c !== cond));
    } else {
      setExcludeList([...excludeList, cond]);
    }
  };

  const togglePsychologicalCheck = () => {
    const psychCond = commonExclusions.find(c => c.replace(/\s+/g, '') === '2차심리검사') || '2차심리검사';
    const isChecked = excludeList.some(c => c.replace(/\s+/g, '') === '2차심리검사');
    if (isChecked) {
      setExcludeList(excludeList.filter(c => c.replace(/\s+/g, '') !== '2차심리검사'));
    } else {
      setExcludeList([...excludeList, psychCond]);
    }
  };

  const handleSearch = async (relationType = 'direct') => {
    const isSpecial = isSpecialRecType || recruitmentTypes.includes('어학병') || recruitmentTypes.includes('카투사');
    if (!isSpecial && selectedFields.length === 0 && excludeList.length === 0) {
      alert("검색하려면 최소 하나 이상의 '분야' 또는 '제외 조건'을 선택해야 합니다.");
      return;
    }

    setHasSearched(true);
    const requestBody = {};
    if (selectedFields.length > 0) requestBody.field = selectedFields;
    if (excludeList.length > 0) requestBody.exclude = excludeList;
    if (height) requestBody.height = Number(height);
    if (weight) requestBody.weight = Number(weight);
    if (grade) requestBody.physical_grade = Number(grade);
    if (vision) requestBody.vision = Number(vision);

    if (recruitmentTypes.includes('전체')) {
      requestBody.recruitment_type = ['기술행정병', '전문특기병', '취업맞춤특기병'];
    } else if (recruitmentTypes.length > 0) {
      requestBody.recruitment_type = recruitmentTypes;
    }

    requestBody.relation_type = relationType;

    try {
      const res = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }
      
      const data = await res.json();
      
      const mappedData = (data || []).map(item => ({
        ...item,
        _match_type: relationType
      }));

      if (relationType === 'direct') {
        setSearchResults(mappedData);
        setSearchedRelation('direct');
        setResultTab('전체');
      } else if (relationType === 'indirect') {
        // 간접분야 검색 시 기존 검색결과 아래에 이어붙임
        setSearchResults(prev => [...prev, ...mappedData]);
        setSearchedRelation('all');
      }

      setApiError(false);
    } catch (err) {
      console.error(err);
      alert("검색 중 오류가 발생했습니다: " + err.message);
    }
  };

  const renderSelectedSummary = () => {
    if (recruitmentTypes.length === 0 && selectedFields.length === 0 && excludeList.length === 0 && !height && !weight && !grade && !vision) {
      return null;
    }
    return (
      <div className="selected-summary">
        <strong>검색 조건:</strong>
        {recruitmentTypes.length > 0 && (
          <span> 모집분류({recruitmentTypes.includes('전체') ? '전체' : recruitmentTypes.join(', ')})</span>
        )}
        {selectedFields.length > 0 && <span> 분야({selectedFields.join(', ')})</span>}
        {excludeList.length > 0 && <span> 제외({excludeList.join(', ')})</span>}
        {height && <span> 신장({height}cm)</span>}
        {weight && <span> 체중({weight}kg)</span>}
        {grade && <span> 신체등급({grade}급)</span>}
        {vision && <span> (교정)시력({vision})</span>}
      </div>
    );
  };

  const availableTabs = ['전체', ...Array.from(new Set(searchResults.map(r => r.recruitment_type)))];
  
  const filteredResults = resultTab === '전체' 
    ? searchResults 
    : searchResults.filter(r => r.recruitment_type === resultTab);

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <h1 
            className="brand" 
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = config.LINK}
          >
            MIL<span>PICK</span>
          </h1>
          <p className="tagline">가장 스마트한 군사특기 찾기</p>
        </div>
      </header>

      <div className="wrap">
        {apiError && (
          <div className="banner error">
            <i className="dot"></i>
            <span>서버에 연결할 수 없습니다.</span>
          </div>
        )}

        {/* STEP 1: 모집분류 선택 */}
        <section className="step panel" style={{ padding: '24px' }}>
          <div className="step-head" style={{ marginBottom: "16px" }}>
            <span className="step-num">01</span>
            <span className="step-title">모집분류 선택</span>
          </div>
          
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 상위: 일반 기술·특기병 (전체) */}
            <div 
              className={`rec-type-card ${recruitmentTypes.includes('전체') ? 'selected' : ''}`}
              onClick={() => toggleRecType('전체')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '18px 20px',
                background: recruitmentTypes.includes('전체') ? 'var(--brass-bg)' : 'transparent',
                borderRadius: '16px',
                border: recruitmentTypes.includes('전체') ? '2px solid var(--brass)' : '1px solid var(--border)',
                boxShadow: recruitmentTypes.includes('전체') ? '0 4px 12px rgba(156, 122, 30, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <button 
                type="button" 
                className={`chip ${recruitmentTypes.includes('전체') ? 'selected' : ''}`}
                style={{ pointerEvents: 'none', margin: 0, flexShrink: 0, marginRight: '16px', fontWeight: '600' }}
              >
                전체
              </button>
              <div className="rec-card-content">
                <div style={{ fontSize: '13.5px', color: 'var(--text-dim)', lineHeight: '1.45', wordBreak: 'keep-all' }}>
                  {REC_TYPE_INFO['전체'].detail}
                </div>
              </div>
            </div>

            {/* 하위 세부 선택 항목 (전체 하위 위계 트리) */}
            <div className={`rec-sub-tree ${recruitmentTypes.includes('전체') ? 'all-selected' : ''}`}>
              {GENERAL_SUB_TYPES.map(type => (
                <div 
                  key={type}
                  className={`rec-type-card ${recruitmentTypes.includes(type) ? 'selected' : ''}`}
                  onClick={() => toggleRecType(type)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: recruitmentTypes.includes(type) ? 'var(--brass-bg)' : 'transparent',
                    borderRadius: '14px',
                    border: recruitmentTypes.includes(type) ? '2px solid var(--brass)' : '1px solid var(--border)',
                    boxShadow: recruitmentTypes.includes(type) ? '0 4px 12px rgba(156, 122, 30, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <button 
                    type="button" 
                    className={`chip ${recruitmentTypes.includes(type) ? 'selected' : ''}`}
                    style={{ pointerEvents: 'none', margin: 0, flexShrink: 0, marginRight: '16px', textAlign: 'center', lineHeight: '1.35' }}
                  >
                    {type === '취업맞춤특기병' ? (
                      <>취업맞춤<span className="mobile-br"><br /></span>특기병</>
                    ) : type}
                  </button>
                  <div className="rec-card-content">
                    <div className="rec-card-summary">
                      {REC_TYPE_INFO[type].summary}
                    </div>
                    <div className="rec-card-detail">
                      {REC_TYPE_INFO[type].detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {SPECIAL_REC_TYPES.map(type => (
              <div 
                key={type}
                className={`rec-type-card ${recruitmentTypes.includes(type) ? 'selected' : ''}`}
                onClick={() => toggleRecType(type)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  background: recruitmentTypes.includes(type) ? 'var(--match-bg)' : 'transparent',
                  borderRadius: '16px',
                  border: recruitmentTypes.includes(type) ? '2px solid var(--match)' : '1px solid var(--border)',
                  boxShadow: recruitmentTypes.includes(type) ? '0 4px 12px rgba(46, 92, 59, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <button
                  type="button"
                  className={`chip ${recruitmentTypes.includes(type) ? 'selected' : ''}`}
                  style={{
                    pointerEvents: 'none', 
                    margin: 0, 
                    flexShrink: 0,
                    marginRight: '16px',
                    border: '1px solid var(--primary)',
                    fontWeight: '600'
                  }}
                >
                  {type}
                </button>
                <div className="rec-card-content">
                  <div className="rec-card-summary">
                    {REC_TYPE_INFO[type].summary}
                  </div>
                  <div className="rec-card-detail">
                    {REC_TYPE_INFO[type].detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
            
            {unlockedStep === 1 && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="search-cta" 
                  style={{ width: 'auto', padding: '12px 32px', margin: 0, opacity: recruitmentTypes.length > 0 ? 1 : 0.5, cursor: recruitmentTypes.length > 0 ? 'pointer' : 'not-allowed' }}
                  onClick={() => {
                    if (recruitmentTypes.length > 0) setUnlockedStep(2);
                  }}
                  disabled={recruitmentTypes.length === 0}
                >
                  다음
                </button>
              </div>
            )}
        </section>

        {/* STEP 2: 분야 선택 */}
        {showStep2 && (
          <section className="step panel" ref={step2Ref} style={{ padding: '24px' }}>
            <div className="step-head" style={{ marginBottom: "16px" }}>
              <span className="step-num">02</span>
              <span className="step-title">분야 선택</span>
            </div>
            
            <p className="step-desc">전공을 입력해 관심 분야를 추천받아요.</p>
            <div>
              <form className="major-form" onSubmit={handleRecommend} style={{ marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="" 
                  value={majorInput}
                  onChange={(e) => setMajorInput(e.target.value)}
                  autoComplete="off"
                />
                <button type="submit">추천받기</button>
              </form>

              <div className="chip-row">
                {recommendedFields.length === 0 && selectedFields.length === 0 && hasSearchedMajor && (
                  <span className="chip-empty">검색된 관련 분야가 없어요.</span>
                )}
                {Array.from(new Set([...recommendedFields, ...selectedFields])).map(field => (
                  <button 
                    key={field} 
                    className={`chip ${selectedFields.includes(field) ? 'selected' : ''}`}
                    onClick={() => toggleField(field)}
                  >
                    {field} {selectedFields.includes(field) ? '✕' : ''}
                  </button>
                ))}
              </div>
              
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-dim)', marginBottom: '0px' }}>
                  마음에 드는 관심 분야가 없나요?
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowAllFields(!showAllFields)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    padding: '4px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--text)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                  전체 분야 목록 {showAllFields ? '접기' : '보기'} 
                  <span style={{ 
                    fontSize: '10px',
                    transform: showAllFields ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }}>▼</span>
                </button>
              </div>
              
              {showAllFields && (
                <div className="chip-box open">
                  <div className="chip-row">
                    {allFields.map(field => (
                      <button 
                        key={field} 
                        className={`chip ${selectedFields.includes(field) ? 'selected' : ''}`}
                        onClick={() => toggleField(field)}
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {unlockedStep === 2 && (
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="search-cta" 
                    style={{ width: 'auto', padding: '12px 32px', margin: 0, opacity: (selectedFields.length > 0 || hasSearchedMajor) ? 1 : 0.5, cursor: (selectedFields.length > 0 || hasSearchedMajor) ? 'pointer' : 'not-allowed' }}
                    onClick={() => {
                      if (selectedFields.length > 0 || hasSearchedMajor) setUnlockedStep(3);
                    }}
                    disabled={!(selectedFields.length > 0 || hasSearchedMajor)}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* STEP 3: 제외 및 신체 조건 */}
        {showStep3 && (
          <section className="step panel" ref={step3Ref} style={{ padding: '24px' }}>
            <div className="step-head" style={{ marginBottom: "16px" }}>
              <span className="step-num">03</span>
              <span className="step-title">신체 조건</span>
            </div>
            
                <div>
            {/* 신체 조건 */}
            <p className="step-desc">입영판정검사를 이미 받았다면 검사 결과를 아래에 입력하세요.
              <br/>만약 입영판정검사를 받기 전이라면, 빈 칸으로 남겨둬도 돼요.</p>
            <div className="cond-grid">
              <div className="cond-field">
                <label htmlFor="height-input">신장 (cm)</label>
                <input type="number" id="height-input"value={height} onChange={e => setHeight(e.target.value)} />
              </div>
              <div className="cond-field">
                <label htmlFor="weight-input">체중 (kg)</label>
                <input type="number" id="weight-input" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              <div className="cond-field">
                <label htmlFor="vision-input">(교정)시력</label>
                <input type="number" id="vision-input" value={vision} onChange={e => setVision(e.target.value)} />
              </div>
              <div className="cond-field">
                <label htmlFor="grade-input">신체 등급</label>
                <input type="number" id="grade-input" min="1" max="7" value={grade} onChange={e => setGrade(e.target.value)} />
              </div>
            </div>

            {/* 2차 심리검사 등 정밀검사 여부 체크박스 */}
            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center' }}>
              <label 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text)',
                  lineHeight: '1.4'
                }}
              >
                <input 
                  type="checkbox"
                  checked={excludeList.some(c => c.replace(/\s+/g, '') === '2차심리검사')}
                  onChange={togglePsychologicalCheck}
                  style={{ 
                    width: '18px', 
                    height: '18px', 
                    accentColor: 'var(--brass)', 
                    cursor: 'pointer',
                    margin: 0
                  }}
                />
                <span>2차 심리검사 등 정밀검사를 받으셨나요?</span>
              </label>

              <div style={{ position: 'relative', display: 'inline-block', marginLeft: '6px' }}>
                <button 
                  type="button"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-dim)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'help',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  onMouseEnter={() => setShowPsychTooltip(true)}
                  onMouseLeave={() => setShowPsychTooltip(false)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPsychTooltip(prev => !prev);
                  }}
                >
                  ?
                </button>
                
                {showPsychTooltip && (
                  <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--text)',
                    color: 'var(--bg)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    width: '260px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    textAlign: 'left',
                    wordBreak: 'keep-all'
                  }}>
                    1차 검사에서 추가 확인이 필요한 사람을 대상으로 임상심리사가 진행하는 심층 면담 및 검사를 말해요.<br/>기억이 나지 않는다면 체크하지 않아도 돼요.
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '6px',
                      borderStyle: 'solid',
                      borderColor: 'var(--text) transparent transparent transparent'
                    }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }}></div>

            {/* 제외 조건 칩 (2차 심리검사 제외) */}
            <div className="chip-row">
              {excludeList.filter(cond => cond.replace(/\s+/g, '') !== '2차심리검사').map(cond => (
                <button 
                  key={cond} 
                  className="chip selected"
                  onClick={() => toggleExclude(cond)}
                >
                  {cond} ✕
                </button>
              ))}
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => setShowCommonExclusions(!showCommonExclusions)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  padding: '4px 16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--text)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
              >
                따로 알고 있는 질환이 있나요? {showCommonExclusions ? '접기' : '보기'} 
                <span style={{ 
                  fontSize: '10px',
                  transform: showCommonExclusions ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}>▼</span>
              </button>
            </div>
            
            {showCommonExclusions && (
              <div className="chip-box open">
                <div className="chip-row">
                  {commonExclusions.filter(cond => cond.replace(/\s+/g, '') !== '2차심리검사').map(cond => (
                    <button 
                      key={cond} 
                      className={`chip ${excludeList.includes(cond) ? 'selected' : ''}`}
                      onClick={() => toggleExclude(cond)}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            )}
                        </div>
          </section>
        )}

        {showStep3 && (
          <button className="search-cta" onClick={() => handleSearch('direct')}>특기 검색</button>
        )}
        
        {renderSelectedSummary()}

        {/* RESULTS */}
        <section id="results-section" className={hasSearched ? "open" : ""}>
          {hasSearched && (
            <>
              <div className="results-meta">
                <div className="results-count">결과 <b>{filteredResults.length}</b>건</div>
              </div>

              {/* Tabs for Recruitment Types */}
              {availableTabs.length > 1 && (
                <div className="tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {availableTabs.map(type => (
                    <button
                      key={type}
                      className={`chip ${resultTab === type ? 'selected' : ''}`}
                      onClick={() => setResultTab(type)}
                      style={{ flexShrink: 0 }}
                      type="button"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          
          <div id="results-body">
            {filteredResults.map((result, idx) => (
              <ResultCard key={result.specialty_code + idx} result={result} />
            ))}
          </div>
          
          {hasSearched && searchedRelation === 'direct' && (
            <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => handleSearch('indirect')}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '12px 24px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--surface-2)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                마음에 드는 특기가 없나요? 간접관련분야 검색하기 →
              </button>
              
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  type="button"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-dim)',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'help',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  ?
                </button>
                
                {showTooltip && (
                  <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--text)',
                    color: 'var(--bg)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    width: '240px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    textAlign: 'left'
                  }}>
                    선택한 관심분야와 직접적인 관련은 없지만 간접적으로 관련이 있는 군사특기도 검색해볼 수 있어요.
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '6px',
                      borderStyle: 'solid',
                      borderColor: 'var(--text) transparent transparent transparent'
                    }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

      </div>

      <Footer />
    </>
  );
}
