import { config } from '../utils/config';

export function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div>
          <div 
            className="landing-brand" 
            style={{ fontSize: '22px', marginBottom: '8px', cursor: 'pointer' }}
            onClick={() => window.location.href = config.LINK}
          >
            MIL<span>PICK</span>
          </div>
          <p style={{ margin: '0 0 6px', color: 'var(--text-dim)', fontSize: '13px' }}>
            가장 스마트한 군사특기 찾기
          </p>
          <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '12px' }}>
            제2경비단 안동기 · 국방통합데이터센터 권민성
          </p>
        </div>

        <div className="landing-footer-links">
          <a href="https://github.com/MILPICK-KO" target="_blank" rel="noreferrer">
            GitHub Repo ↗
          </a>
          <a href="https://api-milpick.flyahn06.com" target="_blank" rel="noreferrer">
            Open API ↗
          </a>
          <span style={{ color: 'var(--text-faint)' }}></span>
        </div>
      </div>
    </footer>
  );
}
