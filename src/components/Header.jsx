import { useLocation, useNavigate } from 'react-router-dom';

export function Header({ onSectionClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const scrollToSection = (id) => {
    if (onSectionClick) {
      onSectionClick(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <div 
          className="landing-brand" 
          onClick={() => navigate('/')}
          title="MILPICK 홈으로"
        >
          MIL<span>PICK</span>
        </div>

        <div className="landing-header-actions">
          {pathname === '/' ? (
            <>
              <button className="landing-section-link" onClick={() => scrollToSection('problems')}>
                제안배경
              </button>
              <button className="landing-section-link" onClick={() => scrollToSection('features')}>
                핵심기능
              </button>
              <button className="landing-section-link" onClick={() => scrollToSection('impact')}>
                기대효과
              </button>
              <button className="landing-btn-sm" onClick={() => navigate('/search')}>
                내게 맞는 군 특기 찾기 →
              </button>
            </>
          ) : pathname === '/search' ? (
            <>
              <button className="landing-btn-sub" onClick={() => navigate('/direct')}>
                🔍 특기 직접 검색
              </button>
              <button className="landing-btn-sm" onClick={() => navigate('/')}>
                홈으로
              </button>
            </>
          ) : pathname === '/direct' || pathname === '/all' ? (
            <>
              <button className="landing-btn-sub" onClick={() => navigate('/search')}>
                🔍 전공으로 검색
              </button>
              <button className="landing-btn-sm" onClick={() => navigate('/')}>
                홈으로
              </button>
            </>
          ) : (
            <>
              <button className="landing-btn-sm" onClick={() => navigate('/')}>
                홈으로
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
