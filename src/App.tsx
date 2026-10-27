import { useEffect, useState } from 'react'
import ChallengesPage from './ChallengesPage'
import CompilerPage from './CompilerPage'
import LearningPage from './LearningPage'
import MaterialsPage from './MaterialsPage'
import PracticePage from './PracticePage'
import GroupChallengePage from './GroupChallengePage'
import Preloader from './Preloader'
import StudentIdentityScreen from './StudentIdentityScreen'
import StudentProfileModal from './StudentProfileModal'
import ScoreReportModal from './ScoreReportModal'
import {
  IconPythonLogo,
  IconUser,
  IconArrowUpRight,
  IconCircleArrowRight,
  IconMenu,
  IconClose,
} from './Icons'
import {
  getStudentProfile,
  getChallengeScores,
  calculateTotalScore,
  type StudentProfile,
  type ChallengeScore,
} from './studentData'
import './App.css'

type Page =
  | 'beranda'
  | 'belajar'
  | 'materi'
  | 'praktik'
  | 'latihan'
  | 'tantangan-kelompok'
  | 'tantangan'
  | 'compiler'

type AppStage = 'loading' | 'identity' | 'main'

function getPageFromHash(): Page {
  const hash = window.location.hash.toLowerCase()
  if (hash === '#materi') return 'materi'
  if (hash === '#praktik' || hash === '#latihan') return 'praktik'
  if (hash === '#tantangan-kelompok') return 'tantangan-kelompok'
  if (hash === '#tantangan') return 'tantangan'
  if (hash === '#compiler') return 'compiler'
  if (hash === '#belajar') return 'belajar'
  return 'beranda'
}

function getInitialStage(): AppStage {
  try {
    const isSessionDone = sessionStorage.getItem('sinaupy_session_initialized') === 'true'
    const profile = getStudentProfile()
    if (isSessionDone && profile.name && profile.name.trim() && profile.className) {
      return 'main'
    }
  } catch {
    // ignore
  }
  return 'loading'
}

export default function App() {
  const [appStage, setAppStage] = useState<AppStage>(getInitialStage)
  const [page, setPage] = useState<Page>(getPageFromHash)
  const [pageHistory, setPageHistory] = useState<Page[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false)
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(getStudentProfile)
  const [scores, setScores] = useState<ChallengeScore[]>(getChallengeScores)

  const navigateTo = (nextPage: Page, isBack: boolean = false) => {
    if (!isBack && nextPage !== page) {
      setPageHistory((prev) => [...prev, page])
    }
    setPage(nextPage)
    setMobileMenuOpen(false)
    if (window.location.hash !== `#${nextPage}`) {
      window.location.hash = nextPage
    }
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    if (pageHistory.length > 0) {
      const prevPage = pageHistory[pageHistory.length - 1]
      setPageHistory((prev) => prev.slice(0, -1))
      navigateTo(prevPage, true)
    } else {
      navigateTo('beranda')
    }
  }

  useEffect(() => {
    const syncPageWithHash = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#nilai') {
        setIsScoreModalOpen(true)
        return
      }
      setPage(getPageFromHash())
      window.scrollTo(0, 0)
    }

    if (window.location.hash.toLowerCase() === '#nilai') {
      setIsScoreModalOpen(true)
    }

    const syncScores = () => setScores(getChallengeScores())
    const syncProfile = () => setStudentProfile(getStudentProfile())

    window.addEventListener('hashchange', syncPageWithHash)
    window.addEventListener('sinaupy:scores_updated', syncScores)
    window.addEventListener('sinaupy:profile_updated', syncProfile)
    window.addEventListener('pythonlab:scores_updated', syncScores)
    window.addEventListener('pythonlab:profile_updated', syncProfile)

    return () => {
      window.removeEventListener('hashchange', syncPageWithHash)
      window.removeEventListener('sinaupy:scores_updated', syncScores)
      window.removeEventListener('sinaupy:profile_updated', syncProfile)
      window.removeEventListener('pythonlab:scores_updated', syncScores)
      window.removeEventListener('pythonlab:profile_updated', syncProfile)
    }
  }, [])

  // Transition from Preloader to either identity form or main
  const handlePreloaderComplete = () => {
    const profile = getStudentProfile()
    if (profile.name && profile.name.trim() && profile.className) {
      sessionStorage.setItem('sinaupy_session_initialized', 'true')
      setAppStage('main')
    } else {
      setAppStage('identity')
    }
  }

  // Identity Form Completed
  const handleIdentityComplete = (profile: StudentProfile) => {
    sessionStorage.setItem('sinaupy_session_initialized', 'true')
    setStudentProfile(profile)
    setAppStage('main')
  }

  // Loading Screen Stage
  if (appStage === 'loading') {
    return <Preloader onComplete={handlePreloaderComplete} />
  }

  // Student Identity Form Stage
  if (appStage === 'identity') {
    return (
      <StudentIdentityScreen
        initialName={studentProfile.name}
        initialClass={studentProfile.className}
        onComplete={handleIdentityComplete}
      />
    )
  }

  const studentDisplayName = studentProfile.name && studentProfile.name.trim() ? studentProfile.name.trim() : 'Siswa'
  const studentDisplayClass = studentProfile.className && studentProfile.className.trim() ? studentProfile.className.trim() : 'X-1'
  const totalScore = calculateTotalScore(scores)

  return (
    <div className="app-root">
      {/* ====================================================================
          1. BRIGHT NAVBAR
          ==================================================================== */}
      <header className="main-navbar">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <a
            href="#beranda"
            className="navbar-brand"
            onClick={(e) => {
              e.preventDefault()
              navigateTo('beranda')
            }}
          >
            <IconPythonLogo size={32} className="navbar-logo-icon" />
            <span className="navbar-brand-text">
              Sinau<span>Py</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links" aria-label="Navigasi Utama">
            <a
              href="#beranda"
              className={`nav-link ${page === 'beranda' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('beranda')
              }}
            >
              Beranda
            </a>
            <a
              href="#materi"
              className={`nav-link ${page === 'materi' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('materi')
              }}
            >
              Materi
            </a>
            <a
              href="#praktik"
              className={`nav-link ${page === 'praktik' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('praktik')
              }}
            >
              Praktik
            </a>
            <a
              href="#tantangan"
              className={`nav-link ${page === 'tantangan' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('tantangan')
              }}
            >
              Tantangan Berjenjang
            </a>
            <a
              href="#tantangan-kelompok"
              className={`nav-link ${page === 'tantangan-kelompok' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('tantangan-kelompok')
              }}
            >
              Tantangan Kelompok
            </a>
            <a
              href="#compiler"
              className={`nav-link ${page === 'compiler' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('compiler')
              }}
            >
              Compiler
            </a>
            <a
              href="#nilai"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                setIsScoreModalOpen(true)
              }}
            >
              Nilai Saya
            </a>
            <a
              href="#tentang"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                if (page !== 'beranda') {
                  navigateTo('beranda')
                  setTimeout(() => {
                    document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                } else {
                  document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Tentang
            </a>
          </nav>

          {/* Right: Student Greeting Badge & Main CTA */}
          <div className="navbar-right">
            <button
              type="button"
              className="student-greeting-pill"
              onClick={() => setIsProfileModalOpen(true)}
              title={`Total Skor: ${totalScore} Poin • Klik untuk mengubah identitas`}
            >
              <div className="greeting-avatar">
                <IconUser />
              </div>
              <div className="greeting-text">
                <span className="greeting-name">Halo, {studentDisplayName}!</span>
                <span className="greeting-class">Kelas {studentDisplayClass} • {totalScore} Pts</span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer" role="dialog" aria-label="Menu navigasi mobile">
            <a
              href="#beranda"
              className={`mobile-nav-item ${page === 'beranda' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('beranda')
              }}
            >
              Beranda
            </a>
            <a
              href="#materi"
              className={`mobile-nav-item ${page === 'materi' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('materi')
              }}
            >
              Materi
            </a>
            <a
              href="#praktik"
              className={`mobile-nav-item ${page === 'praktik' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('praktik')
              }}
            >
              Praktik
            </a>
            <a
              href="#tantangan"
              className={`mobile-nav-item ${page === 'tantangan' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('tantangan')
              }}
            >
              Tantangan Berjenjang
            </a>
            <a
              href="#tantangan-kelompok"
              className={`mobile-nav-item ${page === 'tantangan-kelompok' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('tantangan-kelompok')
              }}
            >
              Tantangan Kelompok
            </a>
            <a
              href="#compiler"
              className={`mobile-nav-item ${page === 'compiler' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                navigateTo('compiler')
              }}
            >
              Compiler Bebas
            </a>
            <a
              href="#nilai"
              className="mobile-nav-item"
              onClick={(e) => {
                e.preventDefault()
                setMobileMenuOpen(false)
                setIsScoreModalOpen(true)
              }}
            >
              Nilai Saya
            </a>
            <a
              href="#tentang"
              className="mobile-nav-item"
              onClick={(e) => {
                e.preventDefault()
                navigateTo('beranda')
                setTimeout(() => {
                  document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
              }}
            >
              Tentang
            </a>

            {page === 'beranda' && (
              <div className="mobile-drawer-bottom">
                <button
                  type="button"
                  className="btn-primary-blue full-width"
                  onClick={() => navigateTo('materi')}
                >
                  Mulai Belajar <IconArrowUpRight />
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ====================================================================
          2. MAIN CONTENT (ROUTER)
          ==================================================================== */}
      <main className="main-content">
        {page === 'materi' ? (
          <MaterialsPage onBack={handleBack} onBackHome={handleBack} />
        ) : page === 'praktik' ? (
          <PracticePage onBack={handleBack} onBackHome={handleBack} />
        ) : page === 'tantangan-kelompok' ? (
          <GroupChallengePage
            onBack={handleBack}
            onBackHome={handleBack}
            onStartChallenges={() => navigateTo('tantangan')}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenScores={() => setIsScoreModalOpen(true)}
          />
        ) : page === 'tantangan' ? (
          <ChallengesPage
            onBack={handleBack}
            onBackHome={handleBack}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenScores={() => setIsScoreModalOpen(true)}
          />
        ) : page === 'compiler' ? (
          <CompilerPage onBack={handleBack} onBackHome={handleBack} />
        ) : page === 'belajar' ? (
          <LearningPage
            onShowMaterials={() => navigateTo('materi')}
            onBack={handleBack}
            onBackHome={handleBack}
          />
        ) : (
          /* ================================================================
             LANDING PAGE (BRIGHT, CLEAN, CREATIVE — TWO26 STUDIO STYLE)
             ================================================================ */
          <div className="landing-page-wrap">
            {/* HERO SECTION */}
            <section className="hero-section" aria-labelledby="hero-headline">
              <div className="hero-container">
                {/* Left Column: Copy & Actions */}
                <div className="hero-copy-col">
                  <span className="hero-level-tag">
                    PEMBELAJARAN PENEMUAN · DISCOVERY LEARNING
                  </span>

                  <h1 id="hero-headline" className="hero-big-title">
                    LESS SCROLLING.<br />
                    MORE DISCOVERY.
                  </h1>

                  <p className="hero-paragraph">
                    Belajar Python secara aktif dengan model Discovery Learning. Amati fenomena kode, ajukan prediksi, buktikan melalui eksperimen compiler interaktif, dan rumuskan pemahamanmu sendiri secara mandiri.
                  </p>

                  <div className="hero-student-greeting">
                    <span className="greeting-pulse-dot" />
                    <span className="greeting-text">
                      Halo, <strong>{studentDisplayName}</strong>! Siap menjelajah dan menemukan konsep Python hari ini?
                    </span>
                  </div>

                  <div className="hero-action-buttons">
                    <button
                      type="button"
                      className="btn-primary-blue"
                      onClick={() => navigateTo('materi')}
                    >
                      Mulai Belajar <IconArrowUpRight />
                    </button>
                    <a
                      href="#materi-section"
                      className="btn-secondary-white"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('materi-section')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      Jelajahi Materi
                    </a>
                  </div>
                </div>

                {/* Right Column: Creative Visual Composition */}
                <div className="hero-visual-col" aria-hidden="true">
                  <div className="visual-stage">
                    {/* Floating Code Editor Window */}
                    <div className="floating-code-card">
                      <div className="code-card-header">
                        <div className="card-window-dots">
                          <span className="dot dot-red" />
                          <span className="dot dot-yellow" />
                          <span className="dot dot-green" />
                        </div>
                        <span className="code-card-title">main.py</span>
                      </div>
                      <div className="code-card-body">
                        <pre>
                          <code>
                            <span className="syntax-func">print</span>(<span className="syntax-str">"Hello, SinauPy!"</span>)
                            {'\n\n'}
                            <span className="syntax-kw">for</span> step <span className="syntax-kw">in</span> learning:{'\n'}
                            {'    '}<span className="syntax-func">practice</span>(step)
                          </code>
                        </pre>
                      </div>
                    </div>

                    {/* Creative 3D Python Mascot */}
                    <div className="hero-mascot-anchor">
                      <IconPythonLogo size={130} className="hero-python-emblem" />
                    </div>

                    {/* Floating Creative Accent Elements */}
                    <div className="floating-badge badge-code">
                      <span>&lt;/&gt;</span>
                    </div>
                    <div className="orbit-line orbit-1" />
                    <div className="orbit-line orbit-2" />
                    <div className="geom-cube geom-cube-yellow" />
                    <div className="geom-cube geom-cube-blue" />
                    <div className="geom-dot geom-dot-1" />
                    <div className="geom-dot geom-dot-2" />
                  </div>
                </div>
              </div>
            </section>

            {/* MARQUEE / RUNNING TEXT (Blue Medium Accent) */}
            <div className="running-marquee-bar" aria-hidden="true">
              <div className="marquee-track">
                <span>THINK</span> <span className="slash">/</span>
                <span>WRITE</span> <span className="slash">/</span>
                <span>RUN</span> <span className="slash">/</span>
                <span>REPEAT</span> <span className="slash">/</span>
                <span>LEARN</span> <span className="slash">/</span>
                <span>BUILD</span> <span className="slash">/</span>
                <span>CREATE</span> <span className="slash">/</span>
                <span>THINK</span> <span className="slash">/</span>
                <span>WRITE</span> <span className="slash">/</span>
                <span>RUN</span> <span className="slash">/</span>
                <span>REPEAT</span> <span className="slash">/</span>
                <span>LEARN</span> <span className="slash">/</span>
                <span>BUILD</span> <span className="slash">/</span>
                <span>CREATE</span> <span className="slash">/</span>
              </div>
            </div>

            {/* SECTION MATERI PEMBELAJARAN ("Mulai dari Sini ↗") */}
            <section id="materi-section" className="section-materi" aria-labelledby="materi-title">
              <div className="section-container">
                <div className="materi-header-group">
                  <h2 id="materi-title" className="section-title">
                    Mulai dari Sini <IconArrowUpRight />
                  </h2>
                  <p className="section-subtitle">Small steps. Real progress.</p>
                </div>

                <div className="materi-cards-grid">
                  {/* Card 01 — Penemuan Konsep Dasar */}
                  <div className="materi-card">
                    <span className="card-number">01</span>
                    <h3 className="card-heading">Penemuan Konsep Dasar</h3>
                    <ul className="card-topics-list">
                      <li>Stimulasi kode & identifikasi masalah</li>
                      <li>Prediksi hipotesis sebelum koding</li>
                      <li>Eksperimen compiler & pembuktian</li>
                    </ul>
                    <div className="card-bottom-row">
                      <button
                        type="button"
                        className="circle-arrow-btn"
                        onClick={() => navigateTo('materi')}
                        aria-label="Buka modul Penemuan Konsep Dasar"
                      >
                        <IconCircleArrowRight />
                      </button>
                      <div className="card-art-shape shape-blue" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Card 02 — Praktik Terbimbing & Analisis */}
                  <div className="materi-card">
                    <span className="card-number">02</span>
                    <h3 className="card-heading">Praktik & Analisis Data</h3>
                    <ul className="card-topics-list">
                      <li>Tabel observasi & pengolahan data uji</li>
                      <li>Percabangan logika (if-elif-else)</li>
                      <li>Kuis verifikasi & aturan emas (golden rules)</li>
                    </ul>
                    <div className="card-bottom-row">
                      <button
                        type="button"
                        className="circle-arrow-btn"
                        onClick={() => navigateTo('praktik')}
                        aria-label="Buka modul Praktik & Analisis Data"
                      >
                        <IconCircleArrowRight />
                      </button>
                      <div className="card-art-shape shape-yellow" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Card 03 — Tantangan & Transfer Mandiri */}
                  <div className="materi-card">
                    <span className="card-number">03</span>
                    <h3 className="card-heading">Tantangan & Transfer</h3>
                    <ul className="card-topics-list">
                      <li>Tantangan Berjenjang Level 1–4</li>
                      <li>Studi Kasus HOTS Analitis C4–C6</li>
                      <li>Proyek Kasir Kolaboratif Kelompok</li>
                    </ul>
                    <div className="card-bottom-row">
                      <div className="card-action-dual">
                        <button
                          type="button"
                          className="card-nav-pill"
                          onClick={() => navigateTo('tantangan')}
                          title="Buka Tantangan Berjenjang"
                        >
                          Berjenjang
                        </button>
                        <button
                          type="button"
                          className="card-nav-pill pill-group"
                          onClick={() => navigateTo('tantangan-kelompok')}
                          title="Buka Tantangan Kelompok"
                        >
                          Kelompok
                        </button>
                      </div>
                      <div className="card-art-shape shape-green-blue" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION PRAKTIK ("From first line to real creation.") */}
            <section className="section-praktik" aria-labelledby="praktik-title">
              <div className="section-container praktik-grid">
                <div className="praktik-copy">
                  <h2 id="praktik-title" className="section-title">
                    From first line<br />to real discovery.
                  </h2>
                  <p className="praktik-description">
                    SinauPy menempatkan siswa sebagai pusat pembelajaran (student-centered). Melalui 6 sintaks Discovery Learning, siswa tidak sekadar menghafal sintaks, melainkan aktif menemukan aturan, memvalidasi dugaan, dan membangun penalaran komputasional yang tangguh.
                  </p>
                  <button
                    type="button"
                    className="btn-primary-blue"
                    onClick={() => navigateTo('materi')}
                  >
                    Mulai Eksplorasi <IconArrowUpRight />
                  </button>
                </div>

                <div className="praktik-visual-card" aria-hidden="true">
                  <div className="mini-code-snippet">
                    <div className="snippet-bar">
                      <span className="snippet-lang"># python · discovery</span>
                    </div>
                    <pre>
                      <code>
                        <span className="syntax-kw">for</span> step <span className="syntax-kw">in</span> discovery:{'\n'}
                        {'    '}hypothesis = <span className="syntax-func">observe</span>(data){'\n'}
                        {'    '}<span className="syntax-func">verify</span>(hypothesis)
                      </code>
                    </pre>
                  </div>
                  <div className="snippet-shape shape-accent" />
                </div>
              </div>
            </section>

            {/* SECTION TENTANG SINAUPY */}
            <section id="tentang" className="section-tentang" aria-labelledby="tentang-title">
              <div className="section-container">
                <div className="tentang-top-row">
                  <div>
                    <span className="section-kicker">MODEL PEMBELAJARAN PENEMUAN</span>
                    <h2 id="tentang-title" className="section-title">
                      6 Sintaks Discovery Learning di SinauPy
                    </h2>
                  </div>
                  <p className="tentang-subtext">
                    Mendukung guru Informatika dan membimbing siswa SMA/SMK belajar mandiri melalui pendekatan penemuan terstruktur dan student-centered.
                  </p>
                </div>

                <div className="tentang-pillars-grid">
                  <div className="pillar-item">
                    <div className="pillar-index">01</div>
                    <h4>1. Stimulasi & Identifikasi</h4>
                    <p>Menyajikan fenomena kode nyata dan spark questions untuk memicu rasa ingin tahu, dilanjutkan perumusan hipotesis mandiri.</p>
                  </div>
                  <div className="pillar-item">
                    <div className="pillar-index">02</div>
                    <h4>2. Eksperimen & Analisis</h4>
                    <p>Uji coba terarah pada Online Compiler Pyodide anti-paste, pencatatan tabel observasi, dan penarikan pola logika komputasi.</p>
                  </div>
                  <div className="pillar-item">
                    <div className="pillar-index">03</div>
                    <h4>3. Pembuktian & Transfer</h4>
                    <p>Kuis validasi, pembuktian aturan resmi, perumusan kesimpulan mandiri, tantangan far transfer, dan refleksi metakognitif.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ====================================================================
          3. BRIGHT FOOTER
          ==================================================================== */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand-col">
              <a href="#beranda" className="footer-brand" onClick={(e) => { e.preventDefault(); navigateTo('beranda'); }}>
                <IconPythonLogo size={26} className="footer-logo-icon" />
                <span className="footer-brand-text">Sinau<span>Py</span></span>
              </a>
              <p className="footer-tagline-text">
                Keep learning. Keep building.
              </p>
            </div>

            <nav className="footer-nav" aria-label="Navigasi Footer">
              <a href="#beranda" onClick={(e) => { e.preventDefault(); navigateTo('beranda'); }}>Beranda</a>
              <a href="#materi" onClick={(e) => { e.preventDefault(); navigateTo('materi'); }}>Materi</a>
              <a href="#praktik" onClick={(e) => { e.preventDefault(); navigateTo('praktik'); }}>Praktik</a>
              <a href="#tantangan" onClick={(e) => { e.preventDefault(); navigateTo('tantangan'); }}>Tantangan Berjenjang</a>
              <a href="#tantangan-kelompok" onClick={(e) => { e.preventDefault(); navigateTo('tantangan-kelompok'); }}>Tantangan Kelompok</a>
              <a href="#compiler" onClick={(e) => { e.preventDefault(); navigateTo('compiler'); }}>Compiler</a>
              <a href="#nilai" onClick={(e) => { e.preventDefault(); setIsScoreModalOpen(true); }}>Nilai Saya</a>
              <a href="#tentang" onClick={(e) => {
                e.preventDefault()
                if (page !== 'beranda') {
                  navigateTo('beranda')
                  setTimeout(() => {
                    document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                } else {
                  document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}>Tentang</a>
            </nav>
          </div>

          <div className="footer-bottom">
            <span className="footer-copyright">
              &copy; {new Date().getFullYear()} SinauPy. All rights reserved.
            </span>
            <span className="footer-meta-pill">
              Media Belajar Informatika SMA/SMK
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={(updated) => setStudentProfile(updated)}
      />

      <ScoreReportModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />
    </div>
  )
}
