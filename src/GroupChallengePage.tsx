import { useState, useEffect } from 'react'
import ChallengeRunner from './ChallengeRunner'
import CodePlayground from './CodePlayground'
import { GROUP_CHALLENGES } from './challengesData'
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCrown,
  IconTrash,
  IconAlert,
  IconCheck,
  IconUsers,
  IconBrain,
  IconCode,
  IconTrophy,
  IconSave,
} from './Icons'
import {
  getStudentProfile,
  saveStudentProfile,
  getGroupData,
  saveGroupData,
  saveChallengeScore,
  getChallengeScores,
  type GroupData,
} from './studentData'
import './GroupChallengePage.css'

type GroupChallengePageProps = {
  onBackHome: () => void
  onOpenProfile?: () => void
  onStartChallenges?: () => void
  onOpenScores?: () => void
}

type GroupViewMode = 'menu' | 'proyek-struk' | 'tantangan-lanjutan'

// 3 Theme Options for Proyek Kelompok Struk Pembelian
const RECEIPT_THEMES = [
  {
    id: 'toko',
    name: 'Tema 1: Struk Toko (Minimarket / Koperasi Sekolah)',
    badge: 'Toko / Retail',
    description:
      'Merancang sistem kasir toko untuk menjual barang fisik (misal: Buku Tulis, Pulpen, Snack). Terdapat potongan diskon 10% jika total belanja mencapai minimal Rp50.000.',
    storeName: 'KOPERASI SISWA SINAUPY MANDIRI',
    storeAddress: 'Jl. Pendidikan No. 45, Gedung Koperasi SMA',
    sampleOutput: `========================================
      KOPERASI SISWA SINAUPY MANDIRI
    Jl. Pendidikan No. 45, Gedung SMA
========================================
Tanggal  : 24/10/2026    Kasir: Budi
Pelanggan: Siti Nurhaliza
----------------------------------------
Buku Tulis        3x Rp 4.000 = Rp 12.000
Kotak Pensil      1x Rp15.000 = Rp 15.000
Snack Cokelat     2x Rp12.500 = Rp 25.000
----------------------------------------
Subtotal                  : Rp 52.000
Diskon 10%                : Rp  5.200
TOTAL PEMBAYARAN          : Rp 46.800
TUNAI                     : Rp 50.000
KEMBALIAN                 : Rp  3.200
========================================
   TERIMA KASIH ATAS KUNJUNGAN ANDA
 Barang yang dibeli tidak dapat ditukar
========================================`,
    initialCode: '',
  },
  {
    id: 'jasa',
    name: 'Tema 2: Struk Jasa (Laundry Kiloan / Servis Komputer)',
    badge: 'Jasa & Servis',
    description:
      'Merancang sistem bukti pembayaran jasa (misal: Cuci Komplit, Setrika Kilat, Cuci Sepatu). Terdapat potongan diskon member Rp5.000 jika total jasa mencapai Rp30.000.',
    storeName: 'SINAUPY KILAT LAUNDRY & CLEAN',
    storeAddress: 'Jl. Pemuda Kreatif No. 12, Area Kampus',
    sampleOutput: `========================================
     SINAUPY KILAT LAUNDRY & CLEAN
  Jl. Pemuda Kreatif No. 12, Area Kampus
========================================
Tanggal  : 24/10/2026    Operator: Fajar
Pelanggan: Ibu Rina (Member)
----------------------------------------
Cuci Komplit       4 Kg x Rp 7.000 = Rp 28.000
Setrika Express    2 Kg x Rp 5.000 = Rp 10.000
----------------------------------------
Subtotal                  : Rp 38.000
Diskon Spesial Member     : Rp  5.000
TOTAL PEMBAYARAN          : Rp 33.000
TUNAI                     : Rp 50.000
KEMBALIAN                 : Rp 17.000
========================================
  PAKAIAN SELESAI MAKSIMAL 2 HARI
 Hubungi WA 0812-3456-7890 untuk antar
========================================`,
    initialCode: '',
  },
  {
    id: 'tiket',
    name: 'Tema 3: Struk Tiket (Tiket Bioskop / Konser / Wisata)',
    badge: 'Tiket & Acara',
    description:
      'Merancang sistem pemesanan tiket pertunjukan atau bioskop. Menghitung jumlah kursi, biaya administrasi, potongan promo pelajar, dan pencetakan boarding pass tiket.',
    storeName: 'SINAUPY CINEMA XXI & TEATER',
    storeAddress: 'Mall Pelajar Lt. 3, Studio 02',
    sampleOutput: `========================================
       SINAUPY CINEMA XXI & TEATER
      Mall Pelajar Lt. 3, Studio 02
========================================
Tanggal  : 24/10/2026    Tiket: Dewasa & Anak
Pemesan  : Rizki Pratama
Judul    : Petualangan Koding Python 3
----------------------------------------
Kursi Reguler      2x Rp 35.000 = Rp 70.000
Kursi Anak         1x Rp 25.000 = Rp 25.000
Biaya Layanan Admin             = Rp  3.000
----------------------------------------
Subtotal                  : Rp 98.000
Promo Pelajar             : Rp 10.000
TOTAL PEMBAYARAN          : Rp 88.000
METODE (QRIS/CASH)        : Rp 100.000
KEMBALIAN                 : Rp 12.000
========================================
      TIKET MASUK SAH & RESMI
 Mohon hadir 15 menit sebelum film mulai
========================================`,
    initialCode: '',
  },
]

export default function GroupChallengePage({
  onBackHome,
  onOpenProfile,
  onStartChallenges,
  onOpenScores,
}: GroupChallengePageProps) {
  const profile = getStudentProfile()
  const activeStudent = profile.name && profile.name.trim() ? profile.name.trim() : 'Siswa'

  const [groupData, setGroupData] = useState<GroupData>(() => getGroupData(activeStudent))
  const [groupName, setGroupName] = useState(groupData.groupName || '')
  const [members, setMembers] = useState<string[]>(() => {
    const list = [...groupData.members]
    if (list.length === 0) list.push(activeStudent)
    list[0] = activeStudent
    while (list.length < 3) list.push('')
    return list
  })
  const [isEditing, setIsEditing] = useState(!groupData.isSaved)
  const [errorMessage, setErrorMessage] = useState('')
  const [successToast, setSuccessToast] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all')

  // Group Task Navigation State (Menu vs Pilihan 1 vs Pilihan 2)
  const [viewMode, setViewMode] = useState<GroupViewMode>('menu')

  // Proyek Kelompok Struk State
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0)
  const [receiptLastSuccess, setReceiptLastSuccess] = useState<boolean | null>(null)
  const [receiptScoreSaved, setReceiptScoreSaved] = useState(false)
  const [receiptSaveMsg, setReceiptSaveMsg] = useState<string | null>(null)

  // Discovery Collaborative Notes & Reflection
  const [receiptPlan, setReceiptPlan] = useState(() => {
    try {
      return localStorage.getItem('sinaupy_receipt_plan') || ''
    } catch {
      return ''
    }
  })
  const [receiptReflection, setReceiptReflection] = useState(() => {
    try {
      return localStorage.getItem('sinaupy_receipt_refl') || ''
    } catch {
      return ''
    }
  })

  const handleReceiptPlanChange = (val: string) => {
    setReceiptPlan(val)
    try {
      localStorage.setItem('sinaupy_receipt_plan', val)
    } catch {
      // ignore
    }
  }

  const handleReceiptReflectionChange = (val: string) => {
    setReceiptReflection(val)
    try {
      localStorage.setItem('sinaupy_receipt_refl', val)
    } catch {
      // ignore
    }
  }

  const activeTheme = RECEIPT_THEMES[selectedThemeIndex]

  // Check existing score for receipt project
  useEffect(() => {
    const scores = getChallengeScores()
    const found = scores.find((s) => s.challengeId === 'proyek-kelompok-struk')
    if (found) {
      setReceiptScoreSaved(true)
    }
  }, [])

  useEffect(() => {
    if (groupData.isSaved) {
      setIsEditing(false)
    }
  }, [groupData.isSaved])

  const handleAddMember = () => {
    if (members.length >= 8) {
      setErrorMessage('Jumlah anggota kelompok maksimal 8 orang.')
      return
    }
    setMembers([...members, ''])
    if (errorMessage) setErrorMessage('')
  }

  const handleRemoveMember = (indexToRemove: number) => {
    if (indexToRemove === 0) return
    const updated = members.filter((_, idx) => idx !== indexToRemove)
    setMembers(updated)
    if (updated.length < 3) {
      setErrorMessage('Perhatian: Kelompok membutuhkan minimal 3 anggota sebelum dapat disimpan.')
    } else {
      if (errorMessage) setErrorMessage('')
    }
  }

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...members]
    updated[index] = val
    setMembers(updated)
    if (errorMessage) setErrorMessage('')
  }

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault()

    if (!groupName.trim()) {
      setErrorMessage('Silakan isi nama kelompok terlebih dahulu.')
      return
    }

    const cleanedMembers = members.map((m) => m.trim())

    for (let i = 0; i < cleanedMembers.length; i++) {
      if (!cleanedMembers[i]) {
        setErrorMessage(`Nama anggota ke-${i + 1} tidak boleh kosong.`)
        return
      }
    }

    if (cleanedMembers.length < 3) {
      setErrorMessage('Kelompok minimal harus memiliki 3 anggota (termasuk Anda).')
      return
    }

    const lowerNames = cleanedMembers.map((n) => n.toLowerCase())
    const uniqueNames = new Set(lowerNames)
    if (uniqueNames.size !== lowerNames.length) {
      setErrorMessage('Terdapat nama anggota yang duplikat dalam kelompok.')
      return
    }

    const saved: GroupData = {
      groupName: groupName.trim(),
      members: cleanedMembers,
      isSaved: true,
    }

    saveGroupData(saved)
    const currentProfile = getStudentProfile()
    saveStudentProfile({
      ...currentProfile,
      groupName: groupName.trim(),
      groupMembers: cleanedMembers.join(', '),
    })
    setGroupData(saved)
    setIsEditing(false)
    setErrorMessage('')
    setSuccessToast('Identitas tim kelompok berhasil disimpan! Silakan pilih jenis tugas.')

    setTimeout(() => {
      setSuccessToast('')
    }, 3500)
  }

  // Handle Receipt Code Run
  const handleReceiptRun = (_code: string, output: string, success: boolean) => {
    const isError = !success || output.includes('Error:') || output.includes('EOFError')
    setReceiptLastSuccess(!isError)
    if (isError) {
      setReceiptSaveMsg(null)
    }
  }

  // Handle Save Score for Proyek Kelompok Struk
  const handleSaveReceiptScore = () => {
    const curProfile = getStudentProfile()
    if (!curProfile.name.trim() || !curProfile.className.trim()) {
      alert('Silakan lengkapi Nama Siswa dan Kelas terlebih dahulu agar nilai dapat dicatat.')
      if (onOpenProfile) onOpenProfile()
      return
    }

    saveChallengeScore({
      challengeId: 'proyek-kelompok-struk',
      title: 'Proyek Kelompok: Program Struk Pembelian',
      category: 'kelompok',
      level: 1,
      score: 100,
      maxScore: 100,
    })

    setReceiptScoreSaved(true)
    setReceiptSaveMsg(`Nilai 100 poin Proyek Kelompok berhasil disimpan untuk ${curProfile.name}.`)
    setTimeout(() => {
      setReceiptSaveMsg(null)
    }, 4500)
  }

  const filteredMissions =
    selectedLevel === 'all'
      ? GROUP_CHALLENGES
      : GROUP_CHALLENGES.filter((m) => m.level === selectedLevel)

  return (
    <div className="group-challenge-page">
      {/* Top Navigation Bar */}
      <div className="group-top-bar">
        <button
          type="button"
          className="back-btn"
          onClick={onBackHome}
          aria-label="Kembali ke Beranda"
        >
          <IconArrowLeft /> Kembali ke Beranda
        </button>

        <div className="group-top-right-actions">
          {onOpenScores && (
            <button
              type="button"
              className="scores-report-btn"
              onClick={onOpenScores}
              title="Lihat Rekap Lembar Nilai & Cetak Dokumen"
            >
              <IconTrophy /> Rekap Nilai Akademik
            </button>
          )}

          {onStartChallenges && (
            <button
              type="button"
              className="switch-page-btn"
              onClick={onStartChallenges}
              title="Pindah ke Tantangan Berjenjang Mandiri"
            >
              <IconUsers /> Tantangan Mandiri <IconArrowUpRight />
            </button>
          )}

          <div className="group-nav-tag">
            <IconUsers />
            <span>Mode Kolaborasi Kelompok</span>
          </div>
        </div>
      </div>

      {/* Hero Heading Banner */}
      <header className="group-page-header">
        <div className="group-header-text">
          <span className="section-kicker">KOLABORASI TIM · COMPUTATIONAL THINKING</span>
          <h1>Tantangan Pemrograman Kelompok</h1>
          <p>
            Bentuk tim kolaboratif, susun identitas anggota, dan selesaikan misi pemrograman Python bersama.
            Disediakan pilihan proyek praktis kasir & struk belanja serta tantangan berjenjang Level 1–4 lengkap dengan fitur unduh dokumen PDF dan Word.
          </p>
        </div>
      </header>

      {/* Bagian 1: Pengaturan Identitas Kelompok */}
      <div className="group-layout-grid">
        {/* Left Column: Form Setup Kelompok */}
        <div className="group-card form-card">
          <div className="card-header">
            <span className="card-kicker">LANGKAH 01 · IDENTITAS TIM</span>
            <h2 className="card-title">Pengaturan Kelompok</h2>
            <p className="card-subtitle">
              Tentukan nama tim dan daftarkan minimal 3 siswa untuk memulai tugas kolaborasi.
            </p>
          </div>

          {errorMessage && (
            <div className="group-alert-banner alert-error" role="alert">
              <IconAlert />
              <span>{errorMessage}</span>
            </div>
          )}

          {successToast && (
            <div className="group-alert-banner alert-success" role="status">
              <IconCheck />
              <span>{successToast}</span>
            </div>
          )}

          <form onSubmit={handleSaveGroup} className="group-setup-form">
            <div className="form-group">
              <label htmlFor="group-name-input">
                Nama Kelompok / Tim <span className="req-star">*</span>
              </label>
              <input
                id="group-name-input"
                type="text"
                placeholder="Contoh: Tim Python Kreatif"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <div className="members-label-row">
                <label>
                  Anggota Kelompok <span className="req-star">*</span>
                </label>
                <span className="members-count-tag">
                  {members.length} dari maks. 8 siswa (min. 3)
                </span>
              </div>

              <div className="members-inputs-list">
                {members.map((member, idx) => (
                  <div
                    key={idx}
                    className={`member-input-row ${idx === 0 ? 'is-leader' : ''}`}
                  >
                    <div className={`member-index-badge ${idx === 0 ? 'leader-badge' : ''}`}>
                      {idx === 0 ? <IconCrown className="crown-icon" /> : idx + 1}
                    </div>

                    <div className="member-input-control">
                      <input
                        type="text"
                        className="member-input"
                        placeholder={
                          idx === 0
                            ? `Nama Anda (Ketua): ${activeStudent}`
                            : `Nama Anggota ke-${idx + 1}`
                        }
                        value={member}
                        onChange={(e) => handleMemberChange(idx, e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                      {idx === 0 && (
                        <span className="leader-pill-tag">Ketua Tim</span>
                      )}
                    </div>

                    {isEditing && idx > 0 && (
                      <button
                        type="button"
                        className="btn-remove-member"
                        onClick={() => handleRemoveMember(idx)}
                        title={`Hapus Anggota ke-${idx + 1}`}
                        aria-label={`Hapus anggota ke-${idx + 1}`}
                      >
                        <IconTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && members.length < 8 && (
                <button
                  type="button"
                  className="btn-add-member"
                  onClick={handleAddMember}
                >
                  + Tambah Anggota Tim
                </button>
              )}
            </div>

            {isEditing && (
              <button type="submit" className="save-group-btn">
                Simpan Identitas Tim & Buka Pilihan Tugas <IconArrowUpRight />
              </button>
            )}
          </form>
        </div>

        {/* Right Column: Ringkasan Kelompok */}
        <div className="group-card summary-card">
          <div className="summary-header">
            <div>
              <h3 className="summary-title">Ringkasan Tim</h3>
              <p className="summary-subtitle">Data kelompok tersimpan</p>
            </div>
            {groupData.isSaved ? (
              <span className="status-badge-saved">
                <IconCheck /> Siap Tugas
              </span>
            ) : (
              <span className="status-badge-draft">Belum Disimpan</span>
            )}
          </div>

          <div className="summary-body">
            <div className="summary-meta-item">
              <span className="meta-label">Nama Tim</span>
              <span className="meta-value">
                {groupData.groupName || groupName || '(Belum diberi nama)'}
              </span>
            </div>

            <div className="summary-meta-item">
              <span className="meta-label">
                Anggota ({groupData.isSaved ? groupData.members.length : members.length} siswa, min. 3)
              </span>
              <ol className="summary-members-list">
                {(groupData.isSaved ? groupData.members : members).map((m, idx) => (
                  <li key={idx} className="summary-member-item">
                    {idx === 0 ? (
                      <>
                        <IconCrown className="summary-crown" />
                        <strong>{m || activeStudent} (Ketua)</strong>
                      </>
                    ) : (
                      <span>{m || <em>(Belum diisi)</em>}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="summary-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="edit-group-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Data Tim
                </button>
              ) : (
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Batal Edit
                </button>
              )}
            </div>

            <div className="summary-notice">
              <span className="notice-icon">ⓘ</span>
              <p>
                Data nama kelompok tersimpan di sesi peramban ini dan otomatis dicantumkan saat menyelesaikan tugas serta pengunduhan berkas PDF & Word.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. MENU PILIHAN TUGAS KELOMPOK (Setelah Identitas Disimpan)
          ==================================================================== */}
      {viewMode === 'menu' && (
        <section className="group-task-selection-section" id="menu-pilihan-tugas">
          <div className="selection-header">
            <span className="section-kicker">LANGKAH 02 · PILIH JENIS TUGAS KELOMPOK</span>
            <h2 className="selection-title">Pilih Tugas Pemrograman Tim</h2>
            <p className="selection-sub">
              Silakan pilih salah satu dari dua jalur tugas di bawah ini. Dokumen lembar kerja dapat diunduh dalam format <strong>PDF</strong> dan <strong>Word (.doc)</strong> pada setiap tugas.
            </p>
          </div>

          <div className="group-task-options-grid">
            {/* Pilihan 1: Proyek Kelompok */}
            <div className="task-option-card card-proyek" onClick={() => setViewMode('proyek-struk')}>
              <div className="option-top-row">
                <span className="option-badge badge-proyek">PILIHAN 1 · PROYEK KELOMPOK</span>
                <span className="option-pts-badge">100 Poin</span>
              </div>

              <div className="option-icon-box icon-proyek">
                <IconCode />
              </div>

              <h3 className="option-title">Proyek Kelompok — Program Struk Pembelian</h3>
              <p className="option-desc">
                Rancang aplikasi kasir komersial terpadu yang memproses belanja pelanggan, menghitung diskon otomatis, dan mencetak struk transaksi berbingkai rapi dengan teknik <em>f-string formatting</em>.
              </p>

              <div className="option-highlights">
                <div className="highlight-item">
                  <IconCheck />
                  <span>Dikerjakan berkelompok (2 siswa per proyek)</span>
                </div>
                <div className="highlight-item">
                  <IconCheck />
                  <span>3 Pilihan Tema: Toko Retail, Jasa Laundry, atau Tiket</span>
                </div>
                <div className="highlight-item">
                  <IconCheck />
                  <span>Unduh Lembar Kerja PDF & Word (.doc) Lengkap</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-select-task btn-select-proyek"
                onClick={(e) => {
                  e.stopPropagation()
                  setViewMode('proyek-struk')
                }}
              >
                Pilih Proyek Struk Pembelian <IconArrowUpRight />
              </button>
            </div>

            {/* Pilihan 2: Tantangan Lanjutan Level 1-4 */}
            <div className="task-option-card card-lanjutan" onClick={() => setViewMode('tantangan-lanjutan')}>
              <div className="option-top-row">
                <span className="option-badge badge-lanjutan">PILIHAN 2 · TANTANGAN BERTINGKAT</span>
                <span className="option-pts-badge">400 Poin</span>
              </div>

              <div className="option-icon-box icon-lanjutan">
                <IconTrophy />
              </div>

              <h3 className="option-title">Tantangan Lanjutan — Level 1 s/d 4</h3>
              <p className="option-desc">
                Selesaikan 4 level tantangan pemrograman kolaboratif terstruktur, mulai dari logika kasir koperasi, rekap presensi kelas, tarif parkir cerdas, hingga diskon bertingkat dengan rubrik peran tim.
              </p>

              <div className="option-highlights">
                <div className="highlight-item">
                  <IconCheck />
                  <span>4 Misi Bertahap: Level 1, Level 2, Level 3, Level 4</span>
                </div>
                <div className="highlight-item">
                  <IconCheck />
                  <span>Rubrik 3 Peran Tim (Analis, Programmer, Penguji)</span>
                </div>
                <div className="highlight-item">
                  <IconCheck />
                  <span>Dilengkapi Kasus Uji Interaktif & Panduan Peran Tim</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-select-task btn-select-lanjutan"
                onClick={(e) => {
                  e.stopPropagation()
                  setViewMode('tantangan-lanjutan')
                }}
              >
                Buka Tantangan Lanjutan (Level 1–4) <IconArrowUpRight />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          3. PILIHAN 1: PROYEK KELOMPOK — PROGRAM STRUK PEMBELIAN
          ==================================================================== */}
      {viewMode === 'proyek-struk' && (
        <section className="group-project-section" id="proyek-struk">
          {/* Top Bar with Back Button & Document Downloads */}
          <div className="project-view-top-bar">
            <button
              type="button"
              className="btn-back-to-menu"
              onClick={() => setViewMode('menu')}
            >
              <IconArrowLeft /> Kembali ke Pilihan Tugas
            </button>
          </div>

          <div className="project-main-card">
            <div className="project-card-header">
              <div className="project-header-left">
                <span className="project-kicker">PROYEK KOLABORATIF · KELOMPOK INFORMATIKA</span>
                <h2 className="project-title">Program Kasir & Struk Pembelian</h2>
                <p className="project-subtitle">
                  Rancang sistem kasir interaktif berbasis Python yang menerima pesanan, menghitung subtotal & diskon otomatis, serta mencetak struk belanja berbingkai rapi.
                </p>
              </div>
              <div className="project-header-badge">
                <IconTrophy />
                <span>100 Poin Proyek</span>
              </div>
            </div>

            {/* Tujuan Pembelajaran Box */}
            <div className="project-box objectives-box">
              <h4 className="box-title">Tujuan Pembelajaran (Learning Objectives)</h4>
              <ol className="objectives-list">
                <li>Menerapkan variabel, tipe data dinamis (string, int, float), dan kalkulasi aritmetika pada simulasi transaksi bisnis nyata.</li>
                <li>Mengimplementasikan percabangan logika (<code>if-elif-else</code>) untuk perhitungan diskon bertingkat / keanggotaan.</li>
                <li>Menguasai teknik pemformatan teks f-string (alignment rata kiri-kanan, padding spasi, dan pemisah ribuan) agar struk rapi dan sejajar.</li>
                <li>Membangun kerja sama kolaboratif dalam tim (2 siswa atau sesuai kelompok) dalam merancang, mengoding, dan memverifikasi aplikasi.</li>
              </ol>
            </div>

            {/* SINTAKS 1: IDENTIFIKASI MASALAH & PEMILIHAN TEMA KASIR */}
            <div className="project-box theme-selection-box">
              <div className="stage-step-tag">
                <span>Sintaks Penemuan 1: Identifikasi Masalah & Pemilihan Kasus Transaksi</span>
              </div>
              <h4 className="box-title">Pilih Tema Kasir Kelompokmu:</h4>
              <p className="theme-intro-text">
                Pilih salah satu konteks bisnis nyata di bawah ini. Skenario perhitungan harga, diskon bersyarat, dan format struk akan disesuaikan dengan tema pilihan timmu.
              </p>

              <div className="themes-grid">
                {RECEIPT_THEMES.map((theme, idx) => (
                  <div
                    key={theme.id}
                    className={`theme-card ${selectedThemeIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedThemeIndex(idx)
                    }}
                  >
                    <div className="theme-card-top">
                      <span className="theme-badge">{theme.badge}</span>
                      {selectedThemeIndex === idx && <span className="theme-selected-tag">Dipilih ✓</span>}
                    </div>
                    <h5 className="theme-name">{theme.name}</h5>
                    <p className="theme-desc">{theme.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SINTAKS 2: DEKOMPOSISI DATA & VARIABEL TRANSAKSI */}
            <div className="project-box requirements-box">
              <div className="stage-step-tag">
                <span>Sintaks Penemuan 2: Dekomposisi Kebutuhan Data & Pemodelan Variabel</span>
              </div>
              <h4 className="box-title">Ketentuan Variabel & Struktur Data Transaksi:</h4>
              <ul className="requirements-list">
                <li><strong>Identitas Penyedia & Kasir:</strong> Gunakan variabel teks (string) untuk nama toko, alamat, tanggal transaksi, nama kasir, dan nama pelanggan.</li>
                <li><strong>Data Barang Belanjaan:</strong> Minta masukan 2–3 barang dengan nama item (string), harga satuan (integer/float), dan jumlah beli (integer).</li>
                <li><strong>Perhitungan Aritmetika:</strong> Hitung subtotal tiap item (<code>harga * jumlah</code>), subtotal kotor keseluruhan, dan potongan diskon bersyarat.</li>
                <li><strong>Percabangan Logika Diskon:</strong> Gunakan percabangan <code>if-elif-else</code> untuk mengecek kelayakan diskon (misal belanja minimal Rp50.000 atau status member).</li>
                <li><strong>Pembayaran & Kembalian:</strong> Hitung total akhir setelah diskon, baca nominal uang bayar pembeli, dan hitung kembalian (<code>uang_bayar - total_akhir</code>).</li>
                <li><strong>Pemformatan Struk Rapi (f-string):</strong> Terapkan format f-string dengan penentu lebar kolom (contoh: <code>{'f"{\'Item\':<16} {qty:>2}x Rp{harga:>8,}"'}</code>) agar kolom teks rata kiri dan angka rata kanan.</li>
              </ul>
            </div>

            {/* Contoh Format Struk Kasir */}
            <div className="project-box preview-receipt-box">
              <h4 className="box-title">Target Hasil Cetak Struk Kasir ({activeTheme.badge}):</h4>
              <pre className="receipt-preview-screen">{activeTheme.sampleOutput}</pre>
            </div>

            {/* SINTAKS 3: PERENCANAAN ALGORITMA KOLABORATIF */}
            <div className="project-box planning-box" style={{ background: '#F8FAFD', border: '2px solid #BFDBFE', borderRadius: '12px', padding: '18px 20px', marginBottom: '20px' }}>
              <div className="stage-step-tag">
                <span>Sintaks Penemuan 3: Perumusan Hipotesis & Rencana Algoritma Bersama</span>
              </div>
              <h4 className="box-title" style={{ margin: '4px 0 8px', fontSize: '0.94rem', color: '#17365D' }}>
                Rencana Alur Program Kasir Tim
              </h4>
              <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                Diskusikan bersama anggota tim sebelum mengoding. Tuliskan ringkasan rencana variabel, kondisi diskon yang dipakai, dan formula hitung kembalian:
              </p>
              <textarea
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  color: '#17365D',
                  resize: 'vertical',
                }}
                rows={3}
                placeholder="Contoh rencana tim: 1. Baca data toko dan kasir. 2. Loop / input 3 barang, simpan nama, harga, qty. 3. Total kotor = item1 + item2 + item3. 4. If total >= 50.000 diskon 10%, else diskon 0. 5. Bayar dan cetak dengan f-string..."
                value={receiptPlan}
                onChange={(e) => handleReceiptPlanChange(e.target.value)}
              />
              <div style={{ textAlign: 'right', marginTop: '6px', fontSize: '0.72rem', color: '#187447', fontWeight: 700 }}>
                {receiptPlan.trim() ? '✓ Rencana algoritma kelompok tersimpan otomatis' : 'Catat kesepakatan rancangan tim di sini'}
              </div>
            </div>

            {/* SINTAKS 4: PEMBAGIAN PERAN KOLABORATIF */}
            <div className="project-box roles-box" style={{ background: '#FFFDF5', border: '1.5px solid #FDE68A', borderRadius: '12px', padding: '18px 20px', marginBottom: '20px' }}>
              <div className="stage-step-tag">
                <span style={{ color: '#92400E' }}>Sintaks Penemuan 4: Pembagian Peran Kolaboratif Tim</span>
              </div>
              <h4 className="box-title" style={{ margin: '4px 0 10px', fontSize: '0.94rem', color: '#92400E' }}>
                Pembagian Tugas Tim ({groupData.groupName || 'Tim Kasir'})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', borderRadius: '8px', padding: '10px 12px' }}>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: '#17365D', marginBottom: '2px' }}>Peran 1: Analis Kebutuhan</strong>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Menentukan struktur input, syarat diskon, dan menghitung target keluaran secara manual.</span>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', borderRadius: '8px', padding: '10px 12px' }}>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: '#17365D', marginBottom: '2px' }}>Peran 2: Lead Programmer</strong>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Mengetik kode Python di editor, merangkai f-string, dan menyusun formula diskon.</span>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', borderRadius: '8px', padding: '10px 12px' }}>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: '#17365D', marginBottom: '2px' }}>Peran 3: Quality Tester</strong>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Menjalankan kode di terminal, menguji transaksi batas, dan memverifikasi kembalian uang.</span>
                </div>
              </div>
            </div>

            {/* Rubrik Penilaian Proyek */}
            <div className="project-box rubric-box">
              <h4 className="box-title">Rubrik Kriteria Penilaian Proyek:</h4>
              <div className="rubric-table-wrap">
                <table className="rubric-table">
                  <thead>
                    <tr>
                      <th style={{ width: '28%' }}>Kriteria Penilaian</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Bobot</th>
                      <th style={{ width: '60%' }}>Deskripsi Capaian Kompetensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>1. Kelengkapan Identitas Struk</strong></td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#315D9B' }}>20%</td>
                      <td>Memuat nama toko/jasa, tanggal, kasir, pelanggan, footer struk, dan ucapan terima kasih.</td>
                    </tr>
                    <tr>
                      <td><strong>2. Akurasi Perhitungan & Diskon</strong></td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#315D9B' }}>30%</td>
                      <td>Kuantitas, subtotal, potongan diskon bersyarat (if-else), dan kembalian 100% presisi tanpa bug.</td>
                    </tr>
                    <tr>
                      <td><strong>3. Kerapian Format Struk f-string</strong></td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#315D9B' }}>30%</td>
                      <td>Memanfaatkan string padding dan formatting agar teks rata kiri, angka rata kanan, dan rapi sejajar.</td>
                    </tr>
                    <tr>
                      <td><strong>4. Kolaborasi & Refleksi Tim</strong></td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#315D9B' }}>20%</td>
                      <td>Kerja sama kelompok seimbang, kode terdokumentasi, dan refleksi pemecahan masalah tuntas.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SINTAKS 5: IMPLEMENTASI KODE DI ONLINE COMPILER */}
            <div className="project-code-section">
              <div className="stage-step-tag" style={{ marginBottom: '8px' }}>
                <span>Sintaks Penemuan 5: Implementasi Kode & Pengujian Nyata di Compiler</span>
              </div>
              <h4 className="code-section-title">Editor Koding Proyek ({activeTheme.badge}):</h4>
              <p className="code-section-sub">
                Tulis dan sempurnakan program struk pembelian bersama kelompokmu secara mandiri. Gunakan terminal interaktif untuk menguji variasi masukan pelanggan dan nominal uang bayar.
              </p>

              <CodePlayground
                title={`Proyek Kasir: ${activeTheme.name}`}
                instructions="Sempurnakan kode program kasir di bawah ini. Pastikan program meminta masukan nama kasir, pelanggan, barang belanjaan, nominal bayar, dan mencetak struk rapi."
                hints={[
                  'Gunakan input() untuk meminta nama pelanggan dan tanggal.',
                  'Gunakan int(input()) untuk membaca harga barang dan kuantitas agar dapat dihitung secara matematis.',
                  'Gunakan f-string dengan tanda koma (:,) untuk menambahkan pemisah ribuan otomatis pada rupiah.',
                  'Gunakan tanda garis (= atau -) sebanyak 40 karakter menggunakan operator print("=" * 40).',
                ]}
                initialCode={activeTheme.initialCode}
                onRun={handleReceiptRun}
              />

              {/* SINTAKS 6: EVALUASI & REFLEKSI PEMBELAJARAN PROYEK */}
              {receiptLastSuccess === true && (
                <div style={{ marginTop: '20px', background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '12px', padding: '18px 20px' }}>
                  <span style={{ display: 'inline-block', fontSize: '0.68rem', fontWeight: 850, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                    Sintaks Penemuan 6: Evaluasi, Generalisasi, & Refleksi Kelompok
                  </span>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.94rem', fontWeight: 850, color: '#14532D' }}>
                    Refleksi Komputasional Tim atas Keberhasilan Proyek
                  </h4>
                  <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                    Selamat, program struk berhasil berjalan tuntas! Tuliskan apa wawasan atau teknik koding terpenting yang tim pelajari (misal cara f-string meratakan angka atau validasi diskon):
                  </p>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      border: '1.5px solid #86EFAC',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      color: '#14532D',
                      background: '#FFFFFF',
                    }}
                    placeholder="Contoh: Kami belajar bahwa f-string {:>8,} sangat memudahkan perataan nominal uang ke kanan sehingga struk terlihat seperti cetakan mesin kasir asli..."
                    value={receiptReflection}
                    onChange={(e) => handleReceiptReflectionChange(e.target.value)}
                  />
                </div>
              )}

              {/* Submit & Score Action Bar */}
              <div className="project-submission-bar">
                {receiptSaveMsg && (
                  <div className="project-alert-status" role="status">
                    <IconCheck />
                    <span>{receiptSaveMsg}</span>
                  </div>
                )}

                <div className="submission-content">
                  <div className="submission-info">
                    {receiptLastSuccess === true ? (
                      <span className="run-status success">
                        <IconCheck /> Program struk berhasil dieksekusi tanpa error. Siap disimpan ke rekap nilai kelompok.
                      </span>
                    ) : receiptLastSuccess === false ? (
                      <span className="run-status error">
                        <IconAlert /> Program mengalami error atau belum selesai dieksekusi. Periksa terminal di atas.
                      </span>
                    ) : (
                      <span className="run-status neutral">
                        Uji program kasir di editor, lalu simpan nilai asesmen kelompokmu di sini.
                      </span>
                    )}
                  </div>

                  <div className="submission-btns">
                    <button
                      type="button"
                      className="btn-submit-score"
                      onClick={handleSaveReceiptScore}
                    >
                      <IconSave />
                      <span>{receiptScoreSaved ? 'Perbarui Nilai Proyek' : 'Simpan Nilai Proyek (+100 Poin)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          4. PILIHAN 2: TANTANGAN LANJUTAN — LEVEL 1 S/D 4
          ==================================================================== */}
      {viewMode === 'tantangan-lanjutan' && (
        <div className="group-lanjutan-wrapper" id="tantangan-lanjutan">
          {/* Top Bar with Back to Menu */}
          <div className="lanjutan-top-bar">
            <button
              type="button"
              className="btn-back-to-menu"
              onClick={() => setViewMode('menu')}
            >
              <IconArrowLeft /> Kembali ke Pilihan Tugas
            </button>
            <span className="lanjutan-badge-info">
              4 Level Tantangan Pemrograman Kolaboratif
            </span>
          </div>

          {/* Rubrik Pembagian Peran Kolaborasi */}
          <div className="group-roles-guide-card">
            <div className="roles-guide-header">
              <span className="roles-badge">STRATEGI KERJA SAMA</span>
              <h3>Rubrik Peran Kolaboratif di SinauPy</h3>
              <p>
                Setiap anggota tim disarankan berbagi peran secara bergantian pada setiap tantangan untuk memaksimalkan pemahaman komputasional.
              </p>
            </div>

            <div className="roles-three-grid">
              <div className="role-pillar-card">
                <div className="pillar-header">
                  <span className="role-icon-wrap"><IconBrain /></span>
                  <span className="pillar-title">1. Analis Masalah</span>
                </div>
                <p>
                  Membaca skenario studi kasus, menentukan tipe input, menghitung rumus matematis secara manual, serta menetapkan batasan logika program.
                </p>
              </div>

              <div className="role-pillar-card">
                <div className="pillar-header">
                  <span className="role-icon-wrap"><IconCode /></span>
                  <span className="pillar-title">2. Programmer Algoritma</span>
                </div>
                <p>
                  Mengetik sintaks kode Python secara mandiri di editor, menyusun struktur percabangan/perulangan, dan memastikan penamaan variabel rapi.
                </p>
              </div>

              <div className="role-pillar-card">
                <div className="pillar-header">
                  <span className="role-icon-wrap"><IconCheck /></span>
                  <span className="pillar-title">3. Penguji Kasus Uji</span>
                </div>
                <p>
                  Memvalidasi hasil keluaran terminal terhadap tabel kasus uji (test case), mengidentifikasi bug/error logika, dan menyetujui submisi nilai.
                </p>
              </div>
            </div>
          </div>

          {/* Daftar Misi Tantangan Kelompok Level 1-4 */}
          <section id="misi-kelompok" className="group-missions-section" aria-labelledby="missions-title">
            <div className="missions-header-row">
              <div>
                <span className="section-kicker">MISI TIM BERTINGKAT (LEVEL 1 – 4)</span>
                <h2 id="missions-title" className="missions-title">
                  Daftar Misi Koding Kelompok
                </h2>
                <p className="missions-sub">
                  Selesaikan 4 level tantangan kolaboratif di bawah ini bersama anggota timmu. Setiap misi dilengkapi panduan kasus uji dan rubrik peran tim yang jelas.
                </p>
              </div>

              {/* Level Filter Pills */}
              <div className="missions-level-pills">
                <button
                  type="button"
                  className={`lvl-pill ${selectedLevel === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('all')}
                >
                  Semua ({GROUP_CHALLENGES.length})
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

            <div className="group-challenge-runners-list">
              {filteredMissions.map((mission) => (
                <ChallengeRunner
                  key={mission.id}
                  challenge={mission}
                  onRequestProfileModal={onOpenProfile || (() => {})}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
