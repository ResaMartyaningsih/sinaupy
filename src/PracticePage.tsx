import { useState, useEffect } from 'react'
import CodePlayground from './CodePlayground'
import {
  IconArrowLeft,
  IconCode,
  IconLock,
  IconCheck,
  IconTerminal,
  IconAlert,
  IconSave,
} from './Icons'
import {
  getStudentProfile,
  saveChallengeScore,
  getChallengeScores,
  type ChallengeScore,
} from './studentData'
import './PracticePage.css'

type PracticePageProps = {
  onBack?: () => void
  onBackHome?: () => void
}

const exercises = [
  {
    id: 1,
    title: 'Salam Personal & Input Dinamis',
    concept: 'Variabel, Input Teks, dan Fungsi print()',
    difficulty: 'Dasar',
    bonusPoints: 25,
    task: 'Minta nama pengguna dan nama kelas melalui perintah input(). Tampilkan pesan salam yang menyebutkan keduanya secara rapi.',
    targetOutput: 'Halo [Nama], selamat datang di kelas [Kelas]!',
    hints: [
      'Gunakan nama = input("Nama: ") dan kelas = input("Kelas: ") untuk menyimpan data.',
      'Gunakan fungsi print() dengan f-string untuk menampilkan salam yang rapi, contoh: print(f"Halo {nama}, selamat belajar di kelas {kelas}!")',
      'Coba masukkan nama dan kelas yang berbeda pada kotak input untuk menguji ketepatan program.',
    ],
  },
  {
    id: 2,
    title: 'Perhitungan Luas Segitiga',
    concept: 'Konversi Tipe Data dan Operator Aritmatika',
    difficulty: 'Dasar',
    bonusPoints: 25,
    task: 'Minta nilai alas dan tinggi segitiga dari pengguna. Hitung luas segitiga menggunakan rumus matematis 0.5 × alas × tinggi, lalu cetak hasilnya.',
    targetOutput: 'Luas segitiga dengan alas ... dan tinggi ... adalah ...',
    hints: [
      'Gunakan float(input(...)) agar angka bernilai desimal dapat dihitung dengan benar tanpa error konversi.',
      'Simpan hasil perkalian pada variabel luas = 0.5 * alas * tinggi.',
      'Cetak hasil perhitungan dengan format label yang informatif dan mudah dipahami.',
    ],
  },
  {
    id: 3,
    title: 'Pemeriksa Kelulusan KKM',
    concept: 'Percabangan Logika If-Else & Evaluasi Kondisi',
    difficulty: 'Menengah',
    bonusPoints: 25,
    task: 'Minta nilai ujian siswa (0-100). Tampilkan "Tuntas KKM" jika nilai minimal 75, dan "Perlu Bimbingan Remedial" jika nilai kurang dari 75.',
    targetOutput: 'Nilai: 80 -> Status: Tuntas KKM',
    hints: [
      'Ubah teks input menjadi integer menggunakan int(input(...)).',
      'Gunakan perbandingan logika if nilai >= 75: dan blok penutup else:',
      'Uji program dengan berbagai nilai batas: 75, nilai tuntas (misal 90), dan nilai remedial (misal 65).',
    ],
  },
  {
    id: 4,
    title: 'Daftar Petugas Piket Kelas',
    concept: 'Struktur Data List dan Perulangan For',
    difficulty: 'Menengah',
    bonusPoints: 25,
    task: 'Simpan nama-nama petugas piket dalam sebuah list, kemudian tampilkan setiap nama secara berurutan lengkap dengan nomor urutnya.',
    targetOutput: '1. Rani\n2. Budi\n3. Doni',
    hints: [
      'Buat list dengan kurung siku, misalnya: piket = ["Rani", "Budi", "Doni"].',
      'Gunakan perulangan for nama in piket: untuk membaca tiap elemen.',
      'Gunakan fungsi enumerate(piket, start=1) untuk memberikan nomor urut otomatis yang rapi.',
    ],
  },
]

export default function PracticePage({ onBack, onBackHome }: PracticePageProps) {
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all')
  const [scores, setScores] = useState<ChallengeScore[]>(getChallengeScores)
  const [runStatuses, setRunStatuses] = useState<Record<number, boolean | null>>({})
  const [savingModulId, setSavingModulId] = useState<number | null>(null)
  const [toastMsg, setToastMsg] = useState<{ id: number; msg: string } | null>(null)

  useEffect(() => {
    const handleScoresUpdate = () => setScores(getChallengeScores())
    window.addEventListener('sinaupy:scores_updated', handleScoresUpdate)
    return () => window.removeEventListener('sinaupy:scores_updated', handleScoresUpdate)
  }, [])

  const handleBack = () => {
    if (onBack) onBack()
    else if (onBackHome) onBackHome()
    else window.history.back()
  }

  const handleRunResult = (exerciseId: number, output: string, success: boolean) => {
    const isError = !success || output.includes('Error:') || output.includes('Traceback') || output.includes('EOFError')
    setRunStatuses((prev) => ({ ...prev, [exerciseId]: !isError }))
  }

  const handleRunStart = (exerciseId: number) => {
    setRunStatuses((prev) => ({ ...prev, [exerciseId]: null }))
    setToastMsg(null)
  }

  const handleCodeChange = (exerciseId: number) => {
    // When code is edited, reset prior run state
    setRunStatuses((prev) => ({ ...prev, [exerciseId]: null }))
    setToastMsg(null)
  }

  const handleClaimBonus = async (exercise: typeof exercises[0]) => {
    if (runStatuses[exercise.id] !== true) {
      alert('Jalankan latihan di compiler hingga sukses tanpa pesan error terlebih dahulu agar bonus poin dapat dicatat.')
      return
    }

    const profile = getStudentProfile()
    if (!profile.name.trim() || !profile.className.trim()) {
      alert('Silakan lengkapi identitas Nama Siswa dan Kelas terlebih dahulu.')
      return
    }

    setSavingModulId(exercise.id)
    const result = await saveChallengeScore({
      challengeId: `praktik-modul-${exercise.id}`,
      title: `Praktik Mandiri: ${exercise.title}`,
      category: 'praktik',
      level: 1,
      score: exercise.bonusPoints,
      maxScore: exercise.bonusPoints,
    })
    setSavingModulId(null)
    setScores(getChallengeScores())

    setToastMsg({
      id: exercise.id,
      msg: result.message || `Bonus +${exercise.bonusPoints} poin Modul ${exercise.id} berhasil dicatat!`,
    })
    setTimeout(() => setToastMsg(null), 5000)
  }

  const displayedExercises =
    activeFilter === 'all'
      ? exercises
      : exercises.filter((ex) => ex.id === activeFilter)

  const claimedCount = scores.filter((s) => s.category === 'praktik').length
  const totalBonusPointsClaimed = scores
    .filter((s) => s.category === 'praktik')
    .reduce((sum, s) => sum + s.score, 0)

  return (
    <section className="practice-page" aria-labelledby="practice-page-title">
      {/* Top Bar with Navigation */}
      <div className="practice-top-bar">
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

        <div className="practice-status-badge">
          <IconTerminal />
          <span>4 Modul Latihan · Bonus Terklaim: {claimedCount}/4 (+{totalBonusPointsClaimed} Poin)</span>
        </div>
      </div>

      {/* Main Framed Header Banner */}
      <header className="practice-page-heading">
        <div className="practice-heading-content">
          <span className="section-kicker">LATIHAN TERBIMBING · NILAI BONUS OPSIONAL</span>
          <h1 id="practice-page-title">Latihan Pemrograman Mandiri</h1>
          <p>
            Kembangkan intuisi dan memori otot kodingmu dengan mengetik sintaks secara mandiri.
            Setiap modul latihan yang diselesaikan memberikan <strong>+25 Poin Bonus</strong> untuk menambah akumulasi nilaimu.
            Modul praktik ini bersifat fleksibel: <em>dikerjakan mendapatkan nilai tambah, dan tidak dikerjakan tidak akan mengurangi nilai pokok tantangan</em>.
          </p>

          <div className="practice-highlights-strip">
            <div className="highlight-pill">
              <IconLock />
              <span>Anti-Paste Aktif (Ketik Mandiri)</span>
            </div>
            <div className="highlight-pill">
              <IconCode />
              <span>WebAssembly Python 3.12</span>
            </div>
            <div className="highlight-pill">
              <IconCheck />
              <span>Bonus Nilai Tambahan (+25 Poin / Modul)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Tabs with Crisp Borders */}
      <div className="practice-filter-bar">
        <span className="filter-label">Pilih Modul:</span>
        <div className="filter-buttons-group">
          <button
            type="button"
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Semua Latihan (4)
          </button>
          {exercises.map((ex) => {
            const isDone = scores.some((s) => s.challengeId === `praktik-modul-${ex.id}`)
            return (
              <button
                key={ex.id}
                type="button"
                className={`filter-btn ${activeFilter === ex.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(ex.id)}
              >
                Modul {ex.id}: {ex.title.split('&')[0].trim()} {isDone && '✓'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Exercise List */}
      <div className="practice-exercise-list">
        {displayedExercises.map((exercise) => {
          const savedEntry = scores.find((s) => s.challengeId === `praktik-modul-${exercise.id}`)
          const isSuccessful = runStatuses[exercise.id] === true
          const hasError = runStatuses[exercise.id] === false

          return (
            <article className="practice-exercise-card" key={exercise.title}>
              {/* Header Strip with Borders */}
              <div className="practice-card-header">
                <div className="card-header-left">
                  <div className="practice-number-pill">
                    Modul {String(exercise.id).padStart(2, '0')}
                  </div>
                  <div className="practice-meta">
                    <div className="practice-meta-top">
                      <span className="practice-concept-tag">{exercise.concept}</span>
                      <span className="practice-diff-tag">{exercise.difficulty}</span>
                    </div>
                    <h2>{exercise.title}</h2>
                  </div>
                </div>

                <div className="card-header-right">
                  <span className={`practice-bonus-pill ${savedEntry ? 'claimed' : ''}`}>
                    {savedEntry ? `✓ Bonus Terklaim (+${exercise.bonusPoints} Poin)` : `🎁 Bonus +${exercise.bonusPoints} Poin`}
                  </span>
                </div>
              </div>

              {/* Structured Task Box with Left Border Accent */}
              <div className="practice-task-container">
                <div className="task-header">
                  <strong>Skenario Tugas:</strong>
                </div>
                <p className="task-description">{exercise.task}</p>
                {exercise.targetOutput && (
                  <div className="task-target-strip">
                    <span className="target-label">Ekspektasi Output:</span>
                    <code className="target-code">{exercise.targetOutput}</code>
                  </div>
                )}
              </div>

              {/* Interactive Code Playground */}
              <CodePlayground
                title={`Latihan ${exercise.id}: ${exercise.title}`}
                instructions={exercise.task}
                hints={exercise.hints}
                onRun={(_code, output, success) => handleRunResult(exercise.id, output, success)}
                onRunStart={() => handleRunStart(exercise.id)}
                onChange={() => handleCodeChange(exercise.id)}
              />

              {/* Toast Notification Alert */}
              {toastMsg && toastMsg.id === exercise.id && (
                <div className="bonus-toast-banner" role="status">
                  <IconCheck />
                  <span>{toastMsg.msg}</span>
                </div>
              )}

              {/* Bonus Points Submission Bar */}
              <div className="practice-bonus-footer">
                <div className="bonus-status-info">
                  {isSuccessful ? (
                    <span className="run-status success">
                      <IconCheck /> Latihan berhasil dieksekusi tanpa error! Klaim bonus +{exercise.bonusPoints} poin untuk menambah portofolio nilaimu.
                    </span>
                  ) : hasError ? (
                    <span className="run-status error">
                      <IconAlert /> Terdapat kesalahan (error) pada program. Perbaiki kode di editor dan jalankan ulang untuk membuka klaim bonus.
                    </span>
                  ) : savedEntry ? (
                    <span className="run-status success">
                      <IconCheck /> Bonus +{exercise.bonusPoints} Poin telah dicatat di portofolio nilai. Kamu tetap bisa bereksperimen kapan saja.
                    </span>
                  ) : (
                    <span className="run-status neutral">
                      💡 Kerjakan dan jalankan program di compiler hingga sukses tanpa error untuk mengklaim bonus +{exercise.bonusPoints} poin (opsional / tidak mengurangi nilai pokok).
                    </span>
                  )}
                </div>

                <div className="bonus-action-buttons">
                  <button
                    type="button"
                    className={`btn-claim-bonus ${!isSuccessful ? 'disabled' : ''}`}
                    onClick={() => handleClaimBonus(exercise)}
                    disabled={!isSuccessful || savingModulId === exercise.id}
                    title={
                      !isSuccessful
                        ? 'Jalankan program hingga berhasil tanpa error terlebih dahulu agar tombol klaim bonus aktif'
                        : 'Klaim bonus nilai'
                    }
                  >
                    <IconSave />
                    <span>
                      {savingModulId === exercise.id
                        ? 'Menyimpan...'
                        : savedEntry
                        ? `Perbarui Bonus (+${exercise.bonusPoints} Poin)`
                        : `Klaim Bonus (+${exercise.bonusPoints} Poin)`}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
