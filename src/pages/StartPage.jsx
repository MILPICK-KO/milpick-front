import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function StartPage() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">
      {/* 1. Sticky Navigation Header */}
      <Header onSectionClick={scrollToSection} />

      {/* 2. Hero Section */}
      <section className="landing-hero">

        <h1 className="landing-title">
          내 전공과 적성으로 찾는<br />
          <span className="highlight">가장 스마트한 군사특기</span>
        </h1>

        <p className="landing-subtitle">
          전공과 관심 분야만 입력하고<br/>내게 딱 맞는 특기를 찾아봐요.
        </p>

        <div className="landing-hero-actions">
          <button className="landing-btn-primary" onClick={() => navigate('/search')}>
            내게 맞는 군 특기 찾기 →
          </button>
          <button className="landing-btn-secondary" onClick={() => scrollToSection('problems')}>
            제안 배경 살펴보기 ↓
          </button>
        </div>

        {
          <hr></hr>
        }
      </section>

      {/* 3. Problem Section (현행 제도의 문제점 & 현실태) */}
      <section id="problems" className="landing-section">
        <div className="landing-section-head">
          <div className="landing-section-eyebrow">WHY MILPICK</div>
          <h2 className="landing-section-title">왜 새로운 특기 추천이 필요할까요?</h2>
          <p className="landing-section-desc">
            현행 대한민국 육군 모집병 제도의 문제점을 병역의무자 관점에서 분석해봤어요.
          </p>
        </div>

        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon-badge">🚫</div>
            <h3 className="problem-card-title">어려운 정보 찾기</h3>
            <p className="problem-card-desc">
              병무청이 기본적으로 제공하는 군사특기 찾기 서비스는 모집 계획이 없으면 조회조차 불가능해요.
              모집병을 희망하는 병역의무자는 모집 공고가 나올 때까지 해당 특기에 대한 정보 없이 기다려야 해요.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon-badge">⏱️</div>
            <h3 className="problem-card-title">복잡하고 귀찮은 특기 추천 서비스</h3>
            <p className="problem-card-desc">
              병무청이 제공하는 직업선호도검사를 통한 특기 추천 서비스는 복잡한 로그인 과정과 긴 설문을 요구해요.
              이러한 진입장벽 때문에 대다수의 사용자는 이용하기를 포기하거나 애당초 이용할 생각조차 하지 않아요.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon-badge">⚖️</div>
            <h3 className="problem-card-title">정보 비대칭과 '꿀보직' 쏠림</h3>
            <p className="problem-card-desc">
              특기 정보가 널리 알려지지 않아 병역의무자 사이에서 널리 알려진 소위 '꿀보직'만 경쟁률이 비정상적으로 폭증하고, 
              정작 중요하고 알찬 다수의 특기들은 인원이 미달되는 불균형이 발생해요.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Solution & Core Features (주요 기능) */}
      <section id="features" className="landing-section">
        <div className="landing-section-head">
          <div className="landing-section-eyebrow">CORE SOLUTION</div>
          <h2 className="landing-section-title">MILPICK은 이렇게 해결합니다</h2>
          <p className="landing-section-desc">
            복잡하던 단계가 4단계로!<br/>
            누구나 쉽고 빠르게 자신에게 꼭 맞는 군사특기를 찾을 수 있어요.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-step-num">STEP 01</span>
            <h3 className="feature-card-title">모집분류 한눈에 파악하기</h3>
            <p className="feature-card-desc">
              기술행정병, 전문특기병, 취업맞춤특기병부터 어학병과 카투사까지.
              대한민국 육군 모집병의 복잡한 모집분류 체계를 상세한 설명과 함께 골라요.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-step-num">STEP 02</span>
            <h3 className="feature-card-title">전공과 관심분야 매칭하기</h3>
            <p className="feature-card-desc">
              전국 대학별 학과 정보 표준 데이터와 자체적으로 구축한 전공별 키워드 매핑 테이블을 통해, 
              내 전공만 입력하면 연관된 군사특기 분야를 추천해요.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-step-num">STEP 03</span>
            <h3 className="feature-card-title">신체조건 정밀 필터링하기</h3>
            <p className="feature-card-desc">
              이미 입영판정검사를 받으셨나요? <br/>
              지원 불가능한 특기를 위해 헛수고하는 일이 없도록 신장, 체중, 시력, 신체등급은 물론 앓고 있는 질환까지 사전에 검증해, 
              지원 불가능한 특기를 꼼꼼하게 걸러내요.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-step-num">STEP 04</span>
            <h3 className="feature-card-title">특기 자세히 살펴보기</h3>
            <p className="feature-card-desc">
              관심이 가는 특기가 생기셨나요?<br/>
              특기 상세보기를 통해 해당 특기에 부여된 임무, 관련 자격증 등 모든 정보를 빠짐없이 확인해요.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Expected Impact (기대효과 및 결론) */}
      <section id="impact" className="landing-section">
        <div className="landing-section-head">
          <div className="landing-section-eyebrow">EXPECTED IMPACT</div>
          <h2 className="landing-section-title">MILPICK이 만들어갈 3가지 변화</h2>
        </div>

        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon-badge">🎯</div>
            <h3 className="impact-card-title">개개인의 잠재력 극대화</h3>
            <p className="impact-card-desc">
              나와 동떨어지고 재미없는 특기 대신, 내가 좋아하는 전공과 재능을 살려 복무하는 기회를 마련해요.
            </p>
          </div>

          <div className="impact-card">
            <div className="impact-icon-badge">⚖️</div>
            <h3 className="impact-card-title">정보 비대칭 및 편중 해소</h3>
            <p className="impact-card-desc">
              잘 알려지지 않은 가치 있는 특기들을 발굴할 수 있는 기회를 마련해
              소수 인기 보직에만 편중되던 지원율을 해소해요.
            </p>
          </div>

          <div className="impact-card">
            <div className="impact-icon-badge">🛡️</div>
            <h3 className="impact-card-title">육군 전투력 및 업무 효율성 증대</h3>
            <p className="impact-card-desc">
              적재적소에 실무 능력을 갖춘 전공자가 배치되어 전반적인 업무 효율을 끌어올리고,
              더 나아가 대한민국 육군의 전투력을 증진시켜요.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Final CTA Banner */}
      <section className="landing-section" style={{ paddingBottom: 0 }}>
        <div className="landing-cta-banner">
          <h2 className="landing-cta-title">나의 군 복무, 시작부터 똑똑하게</h2>
          <p className="landing-cta-desc">
            전공이나 관심 분야만 입력하고 내게 딱 맞는 군사특기를 찾아봐요.
          </p>
          <button className="landing-btn-primary" onClick={() => navigate('/search')}>
            내게 맞는 군 특기 찾기 →
          </button>
        </div>
      </section>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
