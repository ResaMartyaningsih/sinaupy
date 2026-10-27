import { useState } from 'react'
import CodePlayground from './CodePlayground'
import {
  IconArrowLeft,
  IconCode,
  IconLock,
  IconCheck,
  IconTerminal,
} from './Icons'
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

  const handleBack = () => {
    if (onBack) onBack()
    else if (onBackHome) onBackHome()
    else window.history.back()
  }

  const displayedExercises =
    activeFilter === 'all'
      ? exercises
      : exercises.filter((ex) => ex.id === activeFilter)

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
          <span>4 Modul Latihan Interaktif</span>
        </div>
      </div>

      {/* Main Framed Header Banner */}
      <header className="practice-page-heading">
        <div className="practice-heading-content">
          <span className="section-kicker">LATIHAN TERBIMBING · HANDS-ON CODING</span>
          <h1 id="practice-page-title">Latihan Pemrograman Mandiri</h1>
          <p>
            Kembangkan intuisi dan memori otot kodingmu dengan mengetik sintaks secara mandiri.
            Setiap latihan dilengkapi skenario masalah nyata, petunjuk pengerjaan terarah, verifikasi output langsung di peramban, serta pembuktian konsep secara mandiri.
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
              <span>Eksekusi & Pembuktian Langsung</span>
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
          {exercises.map((ex) => (
            <button
              key={ex.id}
              type="button"
              className={`filter-btn ${activeFilter === ex.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(ex.id)}
            >
              Modul {ex.id}: {ex.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="practice-exercise-list">
        {displayedExercises.map((exercise) => (
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
            />
          </article>
        ))}
      </div>
    </section>
  )
}
