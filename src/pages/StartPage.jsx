import { useNavigate } from 'react-router-dom';

export function StartPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      textAlign: 'center',
      background: 'var(--bg)'
    }}>
      <div style={{
        background: 'var(--brass-bg)',
        color: 'var(--brass)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '700',
        marginBottom: '24px',
        letterSpacing: '0.5px'
      }}>
        MILPICK
      </div>
      <h1 style={{
        fontSize: '42px',
        fontWeight: '800',
        color: 'var(--text)',
        marginBottom: '20px',
        lineHeight: '1.3',
        letterSpacing: '-1px'
      }}>
        가장 스마트한<br />군사특기 찾기
      </h1>
      <p style={{
        fontSize: '16px',
        color: 'var(--text-dim)',
        marginBottom: '48px',
        lineHeight: '1.6'
      }}>
        전공과 관심 분야만 입력하고<br />내게 딱 맞는 특기를 찾아봐요.
      </p>
      <button 
        onClick={() => navigate('/search')}
        style={{
          background: 'var(--text)',
          color: 'var(--surface)',
          border: 'none',
          padding: '18px 40px',
          borderRadius: '16px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = 'var(--brass)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'var(--text)';
        }}
      >
        특기 검색 시작하기
      </button>
    </div>
  );
}
