import { useState, useEffect } from 'react'
import CodePlayground from './CodePlayground'
import {
  saveChallengeScore,
  getChallengeScores,
  getStudentProfile,
  type ChallengeScore,
} from './studentData'
import type { ChallengeItem } from './challengesData'
import {
  IconCheck,
  IconAlert,
  IconTrophy,
  IconSave,
  IconUser,
  IconUsers,
  IconBrain,
  IconCode,
} from './Icons'
import './ChallengeRunner.css'

type ChallengeRunnerProps = {
  challenge: ChallengeItem
  onRequestProfileModal: () => void
}

export default function ChallengeRunner({
  challenge,
  onRequestProfileModal,
}: ChallengeRunnerProps) {
  const [lastRunSuccess, setLastRunSuccess] = useState<boolean | null>(null)
  const [savedScore, setSavedScore] = useState<ChallengeScore | null>(null)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  // Discovery Learning Hypothesis & Reflection State
  const [hypothesis, setHypothesis] = useState(() => {
    try {
      return localStorage.getItem(`sinaupy_challenge_hypo_${challenge.id}`) || ''
    } catch {
      return ''
    }
  })
  const [reflection, setReflection] = useState(() => {
    try {
      return localStorage.getItem(`sinaupy_challenge_refl_${challenge.id}`) || ''
    } catch {
      return ''
    }
  })
  const [showInquiryPlan, setShowInquiryPlan] = useState(true)

  const checkExistingScore = () => {
    const scores = getChallengeScores()
    const found = scores.find((s) => s.challengeId === challenge.id)
    if (found) {
      setSavedScore(found)
    } else {
      setSavedScore(null)
    }
  }

  useEffect(() => {
    checkExistingScore()
    setLastRunSuccess(null)
    setSaveSuccessMsg(null)
    try {
      setHypothesis(localStorage.getItem(`sinaupy_challenge_hypo_${challenge.id}`) || '')
      setReflection(localStorage.getItem(`sinaupy_challenge_refl_${challenge.id}`) || '')
    } catch {
      // ignore
    }
  }, [challenge.id])

  useEffect(() => {
    const handleScoresUpdate = () => checkExistingScore()
    window.addEventListener('sinaupy:scores_updated', handleScoresUpdate)
    window.addEventListener('pythonlab:scores_updated', handleScoresUpdate)
    return () => {
      window.removeEventListener('sinaupy:scores_updated', handleScoresUpdate)
      window.removeEventListener('pythonlab:scores_updated', handleScoresUpdate)
    }
  }, [challenge.id])

  const handleHypothesisChange = (val: string) => {
    setHypothesis(val)
    try {
      localStorage.setItem(`sinaupy_challenge_hypo_${challenge.id}`, val)
    } catch {
      // ignore
    }
  }

  const handleReflectionChange = (val: string) => {
    setReflection(val)
    try {
      localStorage.setItem(`sinaupy_challenge_refl_${challenge.id}`, val)
    } catch {
      // ignore
    }
  }

  const handleRunResult = (_code: string, output: string, success: boolean) => {
    const isError = !success || output.includes('Error:') || output.includes('Traceback') || output.includes('EOFError')
    setLastRunSuccess(!isError)
    if (isError) {
      setSaveSuccessMsg(null)
    }
  }

  const [isSavingScore, setIsSavingScore] = useState(false)

  const handleSaveScore = async () => {
    if (isSavingScore) return
    if (lastRunSuccess !== true) {
      alert('Nilai belum dapat disimpan. Pastikan kamu telah menjalankan program di compiler dan berhasil tanpa pesan error.')
      return
    }
    const profile = getStudentProfile()
    if (!profile.name.trim() || !profile.className.trim()) {
      alert('Silakan lengkapi Nama Siswa dan Kelas terlebih dahulu agar nilai dapat dicatat.')
      onRequestProfileModal()
      return
    }

    setIsSavingScore(true)
    const result = await saveChallengeScore({
      challengeId: challenge.id,
      title: challenge.title,
      category: challenge.category,
      level: challenge.level,
      score: challenge.points,
      maxScore: challenge.points,
    })
    setIsSavingScore(false)

    setSaveSuccessMsg(result.message)
    setTimeout(() => {
      setSaveSuccessMsg(null)
    }, 5000)
  }

  // Get pedagogical inquiry level description
  const getDiscoveryBadge = () => {
    if (challenge.category === 'hots') {
      return {
        levelName: 'PENEMUAN TINGKAT TINGGI (HOTS C4–C6)',
        desc: 'Transfer Konsep & Pemecahan Kasus Nyata Multidimensi',
        tagClass: 'disc-tag-hots',
      }
    }
    switch (challenge.level) {
      case 1:
        return {
          levelName: 'PENEMUAN LEVEL 1: EKSPLORASI POLA',
          desc: 'Identifikasi Masukan-Keluaran & Logika Percabangan Dasar',
          tagClass: 'disc-tag-lvl1',
        }
      case 2:
        return {
          levelName: 'PENEMUAN LEVEL 2: PENERAPAN STRUKTUR KONTROL',
          desc: 'Penerapan Operator Logika Majemuk & Aritmetika Bersyarat',
          tagClass: 'disc-tag-lvl2',
        }
      case 3:
        return {
          levelName: 'PENEMUAN LEVEL 3: REKAYASA ALGORITMA',
          desc: 'Perulangan, Akumulasi Data, dan Validasi Kasus Batas',
          tagClass: 'disc-tag-lvl3',
        }
      case 4:
      default:
        return {
          levelName: 'PENEMUAN LEVEL 4: SINTESIS MANDIRI',
          desc: 'Penyusunan Logika Terpadu Tanpa Templat Kode',
          tagClass: 'disc-tag-lvl4',
        }
    }
  }

  const discBadge = getDiscoveryBadge()

  return (
    <article className="challenge-runner-card" id={`challenge-${challenge.id}`}>
      {/* Discovery Pedagogy Top Bar */}
      <div className="challenge-discovery-banner">
        <div className="discovery-banner-left">
          <span className={`discovery-pedagogy-pill ${discBadge.tagClass}`}>
            <IconCode /> {discBadge.levelName}
          </span>
          <span className="discovery-pedagogy-sub">{discBadge.desc}</span>
        </div>
        <div className="discovery-banner-right">
          <span className="points-badge">
            <IconTrophy />
            <span>{challenge.points} Poin</span>
          </span>
        </div>
      </div>

      {/* Top Meta Strip */}
      <div className="challenge-top-meta">
        <div className="meta-left">
          <span className={`level-badge badge-${challenge.category}`}>
            {challenge.category === 'individu' && <IconUser />}
            {challenge.category === 'kelompok' && <IconUsers />}
            {challenge.category === 'hots' && <IconBrain />}
            <span>
              {challenge.category === 'individu'
                ? `Tantangan Individu · Level ${challenge.level}`
                : challenge.category === 'kelompok'
                ? `Tantangan Kelompok · Level ${challenge.level}`
                : `Studi Kasus HOTS Analitis · Kasus ${challenge.level}`}
            </span>
          </span>
        </div>

        <div className="meta-right">
          {savedScore ? (
            <span className="status-saved-badge">
              <IconCheck />
              <span>Terselesaikan ({savedScore.score}/{savedScore.maxScore} Poin)</span>
            </span>
          ) : (
            <span className="status-pending-badge">Belum Tersimpan</span>
          )}
        </div>
      </div>

      <div className="challenge-main-heading">
        <h2>{challenge.title}</h2>
        <p className="challenge-subtitle">{challenge.subtitle}</p>
      </div>

      {/* Competency box */}
      <div className="challenge-competency">
        <strong>Target Kompetensi Komputasional:</strong>
        <span>{challenge.competency}</span>
      </div>

      {/* Group roles if present */}
      {challenge.roles && challenge.roles.length > 0 && (
        <div className="group-roles-box">
          <div className="roles-header">
            <span>Panduan Kolaborasi & Pembagian Peran Kelompok:</span>
          </div>
          <div className="roles-grid">
            {challenge.roles.map((role, idx) => {
              const parts = role.split(':')
              return (
                <div key={idx} className="role-card">
                  <span className="role-name">{parts[0]}</span>
                  <span className="role-desc">{parts[1]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Context & Task */}
      <div className="challenge-story-box">
        <h4>Konteks Permasalahan Nyata</h4>
        <p>{challenge.story}</p>
      </div>

      <div className="challenge-task-box">
        <h4>Instruksi Tugas Mandiri</h4>
        <p>{challenge.task}</p>
      </div>

      {/* Input / Output Guide */}
      <div className="challenge-io-guide">
        <div className="io-guide-item">
          <span className="guide-label">FORMAT MASUKAN (INPUT)</span>
          <pre>{challenge.inputGuide}</pre>
        </div>
        <div className="io-guide-item">
          <span className="guide-label">FORMAT KELUARAN (OUTPUT)</span>
          <pre>{challenge.outputGuide}</pre>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="challenge-testcases">
        <h4>Contoh Kasus Uji Pengamatan (Test Cases):</h4>
        <div className="testcase-table-wrap">
          <table className="testcase-table">
            <thead>
              <tr>
                <th>Kasus</th>
                <th>Masukan Program (Input)</th>
                <th>Target Keluaran yang Diharapkan</th>
              </tr>
            </thead>
            <tbody>
              {challenge.testCases.map((tc, idx) => (
                <tr key={idx}>
                  <td className="col-case">Kasus #{idx + 1}</td>
                  <td className="col-input">
                    <code>{tc.input.replace(/\n/g, ' ↵ ')}</code>
                  </td>
                  <td className="col-expected">{tc.expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISCOVERY SINTAKS 1: DEKOMPOSISI & PREDIKSI SOLUSI (INQUIRY STRATEGY) */}
      <div className="challenge-inquiry-box">
        <div className="inquiry-box-header">
          <div className="inquiry-header-left">
            <span className="inquiry-stage-tag">Sintaks Penemuan 1: Dekomposisi & Hipotesis Solusi</span>
            <h4 className="inquiry-box-title">Formulasikan Rencana Algoritmamu Sebelum Menulis Kode</h4>
          </div>
          <button
            type="button"
            className="btn-toggle-inquiry"
            onClick={() => setShowInquiryPlan(!showInquiryPlan)}
          >
            {showInquiryPlan ? 'Sembunyikan Rencana' : 'Buka Rencana Hipotesis'}
          </button>
        </div>

        {showInquiryPlan && (
          <div className="inquiry-box-body">
            <p className="inquiry-prompt">
              Berdasarkan target keluaran dan kasus uji di atas, identifikasi:
              (1) Apa saja variabel input dan tipe datanya?
              (2) Formula perhitungan atau kondisi <code>if-elif-else</code> apa yang harus diterapkan?
            </p>
            <textarea
              className="challenge-hypo-textarea"
              rows={3}
              placeholder="Contoh rencana: 1. Input nama (string) dan usia (int). 2. Cek usia < 12 tarif 10rb, elif <= 18 tarif 15rb, else 25rb. 3. Cetak hasil dengan format yang sesuai..."
              value={hypothesis}
              onChange={(e) => handleHypothesisChange(e.target.value)}
            />
            <div className="inquiry-save-indicator">
              <span>{hypothesis.trim() ? '✓ Rencana algoritma tersimpan otomatis' : 'Tuliskan rancanganmu untuk melatih computational thinking'}</span>
            </div>
          </div>
        )}
      </div>

      {/* DISCOVERY SINTAKS 2: EKSPERIMEN KODE DI COMPILER ONLINE */}
      <div className="challenge-coding-phase">
        <div className="phase-indicator-label">
          <span>Sintaks Penemuan 2: Eksperimen & Implementasi Kode Solusi</span>
        </div>

        <CodePlayground
          title={`Editor Solusi: ${challenge.title}`}
          instructions="Tulis kode program solusi secara mandiri tanpa copy-paste. Uji menggunakan masukan interaktif pada terminal untuk memverifikasi kebenaran algoritma."
          hints={challenge.hints}
          initialCode={challenge.initialCode}
          initialInput={challenge.testCases[0]?.input || ''}
          onRun={handleRunResult}
          onRunStart={() => {
            setLastRunSuccess(null)
            setSaveSuccessMsg(null)
          }}
          onChange={() => {
            if (lastRunSuccess === false) {
              setLastRunSuccess(null)
            }
            setSaveSuccessMsg(null)
          }}
        />
      </div>

      {/* DISCOVERY SINTAKS 3: VERIFIKASI & REFLEKSI PENEMUAN */}
      {lastRunSuccess === true && (
        <div className="challenge-reflection-box">
          <div className="refl-header">
            <span className="refl-badge">Sintaks Penemuan 3: Refleksi & Pembuktian Konsep</span>
            <h4 className="refl-title">Konsep Kunci Apa yang Berhasil Kamu Buktikan?</h4>
          </div>
          <p className="refl-desc">
            Selamat, programmu berhasil berjalan tanpa error! Formulasikan dalam satu kalimat prinsip komputasional atau aturan pemrograman yang telah kamu terapkan secara efektif.
          </p>
          <input
            type="text"
            className="challenge-refl-input"
            placeholder="Contoh: Saya membuktikan bahwa konversi int(input()) penting agar perbandingan usia dengan angka tidak error..."
            value={reflection}
            onChange={(e) => handleReflectionChange(e.target.value)}
          />
        </div>
      )}

      {/* Submission Footer */}
      <div className="challenge-submit-footer">
        {saveSuccessMsg && (
          <div className="save-score-alert" role="status">
            <IconCheck />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="submit-action-bar">
          <div className="submit-action-info">
            {lastRunSuccess === true ? (
              <span className="run-status success">
                <IconCheck /> Program berhasil dieksekusi tanpa error. Siap disimpan ke portofolio asesmen.
              </span>
            ) : lastRunSuccess === false ? (
              <span className="run-status error">
                <IconAlert /> Terdapat kesalahan (error) pada eksekusi program. Silakan periksa terminal, perbaiki kode, dan jalankan ulang untuk mengaktifkan tombol Simpan Nilai.
              </span>
            ) : (
              <span className="run-status neutral">
                Jalankan kode program di compiler hingga sukses tanpa error untuk mengaktifkan tombol Simpan Nilai.
              </span>
            )}
          </div>

          <div className="submit-buttons-right">
            <button
              type="button"
              className={`btn-submit-score ${lastRunSuccess !== true ? 'disabled' : ''}`}
              onClick={handleSaveScore}
              disabled={lastRunSuccess !== true || isSavingScore}
              title={
                lastRunSuccess !== true
                  ? 'Jalankan program hingga berhasil tanpa error terlebih dahulu agar tombol Simpan Nilai aktif'
                  : 'Simpan nilai ke portofolio asesmen'
              }
            >
              <IconSave />
              <span>
                {isSavingScore
                  ? 'Menyimpan...'
                  : savedScore
                  ? 'Perbarui Nilai'
                  : `Simpan Nilai (+${challenge.points} Poin)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
