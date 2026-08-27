import { useState, useEffect } from 'react';
import './milpick.css';

const API_BASE_URL = 'http://api.milpick.flyahn06.com:8080';

function App() {
  const [apiStatus, setApiStatus] = useState('API 연결 확인 중…');
  const [apiError, setApiError] = useState(false);

  // Form states
  const [majorInput, setMajorInput] = useState('');
  const [recommendedFields, setRecommendedFields] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [showAllFields, setShowAllFields] = useState(false);

  const [excludeInput, setExcludeInput] = useState('');
  const [excludeList, setExcludeList] = useState([]);
  const [commonExclusions, setCommonExclusions] = useState([]);
  const [showCommonExclusions, setShowCommonExclusions] = useState(false);

  const [height, setHeight] = useState('');
  const [grade, setGrade] = useState('');
  const [vision, setVision] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Initialize API check & load initial data
  useEffect(() => {
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

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!majorInput.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/search/recommend?major=${encodeURIComponent(majorInput)}`);
      const data = await res.json();
      setRecommendedFields(data.recommended_fields || []);
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

  const handleAddExclude = () => {
    if (excludeInput.trim() && !excludeList.includes(excludeInput.trim())) {
      setExcludeList([...excludeList, excludeInput.trim()]);
      setExcludeInput('');
    }
  };

  const toggleExclude = (cond) => {
    if (excludeList.includes(cond)) {
      setExcludeList(excludeList.filter(c => c !== cond));
    } else {
      setExcludeList([...excludeList, cond]);
    }
  };

  const handleSearch = async () => {
    setHasSearched(true);
    const requestBody = {};
    if (selectedFields.length > 0) requestBody.field = selectedFields;
    if (excludeList.length > 0) requestBody.exclude = excludeList;
    if (height) requestBody.height = Number(height);
    if (grade) requestBody.physical_grade = Number(grade);
    if (vision) requestBody.vision = Number(vision);

    try {
      const res = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error(err);
      setApiError(true);
    }
  };

  const renderSelectedSummary = () => {
    if (selectedFields.length === 0 && excludeList.length === 0 && !height && !grade && !vision) {
      return null;
    }
    return (
      <div className="selected-summary">
        <strong>검색 조건:</strong>
        {selectedFields.length > 0 && <span> 분야({selectedFields.join(', ')})</span>}
        {excludeList.length > 0 && <span> 제외({excludeList.join(', ')})</span>}
        {height && <span> 신장({height}cm 이하/이상)</span>}
        {grade && <span> 신체등급({grade}급 이하)</span>}
        {vision && <span> 시력({vision} 이하)</span>}
      </div>
    );
  };

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow"><span className="tick"></span>전공 → 특기 매칭</div>
          <h1 className="brand">MIL<span>PICK</span></h1>
          <p className="tagline">전공을 입력하면 지원 가능한 군 특기를 찾아 드립니다.</p>

          <form className="major-form" onSubmit={handleRecommend}>
            <input 
              type="text" 
              placeholder="전공을 입력하세요 (예: 소프트웨어공학)" 
              value={majorInput}
              onChange={(e) => setMajorInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit">추천받기</button>
          </form>

          <div className="hero-hint">전공을 입력하면 관련 키워드를 자동으로 추천합니다</div>
        </div>
      </header>

      <div className="wrap">
        {apiError && (
          <div className="banner error">
            <i className="dot"></i>
            <span>서버에 연결할 수 없습니다. 서버가 켜져 있는지 확인한 뒤 새로고침 해주세요.</span>
          </div>
        )}

        {/* STEP 1: 분야 선택 */}
        <section className="step">
          <div className="step-head">
            <span className="step-num">01</span>
            <span className="step-title">분야 선택</span>
          </div>
          <p className="step-desc">추천된 키워드 중 관심 있는 분야를 선택하세요. 전체 목록에서 직접 고를 수도 있습니다.</p>
          <div className="panel">
            <div className="chip-row">
              {recommendedFields.length === 0 ? (
                <span className="chip-empty">전공을 입력하면 추천 키워드가 여기에 표시됩니다</span>
              ) : (
                recommendedFields.map(field => (
                  <button 
                    key={field} 
                    className={`chip ${selectedFields.includes(field) ? 'selected' : ''}`}
                    onClick={() => toggleField(field)}
                  >
                    {field}
                  </button>
                ))
              )}
            </div>
            
            <button 
              className="link-btn" 
              type="button" 
              onClick={() => setShowAllFields(!showAllFields)}
            >
              전체 분야 목록에서 선택 {showAllFields ? '▴' : '▾'}
            </button>
            
            {showAllFields && (
              <div className="chip-box">
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
          </div>
        </section>

        {/* STEP 2: 제외 조건 */}
        <section className="step">
          <div className="step-head">
            <span className="step-num">02</span>
            <span className="step-title">제외 조건</span>
          </div>
          <p className="step-desc">본인에게 해당하는 기피·결격 조건을 추가하거나 목록에서 선택하세요.</p>
          <div className="panel">
            <div className="tag-input-row">
              <input 
                type="text" 
                placeholder="직접 입력 후 Enter (예: 색각이상)" 
                value={excludeInput}
                onChange={(e) => setExcludeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddExclude()}
                autoComplete="off"
              />
              <button type="button" onClick={handleAddExclude}>추가</button>
            </div>
            
            <div className="chip-row">
              {excludeList.length === 0 ? (
                <span className="chip-empty">추가한 제외 조건이 여기에 표시됩니다</span>
              ) : (
                excludeList.map(cond => (
                  <button 
                    key={cond} 
                    className="chip selected"
                    onClick={() => toggleExclude(cond)}
                  >
                    {cond} ✕
                  </button>
                ))
              )}
            </div>

            <button 
              className="link-btn" 
              type="button" 
              onClick={() => setShowCommonExclusions(!showCommonExclusions)}
            >
              자주 찾는 제외 조건 목록에서 선택 {showCommonExclusions ? '▴' : '▾'}
            </button>
            
            {showCommonExclusions && (
              <div className="chip-box">
                <div className="chip-row">
                  {commonExclusions.map(cond => (
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

        {/* STEP 3: 신체 조건 */}
        <section className="step">
          <div className="step-head">
            <span className="step-num">03</span>
            <span className="step-title">신체 조건 (선택)</span>
          </div>
          <p className="step-desc">입력한 값을 넘어서는 요건의 특기는 결과에서 자동으로 제외됩니다.</p>
          <div className="panel">
            <div className="cond-grid">
              <div className="cond-field">
                <label htmlFor="height-input">신장 (cm)</label>
                <input type="number" id="height-input" placeholder="175" value={height} onChange={e => setHeight(e.target.value)} />
              </div>
              <div className="cond-field">
                <label htmlFor="grade-input">신체 등급</label>
                <input type="number" id="grade-input" placeholder="1–4" min="1" max="4" value={grade} onChange={e => setGrade(e.target.value)} />
              </div>
              <div className="cond-field">
                <label htmlFor="vision-input">시력</label>
                <input type="number" id="vision-input" placeholder="0.8" step="0.1" value={vision} onChange={e => setVision(e.target.value)} />
              </div>
            </div>
            <p className="cond-note">비워두면 해당 조건은 검색에 반영하지 않습니다.</p>
          </div>
        </section>

        <button className="search-cta" onClick={handleSearch}>특기 검색</button>
        
        {renderSelectedSummary()}

        {/* RESULTS */}
        <section id="results-section">
          {hasSearched && (
            <div className="results-meta">
              <div className="results-count">결과 {searchResults.length}건</div>
            </div>
          )}
          
          <div id="results-body">
            {searchResults.map((result, idx) => (
              <div key={result.specialty_code + idx} className="result-card">
                <div className="result-header">
                  <span className="specialty-code">{result.specialty_code}</span>
                  <h3 className="specialty-name">{result.specialty_name}</h3>
                  <span className="badge recruitment-type">{result.recruitment_type}</span>
                </div>
                <p className="duty-desc">{result.duty_description}</p>
                
                <div className="result-details">
                  <div className="detail-row">
                    <span className="label">지원요건</span> 
                    <span className="desc">{result.qualification_description}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">신체조건</span> 
                    <span className="desc">{result.physical_condition_raw}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">관련자격</span> 
                    <span className="desc">{result.certifications}</span>
                  </div>
                </div>
                
                {['전문특기병', '어학병', '카투사'].includes(result.recruitment_type) && (
                  <div className="alert warning special-req-alert" style={{display: 'block'}}>
                    <strong>안내:</strong> 해당 특기는 신체조건 외에도 실기/면접이나 특수 자격요건(단증, 어학점수 등)이 필요할 수 있으니 병무청 모집요강을 반드시 추가로 확인하세요.
                  </div>
                )}
                
                {result.major_required === 1 && (
                  <div className="alert danger major-req-alert" style={{display: 'block'}}>
                    <strong>주의:</strong> 전공 필수 특기입니다. 본인의 전공과 무관할 경우 관련 자격증을 별도로 취득해야 지원이 가능합니다.
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      <footer>
        <span>MILPICK</span>
        <span>{apiStatus}</span>
      </footer>
    </>
  );
}

export default App;
