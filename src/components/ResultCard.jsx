import { useNavigate } from 'react-router-dom';
import { formatText } from '../utils/formatters';

export function ResultCard({ result }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/detail/${result.specialty_code}`, { state: { specialty: result } });
  };

  return (
    <div 
      className="result-card" 
      style={{ cursor: 'pointer', transition: '0.2s', borderBottom: '2px solid var(--brass)' }}
      onClick={handleClick}
    >
      <div className="rec-type">{result.recruitment_type}</div>
      <div className="row-top">
        <h3 className="spec-name">{result.specialty_name}</h3>
        <span className="spec-code">{result.specialty_code}</span>
      </div>
      
      <div className="fields-row">
        <span className="field-pill">{result.category}</span>
        {result._match_type === 'indirect' && (
          <span className="field-pill indirect" style={{ marginLeft: '6px' }}>간접관련분야</span>
        )}
      </div>
      
      <div className="cert-row">
        <b>임무요약</b>
        <div style={{ marginTop: '6px', color: 'var(--text-dim)', lineHeight: '1.5' }}>
          {(result.duty_description || '').split('\n').find(line => line.trim().length > 0)?.replace(/(^|\s)ㅇ/g, '$1• ') || '-'}
        </div>
      </div>
      
      <div style={{ marginTop: '14px', fontSize: '11px', fontWeight: '600', color: 'var(--brass)', textAlign: 'right' }}>
        상세 정보 보기 →
      </div>
    </div>
  );
}
