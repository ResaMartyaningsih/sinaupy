import { useState, useEffect } from 'react'
import ChallengeRunner from './ChallengeRunner'
import {
  INDIVIDUAL_CHALLENGES,
  HOTS_CASE_STUDIES,
  type ChallengeItem,
} from './challengesData'
import {
  getStudentProfile,
  getChallengeScores,
  calculateTotalScore,
  type StudentProfile,
  type ChallengeScore,
} from './studentData'
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconUser,
  IconUsers,
  IconBrain,
  IconTrophy,
  IconEdit,
} from './Icons'
import './ChallengesPage.css'

type TabType = 'individu' | 'hots'

type ChallengesPageProps = {
  onBack?: () => void
  onBackHome?: () => void
  onOpenProfile: () => void
  onOpenScores: () => void
  onNavigateToGroup?: () => void
}

export default function ChallengesPage({
  onBack,
  onBackHome,
  onOpenProfile,
  onOpenScores,
  onNavigateToGroup,
}: ChallengesPageProps) {
  const handleBack = () => {
    if (onBack) onBack()
    else if (onBackHome) onBackHome()
    else window.history.back()
  }
  const [activeTab, setActiveTab] = useState<TabType>('individu')
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all')
  const [profile, setProfile] = useState<StudentProfile>(getStudentProfile)
  const [scores, setScores] = useState<ChallengeScore[]>(getChallengeScores)

  useEffect(() => {
    const handleScoresUpdate = () => setScores(getChallengeScores())
    const handleProfileUpdate = () => setProfile(getStudentProfile())
    window.addEventListener('sinaupy:scores_updated', handleScoresUpdate)
    window.addEventListener('sinaupy:profile_updated', handleProfileUpdate)
    window.addEventListener('pythonlab:scores_updated', handleScoresUpdate)
    window.addEventListener('pythonlab:profile_updated', handleProfileUpdate)
    return () => {
      window.removeEventListener('sinaupy:scores_updated', handleScoresUpdate)
      window.removeEventListener('sinaupy:profile_updated', handleProfileUpdate)
      window.removeEventListener('pythonlab:scores_updated', handleScoresUpdate)
      window.removeEventListener('pythonlab:profile_updated', handleProfileUpdate)
    }
  }, [])

  const currentList: ChallengeItem[] =
    activeTab === 'individu' ? INDIVIDUAL_CHALLENGES : HOTS_CASE_STUDIES

  const filteredChallenges =
    selectedLevel === 'all'
      ? currentList
      : currentList.filter((item) => item.level === selectedLevel)

  const totalPoints = calculateTotalScore(scores)
  const completedInTab = currentList.filter((item) =>
    scores.some((s) => s.challengeId === item.id),
  ).length

  return (
    <section className="challenges-page" aria-labelledby="challenges-page-title">
      <div className="challenges-top-bar">
        <a
          className="back-home-link"
          href="#kembali"
          onClick={(event) => {
            event.preventDefault()
            handleBack()
          }}
          title="Kembali ke halaman sebelumnya"
        >
          <IconArrowLeft /> Kembali
        </a>

        {/* Student Status Strip with Clear Framing */}
        <div className="student-status-strip">
          <div className="student-info-left">
            <div className="strip-avatar-badge">
              <IconUser className="strip-icon" />
            </div>
            <div className="strip-text">
              <span className="strip-kicker">STATUS ASESMEN SISWA</span>
              <span className="strip-name">
                {profile.name ? (
                  <>
                    <strong>{profile.name}</strong> • Kelas <strong>{profile.className}</strong>
                  </>
                ) : (
                  <span className="name-not-set">Identitas siswa belum diisi</span>
                )}
              </span>
            </div>
          </div>
          <div className="strip-actions">
            <button type="button" className="strip-btn-edit" onClick={onOpenProfile}>
              <IconEdit /> {profile.name ? 'Ubah Data' : 'Isi Identitas'}
            </button>
            <button type="button" className="strip-btn-score" onClick={onOpenScores}>
              <IconTrophy /> Total Skor: <strong>{totalPoints} Poin</strong>
            </button>
          </div>
        </div>
      </div>

      {/* Cross Navigation Banner to Group Challenges */}
      {onNavigateToGroup && (
        <div className="group-redirect-banner">
          <div className="redirect-left">
            <span className="redirect-badge">
              <IconUsers /> MODE KELOMPOK
            </span>
            <span className="redirect-text">
              Ingin mengerjakan tantangan bersama tim di kelas? Buka halaman khusus <strong>Tantangan Kelompok</strong> dengan rubrik peran Analis, Programmer, dan Penguji.
            </span>
          </div>
          <button
            type="button"
            className="redirect-btn"
            onClick={onNavigateToGroup}
          >
            Buka Tantangan Kelompok <IconArrowUpRight />
          </button>
        </div>
      )}

      <header className="challenges-page-heading">
        <span className="section-kicker">MODEL DISCOVERY LEARNING · ASESMEN BERJENJANG</span>
        <h1 id="challenges-page-title">Tantangan Pemrograman Berjenjang</h1>
        <p>
          Terapkan konsep pemrograman yang telah kamu temukan melalui pemecahan tantangan bertahap:
          mulai dari eksplorasi pola (Level 1), penerapan logika algoritma (Level 2–3), hingga transfer dan sintesis mandiri pada studi kasus HOTS (C4–C6).
        </p>
      </header>

      {/* 2 Main Tabs (Individu & HOTS) */}
      <div className="challenge-tabs-nav" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'individu'}
          className={`tab-btn ${activeTab === 'individu' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('individu')
            setSelectedLevel('all')
          }}
        >
          <div className="tab-icon-wrap"><IconUser /></div>
          <div className="tab-texts">
            <span className="tab-title">Tantangan Individu</span>
            <span className="tab-desc">Level 1–4 Penemuan Mandiri</span>
          </div>
          <span className="tab-counter">
            {scores.filter((s) => s.category === 'individu').length}/{INDIVIDUAL_CHALLENGES.length} Selesai
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'hots'}
          className={`tab-btn ${activeTab === 'hots' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('hots')
            setSelectedLevel('all')
          }}
        >
          <div className="tab-icon-wrap"><IconBrain /></div>
          <div className="tab-texts">
            <span className="tab-title">Studi Kasus HOTS</span>
            <span className="tab-desc">Far Transfer & Analisis C4–C6</span>
          </div>
          <span className="tab-counter">
            {scores.filter((s) => s.category === 'hots').length}/{HOTS_CASE_STUDIES.length} Selesai
          </span>
        </button>
      </div>

      {/* Tab Context Banner & Level Filters */}
      <div className="tab-intro-card">
        <div className="tab-intro-text">
          {activeTab === 'individu' && (
            <p>
              <strong>Fokus Penemuan Mandiri:</strong> Mulai dari mengamati pola kasus uji (Level 1),
              merumuskan aturan percabangan & aritmetika (Level 2), mengelola perulangan (Level 3),
              hingga merancang algoritma terpadu secara mandiri (Level 4) dengan anti-paste protection.
            </p>
          )}
          {activeTab === 'hots' && (
            <p>
              <strong>Fokus Transfer Konseptual (HOTS):</strong> Memecahkan permasalahan autentik dunia nyata
              yang memerlukan dekomposisi data, evaluasi multikriteria, dan perancangan solusi komputasional holistik.
            </p>
          )}
        </div>

        {/* Level Filters */}
        <div className="level-filters">
          <span className="tab-progress-indicator">
            Progres Kategori: <strong>{completedInTab}/{currentList.length}</strong>
          </span>
          <div className="level-btn-group">
            <button
              type="button"
              className={`lvl-pill ${selectedLevel === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('all')}
            >
              Semua ({currentList.length})
            </button>
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`lvl-pill ${selectedLevel === lvl ? 'active' : ''}`}
                onClick={() => setSelectedLevel(lvl)}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges List with Clean Boundaries */}
      <div className="challenges-list-container">
        {filteredChallenges.map((challenge) => (
          <ChallengeRunner
            key={challenge.id}
            challenge={challenge}
            onRequestProfileModal={onOpenProfile}
          />
        ))}
      </div>
    </section>
  )
}

