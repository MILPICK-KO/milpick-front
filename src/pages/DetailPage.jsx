import { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatText } from '../utils/formatters';
import { Footer } from '../components/Footer';

const renderDutyDescription = (text) => {
  if (!text) return '없음';
  const formatted = text.replace(/(^|\s)ㅇ/g, '$1• ');
  const lines = formatted.split('\n');
  const firstIndex = lines.findIndex(line => line.trim().length > 0);

  return lines.map((line, i) => (
    <span key={i}>
      {i === firstIndex ? <strong>{line}</strong> : line}
      <br />
    </span>
  ));
};

export function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.specialty;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <header className="hero" style={{ padding: '40px 20px', minHeight: 'auto' }}>
        <div className="hero-inner" style={{ textAlign: 'left' }}>
           <button 
             onClick={() => navigate(-1)} 
             className="link-btn"
             style={{ marginBottom: '20px', display: 'inline-block' }}
           >
             ← 뒤로 가기
           </button>
           <div className="eyebrow"><span className="tick"></span>상세 정보</div>
           <h2 className="brand" style={{ fontSize: '28px', marginTop: '10px' }}>{result.specialty_name}</h2>
        </div>
      </header>
      <div className="wrap">
          <div className="result-card" style={{ cursor: 'default', borderBottom: 'none' }}>
              <div className="rec-type">{result.recruitment_type}</div>
              <div className="row-top">
                <h3 className="spec-name">{result.specialty_name}</h3>
                <span className="spec-code">{result.specialty_code}</span>
              </div>
              
              <div className="fields-row">
                <span className="field-pill">{result.category}</span>
              </div>
              
              <div className="category-group" style={{ marginTop: '32px', marginBottom: '24px' }}>
                <div className="category-label">하는 일</div>
                <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text)' }}>
                  {renderDutyDescription(result.duty_description)}
                </div>
              </div>

              <div className="category-group" style={{ marginBottom: '24px' }}>
                <div className="category-label">지원요건</div>
                <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text)' }}>
                  {formatText(result.qualification_description)}
                </div>
              </div>

              <div className="category-group" style={{ marginBottom: '24px' }}>
                <div className="category-label">신체조건</div>
                <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text)' }}>
                  {formatText(result.physical_condition_raw)}
                </div>
              </div>

              <div className="category-group" style={{ marginBottom: '24px' }}>
                <div className="category-label">관련자격</div>
                <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text)' }}>
                  {formatText(result.certifications)}
                </div>
              </div>
              
              {['전문특기병', '어학병', '카투사'].includes(result.recruitment_type) && (
                <div className="warn special" style={{ marginTop: '10px' }}>
                  <span className="mark">안내</span> 해당 특기는 실기/면접이나 특수 자격요건이 필요할 수 있어요. 병무청 모집요강을 반드시 추가로 확인하세요.
                </div>
              )}

              {result.recruitment_type == "취업맞춤특기병" && (
                <div className="warn school" style={{ marginTop: '10px' }}>
                  <span className="mark">안내</span> 해당 특기는 고등학교 졸업이하 학력 또는 교육부장관이 인정하는 동등 학력을 소지한 사람만 지원할 수 있어요. 자세한 내용은 병무청 모집요강을 확인하세요.
                </div>
              )}
              
              {result.major_required === 1 && (
                <div className="warn major" style={{ marginTop: '10px' }}>
                  <span className="mark">주의</span> 이 특기는 관련 분야 전공자만 지원이 가능해요. 본인의 전공과 무관할 경우 관련 자격증을 별도로 취득해야 할 수 있어요.
                </div>
              )}
          </div>
      </div>

      <Footer />
    </>
  );
}
