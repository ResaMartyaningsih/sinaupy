import { useState, useEffect } from 'react'
import {
  getStudentProfile,
  getChallengeScores,
  calculateTotalScore,
  resetAllScores,
  getGroupData,
  syncScoresWithCloud,
  type StudentProfile,
  type ChallengeScore,
  type GroupData,
} from './studentData'
import { isSupabaseConfigured, getCurrentAuthUser } from './supabaseClient'
import {
  IconClose,
  IconPrinter,
  IconTrash,
  IconEdit,
  IconTrophy,
  IconDownload,
  IconCheck,
  IconAlert,
} from './Icons'
import './ScoreReportModal.css'

type ScoreReportModalProps = {
  isOpen: boolean
  onClose: () => void
  onOpenProfile: () => void
}

type ActivityFilter = 'all' | 'individu' | 'kelompok' | 'hots'

export default function ScoreReportModal({
  isOpen,
  onClose,
  onOpenProfile,
}: ScoreReportModalProps) {
  const [profile, setProfile] = useState<StudentProfile>(getStudentProfile)
  const [groupData, setGroupData] = useState<GroupData>(() => getGroupData(profile.name))
  const [scores, setScores] = useState<ChallengeScore[]>(getChallengeScores)
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all')
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null)
  const [cloudUserEmail, setCloudUserEmail] = useState<string | null>(null)

  const reloadData = async () => {
    const p = getStudentProfile()
    setProfile(p)
    setGroupData(getGroupData(p.name))
    setScores(getChallengeScores())

    if (isSupabaseConfigured()) {
      const user = await getCurrentAuthUser()
      setCloudUserEmail(user?.email || null)
    }
  }

  const handleSyncCloud = async () => {
    if (!isSupabaseConfigured()) {
      setSyncStatusMsg('Database Supabase belum dikonfigurasi di environment.')
      setTimeout(() => setSyncStatusMsg(null), 4000)
      return
    }

    setIsSyncing(true)
    setSyncStatusMsg('Menyinkronkan data nilai dengan Supabase...')
    const result = await syncScoresWithCloud()
    setIsSyncing(false)

    if (result.cloudSynced) {
      setScores(result.scores)
      setSyncStatusMsg('Sinkronisasi cloud database berhasil!')
    } else {
      setSyncStatusMsg(result.error ? `Sinkronisasi gagal: ${result.error}` : 'Gagal terhubung ke database cloud.')
    }
    setTimeout(() => setSyncStatusMsg(null), 4000)
  }

  useEffect(() => {
    if (isOpen) {
      reloadData()
      // Automatically attempt background cloud sync when opened
      if (isSupabaseConfigured()) {
        syncScoresWithCloud().then((res) => {
          if (res.cloudSynced) {
            setScores(res.scores)
          }
        })
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleScoresUpdate = () => setScores(getChallengeScores())
    const handleProfileUpdate = () => {
      const p = getStudentProfile()
      setProfile(p)
      setGroupData(getGroupData(p.name))
    }
    window.addEventListener('sinaupy:scores_updated', handleScoresUpdate)
    window.addEventListener('sinaupy:profile_updated', handleProfileUpdate)
    window.addEventListener('sinaupy:group_updated', handleProfileUpdate)
    return () => {
      window.removeEventListener('sinaupy:scores_updated', handleScoresUpdate)
      window.removeEventListener('sinaupy:profile_updated', handleProfileUpdate)
      window.removeEventListener('sinaupy:group_updated', handleProfileUpdate)
    }
  }, [])

  if (!isOpen) return null

  const totalScore = calculateTotalScore(scores)
  const individuScores = scores.filter((s) => s.category === 'individu')
  const kelompokScores = scores.filter((s) => s.category === 'kelompok')
  const hotsScores = scores.filter((s) => s.category === 'hots')

  const displayedScores =
    activeFilter === 'all'
      ? scores
      : scores.filter((s) => s.category === activeFilter)

  const totalPossible = scores.reduce((sum, s) => sum + s.maxScore, 0)
  const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0
  let predikat = 'Perlu Peningkatan'
  if (percentage >= 85) predikat = 'Sangat Baik (A)'
  else if (percentage >= 75) predikat = 'Baik / Tuntas KKM (B)'
  else if (percentage >= 60) predikat = 'Cukup (C)'

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const studentName = profile.name && profile.name.trim() ? profile.name.trim() : 'Siswa'
  const studentClass = profile.className && profile.className.trim() ? profile.className.trim() : 'X'
  const groupName = groupData.groupName || profile.groupName || '-'
  const groupMembers = groupData.members && groupData.members.length > 0
    ? groupData.members.filter(Boolean).join(', ')
    : (profile.groupMembers || '-')

  // Generate and Download Microsoft Excel (.csv) with UTF-8 BOM
  const handleDownloadCSV = () => {
    if (scores.length === 0) {
      alert('Belum ada riwayat nilai yang tersimpan untuk diunduh.')
      return
    }

    const rows: string[] = []
    // Document Title & Student Identity Meta
    rows.push('"LAPORAN REKAPITULASI NILAI SINAUPY"')
    rows.push(`"Nama Siswa","${studentName.replace(/"/g, '""')}"`)
    rows.push(`"Kelas / Rombel","${studentClass.replace(/"/g, '""')}"`)
    rows.push(`"Nama Kelompok","${groupName.replace(/"/g, '""')}"`)
    rows.push(`"Anggota Kelompok","${groupMembers.replace(/"/g, '""')}"`)
    rows.push(`"Total Nilai","${totalScore} Poin"`)
    rows.push(`"Predikat Capaian","${predikat}"`)
    rows.push(`"Tanggal Unduh","${currentDate}"`)
    rows.push(`"Status Database","${cloudUserEmail ? `Cloud Supabase (${cloudUserEmail})` : 'Penyimpanan Lokal Peramban'}"`)
    rows.push('') // Empty row separator

    // Column Headers
    rows.push(
      [
        '"No"',
        '"Judul Misi / Aktivitas"',
        '"Jenis Aktivitas"',
        '"Level"',
        '"Skor"',
        '"Skor Maksimum"',
        '"Persentase"',
        '"Waktu Selesai"',
        '"Status"',
      ].join(',')
    )

    // Data Rows - ONLY for current student's scores
    scores.forEach((item, idx) => {
      const typeLabel =
        item.category === 'individu'
          ? 'Tantangan Berjenjang'
          : item.category === 'kelompok'
          ? 'Tantangan Kelompok'
          : 'Studi Kasus HOTS'
      const pct = item.maxScore > 0 ? `${Math.round((item.score / item.maxScore) * 100)}%` : '0%'

      rows.push(
        [
          `"${idx + 1}"`,
          `"${item.title.replace(/"/g, '""')}"`,
          `"${typeLabel}"`,
          `"Level ${item.level}"`,
          `"${item.score}"`,
          `"${item.maxScore}"`,
          `"${pct}"`,
          `"${item.completedAt}"`,
          `"Tuntas"`,
        ].join(',')
      )
    })

    // UTF-8 BOM (\uFEFF) ensures Excel correctly displays accents and symbols
    const csvContent = '\uFEFF' + rows.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const cleanName = studentName.replace(/\W+/g, '_')
    const cleanClass = studentClass.replace(/\W+/g, '_')
    const fileName = `Nilai_Saya_SinauPy_${cleanName}_${cleanClass}.csv`

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Generate and Download Microsoft Word (.doc) File
  const handleDownloadWord = () => {
    const rowsHtml = scores.map((item, idx) => `
      <tr>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">${idx + 1}</td>
        <td style="border: 1px solid #333; padding: 6px;"><strong>${item.title}</strong></td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">
          ${item.category === 'individu' ? 'Tantangan Berjenjang' : item.category === 'kelompok' ? 'Tantangan Kelompok' : 'Studi Kasus HOTS'}
        </td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">Level ${item.level}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px; font-weight: bold;">${item.score} / ${item.maxScore}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px;">${item.completedAt}</td>
        <td style="text-align: center; border: 1px solid #333; padding: 6px; color: #187447; font-weight: bold;">Tuntas</td>
      </tr>
    `).join('')

    const emptyRow = `
      <tr>
        <td colspan="7" style="text-align: center; border: 1px solid #333; padding: 14px; font-style: italic; color: #666;">
          Belum ada nilai tantangan yang tersimpan. Selesaikan misi koding di SinauPy untuk merekap nilai.
        </td>
      </tr>
    `

    const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Rekap Nilai - ${studentName}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 21.0cm 29.7cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-page-orientation: portrait;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000000;
    }
    .kop {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .kop-kicker {
      font-size: 10pt;
      letter-spacing: 1px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .kop-title {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 3px 0;
    }
    .kop-sub {
      font-size: 9.5pt;
      color: #333;
    }
    .doc-title {
      text-align: center;
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      margin: 14px 0 12px;
    }
    table.info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    table.info-table td {
      padding: 3px 6px;
      font-size: 10.5pt;
      vertical-align: top;
      border: none;
    }
    table.rekap-grid {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px;
    }
    table.rekap-grid td {
      border: 1px solid #333;
      padding: 8px 10px;
      text-align: center;
      background-color: #F8F9FA;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px;
    }
    table.data-table th {
      background-color: #EBF2FA;
      border: 1px solid #333;
      padding: 7px;
      font-size: 10pt;
      text-align: center;
      font-weight: bold;
    }
    table.sig-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 36px;
      border: none;
    }
    table.sig-table td {
      border: none;
      text-align: center;
      width: 50%;
      vertical-align: top;
      font-size: 10.5pt;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <div class="kop">
      <div class="kop-kicker">MEDIA PEMBELAJARAN INFORMATIKA SMA / SMK</div>
      <div class="kop-title">SINAUPY — PYTHON LEARNING ENVIRONMENT</div>
      <div class="kop-sub">Modul Praktik Terbimbing, Tantangan Berjenjang, dan Kolaborasi Kelompok</div>
    </div>

    <div class="doc-title">LEMBAR REKAPITULASI HASIL BELAJAR & NILAI TANTANGAN</div>

    <table class="info-table">
      <tr>
        <td style="width: 20%;"><strong>Nama Siswa</strong></td>
        <td style="width: 2%;">:</td>
        <td style="width: 42%; font-weight: bold;">${studentName}</td>
        <td style="width: 18%;"><strong>Tanggal Unduh</strong></td>
        <td style="width: 2%;">:</td>
        <td style="width: 16%;">${currentDate}</td>
      </tr>
      <tr>
        <td><strong>Kelas / Rombel</strong></td>
        <td>:</td>
        <td>${studentClass}</td>
        <td><strong>Total Skor</strong></td>
        <td>:</td>
        <td><strong>${totalScore} Poin</strong></td>
      </tr>
      <tr>
        <td><strong>Nama Kelompok</strong></td>
        <td>:</td>
        <td>${groupName}</td>
        <td><strong>Predikat Capaian</strong></td>
        <td>:</td>
        <td><strong>${predikat}</strong></td>
      </tr>
      <tr>
        <td><strong>Anggota Kelompok</strong></td>
        <td>:</td>
        <td colspan="4">${groupMembers}</td>
      </tr>
    </table>

    <table class="rekap-grid">
      <tr>
        <td style="width: 25%;">
          <div style="font-size: 8.5pt; color: #555;">TOTAL TUGAS SELESAI</div>
          <div style="font-size: 14pt; font-weight: bold; margin: 3px 0;">${scores.length} Tugas</div>
          <div style="font-size: 8pt; color: #666;">Terkumpul</div>
        </td>
        <td style="width: 25%;">
          <div style="font-size: 8.5pt; color: #555;">TANTANGAN BERJENJANG</div>
          <div style="font-size: 14pt; font-weight: bold; margin: 3px 0;">${individuScores.length} Misi</div>
          <div style="font-size: 8pt; color: #666;">Level 1 - 4 Mandiri</div>
        </td>
        <td style="width: 25%;">
          <div style="font-size: 8.5pt; color: #555;">TANTANGAN KELOMPOK</div>
          <div style="font-size: 14pt; font-weight: bold; margin: 3px 0;">${kelompokScores.length} Proyek</div>
          <div style="font-size: 8pt; color: #666;">Kolaboratif Tim</div>
        </td>
        <td style="width: 25%;">
          <div style="font-size: 8.5pt; color: #555;">STUDI KASUS HOTS</div>
          <div style="font-size: 14pt; font-weight: bold; margin: 3px 0;">${hotsScores.length} Kasus</div>
          <div style="font-size: 8pt; color: #666;">Analisis C4 - C6</div>
        </td>
      </tr>
    </table>

    <div style="font-weight: bold; margin-top: 12px; margin-bottom: 6px; font-size: 10.5pt;">
      I. RINCIAN PEROLEHAN NILAI TUGAS & TANTANGAN KODING
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 5%;">No</th>
          <th style="width: 33%;">Judul Misi / Tantangan</th>
          <th style="width: 20%;">Kategori</th>
          <th style="width: 10%;">Level</th>
          <th style="width: 12%;">Nilai</th>
          <th style="width: 12%;">Waktu</th>
          <th style="width: 8%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${scores.length > 0 ? rowsHtml : emptyRow}
      </tbody>
    </table>

    <div style="font-size: 9pt; color: #555; margin-top: 8px;">
      * Catatan: Data nilai terintegrasi otomatis dari hasil pengujian eksekusi kode Python WebAssembly SinauPy.
    </div>

    <table class="sig-table">
      <tr>
        <td>
          <div>Mengetahui,</div>
          <div>Guru Pengampu Mata Pelajaran Informatika</div>
          <div style="height: 60px;"></div>
          <div>( .................................................... )</div>
          <div style="font-size: 9pt; color: #555;">NIP. ............................................</div>
        </td>
        <td>
          <div>Diverifikasi pada: ${currentDate}</div>
          <div>Siswa / Ketua Kelompok</div>
          <div style="height: 60px;"></div>
          <div><strong>( ${studentName} )</strong></div>
          <div style="font-size: 9pt; color: #555;">Kelas: ${studentClass}</div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`
    const blob = new Blob(['\ufeff', wordHtml], {
      type: 'application/msword;charset=utf-8',
    })
    const cleanName = studentName.replace(/\W+/g, '_')
    const cleanClass = studentClass.replace(/\W+/g, '_')
    const fileName = `Rekap_Nilai_SinauPy_${cleanName}_${cleanClass}.doc`

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Trigger Native Print / Save as PDF
  const handleDownloadPDF = () => {
    window.print()
  }

  const handleReset = () => {
    if (confirm('Apakah kamu yakin ingin mengosongkan semua riwayat nilai tantangan di peramban ini?')) {
      resetAllScores()
      reloadData()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog score-report-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="score-modal-title"
      >
        <div className="modal-header no-print">
          <div>
            <span className="modal-badge">PORTAL NILAI SAYA</span>
            <h3 id="score-modal-title">Rekap Nilai & Capaian Belajar</h3>
          </div>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Tutup">
            <IconClose />
          </button>
        </div>

        {/* Printable & Document Styled Paper Sheet */}
        <div className="score-report-content" id="printable-score-area">
          {/* Cloud Database Connection Status Banner (no-print) */}
          <div className="cloud-sync-status-bar no-print">
            <div className="cloud-status-left">
              <span className={`cloud-dot ${cloudUserEmail ? 'online' : 'local'}`} />
              <div className="cloud-status-text">
                <strong>Status Database: </strong>
                {cloudUserEmail ? (
                  <span>
                    Terhubung Cloud Supabase ({cloudUserEmail})
                  </span>
                ) : isSupabaseConfigured() ? (
                  <span>Mode Tamu / Lokal (Masuk dengan akun untuk mengaktifkan sinkronisasi cloud)</span>
                ) : (
                  <span>Penyimpanan Lokal Aktif (Supabase belum diisi di environment)</span>
                )}
              </div>
            </div>

            {isSupabaseConfigured() && (
              <button
                type="button"
                className="btn-sync-cloud"
                onClick={handleSyncCloud}
                disabled={isSyncing}
                title="Sinkronkan nilai lokal dengan database cloud Supabase"
              >
                {isSyncing ? 'Menyinkronkan...' : '🔄 Sinkronkan Nilai'}
              </button>
            )}
          </div>

          {syncStatusMsg && (
            <div className="sync-toast-alert no-print" role="status">
              <IconCheck />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {/* Formal Academic KOP Header */}
          <div className="academic-doc-header">
            <div className="doc-kop-kicker">MEDIA PEMBELAJARAN INFORMATIKA SMA / SMK</div>
            <div className="doc-kop-title">SINAUPY PYTHON LEARNING ENVIRONMENT</div>
            <div className="doc-kop-sub">Modul Praktik Terbimbing, Tantangan Berjenjang, dan Kolaborasi Kelompok</div>
            <div className="doc-header-divider" />
            <h2 className="doc-main-heading">LEMBAR REKAPITULASI HASIL BELAJAR & NILAI TANTANGAN</h2>
          </div>

          {/* Student & Group Identity Block */}
          <div className="doc-identity-box">
            <div className="identity-grid-col">
              <div className="id-row">
                <span className="id-label">Nama Siswa:</span>
                <span className="id-value strong-navy">{studentName}</span>
              </div>
              <div className="id-row">
                <span className="id-label">Kelas / Rombel:</span>
                <span className="id-value">{studentClass}</span>
              </div>
              <div className="id-row">
                <span className="id-label">Nama Kelompok:</span>
                <span className="id-value">{groupName}</span>
              </div>
              <div className="id-row">
                <span className="id-label">Anggota Tim:</span>
                <span className="id-value id-members">{groupMembers}</span>
              </div>
            </div>

            <div className="identity-grid-col col-right">
              <div className="id-row">
                <span className="id-label">Tanggal Rekap:</span>
                <span className="id-value">{currentDate}</span>
              </div>
              <div className="id-row">
                <span className="id-label">Total Skor:</span>
                <span className="id-value score-highlight">{totalScore} Poin</span>
              </div>
              <div className="id-row">
                <span className="id-label">Predikat Capaian:</span>
                <span className="id-value predicate-badge">{predikat}</span>
              </div>
              <button
                type="button"
                className="btn-edit-inline no-print"
                onClick={() => {
                  onClose()
                  onOpenProfile()
                }}
              >
                <IconEdit /> Ubah Identitas Siswa
              </button>
            </div>
          </div>

          {/* Stat Summary Cards */}
          <div className="score-summary-grid">
            <div className="summary-card total">
              <span className="summary-label">TOTAL AKUMULASI</span>
              <div className="summary-value">{totalScore}</div>
              <span className="summary-sub">Poin Terkumpul</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">TANTANGAN BERJENJANG</span>
              <div className="summary-value">{individuScores.length}</div>
              <span className="summary-sub">Misi Mandiri</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">TANTANGAN KELOMPOK</span>
              <div className="summary-value">{kelompokScores.length}</div>
              <span className="summary-sub">Proyek Kolaborasi</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">STUDI KASUS HOTS</span>
              <div className="summary-value">{hotsScores.length}</div>
              <span className="summary-sub">Analisis C4 - C6</span>
            </div>
          </div>

          {/* Activity Filter Strip (no-print) */}
          <div className="score-filter-bar no-print">
            <span className="filter-label">Filter Aktivitas:</span>
            <div className="filter-pills-group">
              <button
                type="button"
                className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Semua Aktivitas ({scores.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${activeFilter === 'individu' ? 'active' : ''}`}
                onClick={() => setActiveFilter('individu')}
              >
                Tantangan Berjenjang ({individuScores.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${activeFilter === 'kelompok' ? 'active' : ''}`}
                onClick={() => setActiveFilter('kelompok')}
              >
                Tantangan Kelompok ({kelompokScores.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${activeFilter === 'hots' ? 'active' : ''}`}
                onClick={() => setActiveFilter('hots')}
              >
                Studi Kasus HOTS ({hotsScores.length})
              </button>
            </div>
          </div>

          {/* Table of Tasks & Scores */}
          <div className="score-table-wrap">
            <div className="score-table-header no-print">
              <h4>Daftar Misi Koding yang Diselesaikan</h4>
              <span className="score-count-badge">{displayedScores.length} Tugas Ditampilkan</span>
            </div>

            {displayedScores.length === 0 ? (
              <div className="empty-scores">
                <IconTrophy className="empty-scores-icon" />
                <p>
                  {scores.length === 0
                    ? 'Belum ada nilai tantangan yang tersimpan.'
                    : 'Tidak ada tugas yang cocok dengan filter yang dipilih.'}
                </p>
                <small>
                  Pilih misi koding di halaman Tantangan Berjenjang atau Tantangan Kelompok, selesaikan hingga lolos kasus uji, lalu klik tombol
                  "Simpan Nilai" untuk mencatat capaian belajarmu di dokumen ini.
                </small>
              </div>
            ) : (
              <table className="score-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }} className="col-center">No</th>
                    <th>Judul Misi / Tantangan Koding</th>
                    <th style={{ width: '150px' }}>Kategori Tugas</th>
                    <th style={{ width: '80px' }} className="col-center">Level</th>
                    <th style={{ width: '100px' }} className="col-center">Nilai</th>
                    <th style={{ width: '130px' }} className="col-center">Waktu Selesai</th>
                    <th style={{ width: '85px' }} className="col-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedScores.map((item, idx) => (
                    <tr key={item.challengeId}>
                      <td className="col-center">{idx + 1}</td>
                      <td>
                        <strong>{item.title}</strong>
                      </td>
                      <td>
                        <span className={`cat-pill cat-${item.category}`}>
                          {item.category === 'individu'
                            ? 'Tantangan Berjenjang'
                            : item.category === 'kelompok'
                            ? 'Tantangan Kelompok'
                            : 'Studi Kasus HOTS'}
                        </span>
                      </td>
                      <td className="col-center">Level {item.level}</td>
                      <td className="col-center">
                        <span className="score-pill">
                          {item.score}/{item.maxScore}
                        </span>
                      </td>
                      <td className="col-center col-date">{item.completedAt}</td>
                      <td className="col-center">
                        {item.cloudSyncStatus === 'synced' ? (
                          <span className="status-pill-done" title="Tersinkronisasi aman di Supabase">
                            <IconCheck /> Cloud
                          </span>
                        ) : item.cloudSyncStatus === 'error' ? (
                          <span className="status-pill-error" title={item.cloudErrorMsg || 'Sinkronisasi gagal'}>
                            <IconAlert /> Lokal
                          </span>
                        ) : (
                          <span className="status-pill-done" title="Tersimpan di perangkat lokal">
                            <IconCheck /> Tuntas
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Academic Signature Column (Visible in Print & Preview) */}
          <div className="academic-signatures-grid">
            <div className="sig-col">
              <div className="sig-title">Mengetahui,</div>
              <div className="sig-role">Guru Pengampu Mata Pelajaran Informatika</div>
              <div className="sig-spacer" />
              <div className="sig-line">( ................................................................ )</div>
              <div className="sig-nip">NIP. ........................................................</div>
            </div>

            <div className="sig-col">
              <div className="sig-title">Diverifikasi pada: {currentDate}</div>
              <div className="sig-role">Siswa / Ketua Kelompok</div>
              <div className="sig-spacer" />
              <div className="sig-line"><strong>( {studentName} )</strong></div>
              <div className="sig-nip">Kelas: {studentClass}</div>
            </div>
          </div>

          <div className="score-report-footer no-print">
            <p>
              💡 Dokumen ini mencatat seluruh nilai asesmen formatif koding secara transparan. Nilai dapat diekspor ke <strong>Excel (.csv)</strong>, diunduh dalam format <strong>Word (.doc)</strong>, atau dicetak ke <strong>PDF</strong> untuk diserahkan kepada guru.
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="modal-actions no-print">
          <button type="button" className="btn-reset" onClick={handleReset} title="Hapus riwayat nilai lokal">
            <IconTrash /> Reset Nilai
          </button>

          <div className="modal-actions-right">
            <button
              type="button"
              className="btn-download-csv"
              onClick={handleDownloadCSV}
              title="Ekspor laporan nilai siswa ke format Microsoft Excel (.csv)"
            >
              <IconDownload /> Unduh Nilai Saya (CSV)
            </button>
            <button
              type="button"
              className="btn-download-word"
              onClick={handleDownloadWord}
              title="Unduh dokumen Word (.doc)"
            >
              <IconDownload /> Unduh Word (.doc)
            </button>
            <button
              type="button"
              className="btn-download-pdf"
              onClick={handleDownloadPDF}
              title="Unduh dokumen PDF atau cetak"
            >
              <IconPrinter /> Unduh PDF / Cetak
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
