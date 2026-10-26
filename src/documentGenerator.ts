import type { ChallengeItem } from './challengesData'

export interface TaskDocumentData {
  subject: string // "Informatika"
  topic: string
  taskType: 'mandiri' | 'kelompok' | 'proyek'
  title: string
  level?: number
  studentName?: string
  studentClass?: string
  groupName?: string
  groupMembers?: string[]
  learningObjectives: string[]
  description: string
  guidelines: string[]
  instructions: string
  codeSnippet?: string
  testCases?: Array<{ input: string; expected: string }>
  rubric?: Array<{ criteria: string; weight: string; description: string }>
  selectedTheme?: string
  themeOptions?: Array<{ name: string; desc: string; sample: string }>
  userCode?: string
  userOutput?: string
  filenameBase?: string
}

// Format clean file names
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[-\s]+/g, '_')
}

// Build Task Document Data from any ChallengeItem
export function buildTaskDocFromChallenge(
  challenge: ChallengeItem,
  studentName = 'Siswa',
  studentClass = 'X',
  groupName = '',
  groupMembers: string[] = []
): TaskDocumentData {
  const isGroup = challenge.category === 'kelompok'
  const isHots = challenge.category === 'hots'
  const taskType = isGroup ? 'kelompok' : 'mandiri'

  const levelObjectives: Record<number, string[]> = {
    1: [
      'Memahami konsep dasar variabel, tipe data numerik/teks, dan fungsi input() dinamis.',
      'Mengimplementasikan percabangan kondisi sederhana (if-elif-else) dalam memecahkan masalah kontekstual.',
      'Memverifikasi kebenaran logika program menggunakan tabel kasus uji (test cases).',
    ],
    2: [
      'Menerapkan operasi aritmetika dan operator perbandingan logika pada studi kasus transaksi.',
      'Mengembangkan logika percabangan majemuk bertingkat untuk menghitung upah, bonus, atau diskon bersyarat.',
      'Mengidentifikasi dan menguji kondisi batas (boundary/edge conditions) pada program.',
    ],
    3: [
      'Mengelola struktur data list untuk menyimpan dan mengolah data multielemen secara dinamis.',
      'Menerapkan struktur perulangan (for / while) dalam melakukan iterasi dan akumulasi data.',
      'Menghasilkan kalkulasi statistik dasar (total, rata-rata, nilai tertinggi/terendah) secara mandiri.',
    ],
    4: [
      'Merancang arsitektur program modular dan fungsi untuk pemecahan masalah skala menengah.',
      'Mengintegrasikan input interaktif, validasi data, dan percabangan dalam alur yang efisien.',
      'Mendokumentasikan logika komputasional dan melakukan refleksi perancangan program.',
    ],
  }

  const defaultObjectives = levelObjectives[challenge.level] || [
    'Menerapkan konsep computational thinking dalam menyusun algoritma terstruktur.',
    'Mengetik dan menguji sintaks bahasa Python secara mandiri di WebAssembly interpreter.',
    'Menganalisis hasil keluaran terminal dan merefleksikan solusi permasalahan.',
  ]

  const filenamePrefix = isGroup
    ? `Informatika_Tantangan_Kelompok_Level_${challenge.level}`
    : isHots
    ? `Informatika_Studi_Kasus_HOTS_${challenge.level}`
    : `Informatika_Tantangan_Level_${challenge.level}`

  const filenameBase = `${filenamePrefix}_${sanitizeFilename(challenge.title)}`

  return {
    subject: 'Informatika',
    topic: challenge.subtitle || 'Algoritma & Pemrograman Python',
    taskType,
    title: challenge.title,
    level: challenge.level,
    studentName,
    studentClass,
    groupName: isGroup ? groupName || 'Kelompok Informatika' : undefined,
    groupMembers: isGroup && groupMembers.length > 0 ? groupMembers : undefined,
    learningObjectives: defaultObjectives,
    description: challenge.story,
    guidelines: [
      'Baca dan pahami deskripsi masalah serta target kompetensi yang harus dicapai.',
      'Identifikasi variabel masukan (input), proses logika perhitungan/percabangan, dan format keluaran (output).',
      'Ketik sintaks kode program secara mandiri di editor Python SinauPy (tanpa fitur salin-tempel).',
      'Jalankan program dan masukkan nilai uji sesuai tabel kasus uji (test cases) yang disediakan.',
      'Pastikan seluruh keluaran program presisi dan bebas dari galat sintaks maupun logika.',
      isGroup
        ? 'Bagi peran secara kolaboratif (Analis Masalah, Programmer Algoritma, dan Penguji Kasus Uji).'
        : 'Lakukan verifikasi mandiri sebelum menyimpan hasil dan mengunduh berkas laporan.',
    ],
    instructions: challenge.task,
    codeSnippet: challenge.initialCode,
    testCases: challenge.testCases,
    rubric: [
      {
        criteria: 'Logika Algoritma & Struktur Kode',
        weight: '35%',
        description: 'Ketepatan sintaks, struktur percabangan/perulangan, penamaan variabel rapi dan efisien.',
      },
      {
        criteria: 'Kesesuaian Format Output & Kasus Uji',
        weight: '35%',
        description: 'Hasil eksekusi program memenuhi seluruh kriteria dan persis sesuai contoh kasus uji.',
      },
      {
        criteria: 'Interaktivitas & Penanganan Input',
        weight: '15%',
        description: 'Fungsi input() berjalan interaktif di terminal dengan petunjuk prompt yang informatif.',
      },
      {
        criteria: isGroup ? 'Kolaborasi & Pembagian Peran' : 'Kemandirian & Refleksi Belajar',
        weight: '15%',
        description: isGroup
          ? 'Keterlibatan aktif setiap anggota kelompok sesuai rubrik peran dan komunikasi efektif.'
          : 'Pengerjaan mandiri tanpa salin-tempel dan kemampuan mendokumentasikan proses penyelesaian.',
      },
    ],
    filenameBase,
  }
}

// Build Task Document Data for Proyek Kelompok — Program Struk Pembelian
export function buildTaskDocForReceiptProject(
  selectedThemeName = 'Struk Toko (Minimarket / Koperasi)',
  studentName = 'Siswa',
  studentClass = 'X',
  groupName = '',
  groupMembers: string[] = [],
  userCode?: string,
  userOutput?: string
): TaskDocumentData {
  return {
    subject: 'Informatika',
    topic: 'Proyek Kolaboratif Pemrograman — Desain Kasir & Format Struk Pembelian',
    taskType: 'proyek',
    title: 'Proyek Kelompok: Program Kasir & Struk Pembelian',
    studentName,
    studentClass,
    groupName: groupName || 'Tim Proyek Kasir',
    groupMembers: groupMembers.length > 0 ? groupMembers : ['Anggota 1', 'Anggota 2'],
    learningObjectives: [
      'Menerapkan konsep variabel, tipe data dinamis, dan kalkulasi aritmetika dalam simulasi kasir komersial.',
      'Mengimplementasikan percabangan logika (if-elif-else) untuk perhitungan diskon bertingkat / keanggotaan.',
      'Menguasai teknik pemformatan teks f-string (alignment rata kiri-kanan, padding spasi, dan pemisah ribuan) agar struk rapi.',
      'Membangun budaya kolaborasi tim berpasangan dalam mendesain, mengoding, dan menguji aplikasi nyata.',
    ],
    description:
      'Dalam kehidupan sehari-hari, sistem Point of Sale (POS) dan kasir mencetak struk transaksi sebagai bukti pembayaran yang sah. Pada proyek ini, kelompokmu bertugas merancang program kasir interaktif yang menerima data pembelian, menghitung subtotal, diskon, dan kembalian, serta mencetak struk belanja dengan tata letak rapi, sejajar, dan profesional.',
    guidelines: [
      'Proyek dikerjakan secara berkelompok (disarankan berpasangan 2 siswa per tim atau sesuai anggota kelompokmu).',
      'Pilih salah satu dari 3 tema struk yang tersedia: (1) Struk Toko / Minimarket, (2) Struk Jasa / Laundry / Servis, atau (3) Struk Tiket / Bioskop / Konser.',
      'Program wajib meminta masukan pengguna secara interaktif melalui fungsi input().',
      'Struk yang dicetak wajib memiliki struktur: Identitas Toko/Jasa (Kop), Tanggal & Kasir, Nama Pelanggan, Rincian Barang/Layanan, Subtotal, Diskon, Total Bayar, Uang Bayar, Kembalian, dan Ucapan Terima Kasih.',
      'Gunakan teknik f-string dengan penentu lebar karakter (contoh: f"{nama:<15} {qty:>2}x Rp{harga:>7,}") agar kolom rata rapi.',
      'Uji program dengan berbagai skenario transaksi (dengan diskon dan tanpa diskon, uang pas dan uang lebih).',
    ],
    instructions:
      'Susun kode program Python lengkap yang meminta nama pelanggan, tanggal transaksi, minimal 2-3 barang/layanan belanjaan, menghitung diskon jika total belanja mencapai batas tertentu (misal diskon 10% jika belanja >= Rp50.000), meminta nominal uang bayar, lalu mencetak struk kasir berbingkai rapi.',
    selectedTheme: selectedThemeName,
    themeOptions: [
      {
        name: 'Tema 1: Struk Toko (Minimarket / Koperasi Sekolah / Toko Buku)',
        desc: 'Menjual barang fisik seperti buku tulis, bolpoin, snack, atau minuman. Diskon diberikan jika total belanja memenuhi syarat tertentu.',
        sample: 'KOPERASI SISWA SINAUPY | Buku Tulis 3x Rp4.000 | Diskon Rp2.000 | Total Rp10.000',
      },
      {
        name: 'Tema 2: Struk Jasa (Laundry Kiloan / Servis Komputer / Fotokopi)',
        desc: 'Menghitung biaya jasa berdasarkan satuan kilogram, lembar fotokopi, atau tarif perbaikan perangkat.',
        sample: 'KILAT LAUNDRY EXPRESS | Cuci Komplit 4 Kg x Rp7.000 | Diskon Member Rp2.800 | Total Rp25.200',
      },
      {
        name: 'Tema 3: Struk Tiket (Tiket Bioskop / Konser Musik / Tiket Wahana)',
        desc: 'Menghitung tiket masuk berdasarkan jumlah orang, kategori kursi (Reguler/VIP), dan fasilitas tambahan.',
        sample: 'SINAUPY CINEMA XXI | Tiket Reguler 2x Rp35.000 | Biaya Admin Rp2.000 | Total Rp72.000',
      },
    ],
    codeSnippet: `# =====================================================================
# PROYEK KELOMPOK: PROGRAM STRUK PEMBELIAN
# Tema Pilihan: ${selectedThemeName}
# Kelompok: ${groupName || 'Tim Proyek'}
# =====================================================================

print("=" * 40)
print(f"{'SINAUPY MART & KASIR':^40}")
print(f"{'Jl. Pendidikan No. 1, Kota Sinau':^40}")
print("=" * 40)

# Input data transaksi
kasir = input("Nama Kasir: ")
pelanggan = input("Nama Pelanggan: ")
tanggal = input("Tanggal Transaksi: ")

# Input barang belanjaan
print("\\n--- Masukkan Rincian Barang ---")
nama1 = input("Nama Barang 1: ")
harga1 = int(input("Harga Satuan 1: Rp"))
qty1 = int(input("Jumlah Beli 1: "))
sub1 = harga1 * qty1

nama2 = input("Nama Barang 2: ")
harga2 = int(input("Harga Satuan 2: Rp"))
qty2 = int(input("Jumlah Beli 2: "))
sub2 = harga2 * qty2

total_kotor = sub1 + sub2

# Perhitungan Diskon
if total_kotor >= 50000:
    diskon = int(total_kotor * 0.10)
    ket_diskon = "Diskon 10%"
else:
    diskon = 0
    ket_diskon = "Diskon 0%"

total_bayar = total_kotor - diskon

print(f"\\nTotal Tagihan: Rp{total_bayar:,}")
bayar = int(input("Nominal Uang Bayar: Rp"))
kembalian = bayar - total_bayar

# Cetak Struk Hasil Pembelian
print("\\n" + "=" * 40)
print(f"{'STRUK BUKTI PEMBAYARAN':^40}")
print("=" * 40)
print(f"Tanggal : {tanggal:<15} Kasir: {kasir}")
print(f"Pelanggan: {pelanggan}")
print("-" * 40)
print(f"{nama1:<18} {qty1:>2}x Rp{harga1:>6,} = Rp{sub1:>7,}")
print(f"{nama2:<18} {qty2:>2}x Rp{harga2:>6,} = Rp{sub2:>7,}")
print("-" * 40)
print(f"{'Subtotal':<26}: Rp{total_kotor:>9,}")
print(f"{ket_diskon:<26}: Rp{diskon:>9,}")
print(f"{'TOTAL PEMBAYARAN':<26}: Rp{total_bayar:>9,}")
print(f"{'TUNAI':<26}: Rp{bayar:>9,}")
print(f"{'KEMBALIAN':<26}: Rp{kembalian:>9,}")
print("=" * 40)
print(f"{'TERIMA KASIH ATAS KUNJUNGAN ANDA':^40}")
print(f"{'Barang yang sudah dibeli tidak dapat ditukar':^40}")
print("=" * 40)
`,
    rubric: [
      {
        criteria: 'Kelengkapan Identitas & Struktur Struk',
        weight: '20%',
        description: 'Memuat kop penyedia jasa/toko, tanggal, kasir, pelanggan, footer struk, dan ucapan terima kasih.',
      },
      {
        criteria: 'Akurasi Perhitungan Matematika & Diskon',
        weight: '30%',
        description: 'Perhitungan kuantitas, subtotal, percabangan diskon bersyarat, dan kembalian 100% presisi.',
      },
      {
        criteria: 'Kerapian Format Struk Rata Kiri-Kanan',
        weight: '30%',
        description: 'Memanfaatkan f-string formatting dengan rapi sehingga kolom teks, angka, dan border sejajar.',
      },
      {
        criteria: 'Kerja Sama Tim & Refleksi Proyek',
        weight: '20%',
        description: 'Pembagian peran seimbang, kode terdokumentasi dengan baik, dan refleksi pengerjaan lengkap.',
      },
    ],
    userCode,
    userOutput,
    filenameBase: 'Informatika_Proyek_Kelompok_Struk_Pembelian',
  }
}

// ==========================================================================
// 1. GENERATE WORD (.doc / .docx compatible)
// ==========================================================================
export function downloadTaskWord(taskDoc: TaskDocumentData): void {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const studentName = taskDoc.studentName || 'Siswa'
  const studentClass = taskDoc.studentClass || 'X'
  const isGroup = taskDoc.taskType === 'kelompok' || taskDoc.taskType === 'proyek'
  const groupName = taskDoc.groupName || '-'
  const groupMembers =
    taskDoc.groupMembers && taskDoc.groupMembers.length > 0
      ? taskDoc.groupMembers.filter(Boolean).join(', ')
      : '-'

  const objectivesHtml = taskDoc.learningObjectives
    .map((obj) => `<li>${obj}</li>`)
    .join('')

  const guidelinesHtml = taskDoc.guidelines
    .map((g) => `<li>${g}</li>`)
    .join('')

  const testCasesHtml =
    taskDoc.testCases && taskDoc.testCases.length > 0
      ? `
      <div style="font-weight: bold; margin-top: 14px; margin-bottom: 6px; font-size: 10.5pt; color: #17365D;">
        Tabel Contoh Kasus Uji (Test Cases):
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
        <thead>
          <tr style="background-color: #EBF2FA;">
            <th style="border: 1px solid #17365D; padding: 6px; font-size: 9.5pt; width: 12%; text-align: center;">Kasus</th>
            <th style="border: 1px solid #17365D; padding: 6px; font-size: 9.5pt; width: 44%;">Masukan Program (Input)</th>
            <th style="border: 1px solid #17365D; padding: 6px; font-size: 9.5pt; width: 44%;">Target Keluaran yang Diharapkan</th>
          </tr>
        </thead>
        <tbody>
          ${taskDoc.testCases
            .map(
              (tc, idx) => `
            <tr>
              <td style="border: 1px solid #333; padding: 6px; font-size: 9.5pt; text-align: center; font-weight: bold;">Kasus #${idx + 1}</td>
              <td style="border: 1px solid #333; padding: 6px; font-size: 9pt; font-family: 'Courier New', monospace; background: #f8fafc;">
                ${tc.input.replace(/\n/g, '<br/>')}
              </td>
              <td style="border: 1px solid #333; padding: 6px; font-size: 9.5pt;">${tc.expected}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `
      : ''

  const rubricHtml =
    taskDoc.rubric && taskDoc.rubric.length > 0
      ? `
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0 16px;">
        <thead>
          <tr style="background-color: #EBF2FA;">
            <th style="border: 1px solid #17365D; padding: 6px; font-size: 9.5pt; width: 32%;">Kriteria Penilaian</th>
            <th style="border: 1px solid #17365D; padding: 6px; font-size: 9.5pt; width: 12%; text-align: center;">Bobot</th>
            <th style="border: 1px solid #17365D; padding: 6px; font-size: 9.5pt; width: 44%;">Deskripsi Capaian Kompetensi</th>
            <th style="border: 1px solid #17365D; padding: 6px; font-size: 9.5pt; width: 12%; text-align: center;">Skor (0-100)</th>
          </tr>
        </thead>
        <tbody>
          ${taskDoc.rubric
            .map(
              (r) => `
            <tr>
              <td style="border: 1px solid #333; padding: 6px; font-size: 9.5pt; font-weight: bold;">${r.criteria}</td>
              <td style="border: 1px solid #333; padding: 6px; font-size: 9.5pt; text-align: center; font-weight: bold; color: #315D9B;">${r.weight}</td>
              <td style="border: 1px solid #333; padding: 6px; font-size: 9pt; color: #333;">${r.description}</td>
              <td style="border: 1px solid #333; padding: 6px; font-size: 9.5pt; text-align: center;"></td>
            </tr>
          `
            )
            .join('')}
          <tr style="background-color: #f8fafc; font-weight: bold;">
            <td colspan="3" style="border: 1px solid #333; padding: 6px; text-align: right; font-size: 9.5pt;">TOTAL NILAI AKHIR:</td>
            <td style="border: 1px solid #333; padding: 6px; text-align: center; font-size: 11pt; color: #17365D;">/ 100</td>
          </tr>
        </tbody>
      </table>
    `
      : ''

  const themeSectionHtml = taskDoc.selectedTheme
    ? `
    <div style="background-color: #f0f7ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #2563eb; padding: 10px 14px; margin: 12px 0; border-radius: 4px;">
      <div style="font-size: 9pt; font-weight: bold; color: #1d4ed8; text-transform: uppercase;">Tema Pilihan Proyek:</div>
      <div style="font-size: 11pt; font-weight: bold; color: #17365D; margin-top: 2px;">${taskDoc.selectedTheme}</div>
    </div>
  `
    : ''

  const codeSnippetHtml = taskDoc.codeSnippet
    ? `
    <div style="font-weight: bold; margin-top: 14px; margin-bottom: 6px; font-size: 10.5pt; color: #17365D;">
      Kode Awal / Referensi Solusi Python:
    </div>
    <div style="background-color: #0b1526; color: #7dd3fc; border: 1.5px solid #1e2f4a; padding: 12px; font-family: 'Courier New', monospace; font-size: 9pt; line-height: 1.45; white-space: pre-wrap; border-radius: 4px; margin-bottom: 14px;">
${taskDoc.codeSnippet}
    </div>
  `
    : ''

  const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${taskDoc.title}</title>
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
      margin: 2.2cm 2.0cm 2.2cm 2.0cm;
      mso-page-orientation: portrait;
      mso-header-margin: 1.2cm;
      mso-footer-margin: 1.2cm;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: Arial, Aptos, 'Segoe UI', sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #17365D;
    }
    .kop {
      text-align: center;
      border-bottom: 3px double #17365D;
      padding-bottom: 6px;
      margin-bottom: 14px;
    }
    .kop-kicker {
      font-size: 9pt;
      letter-spacing: 1.2px;
      font-weight: bold;
      color: #315D9B;
      text-transform: uppercase;
    }
    .kop-title {
      font-size: 13pt;
      font-weight: bold;
      color: #17365D;
      text-transform: uppercase;
      margin: 2px 0;
    }
    .kop-sub {
      font-size: 8.5pt;
      color: #60758F;
    }
    .doc-main-title {
      text-align: center;
      font-size: 12pt;
      font-weight: bold;
      color: #17365D;
      text-transform: uppercase;
      margin: 10px 0 14px;
      border-bottom: 1.5px solid #17365D;
      padding-bottom: 4px;
    }
    table.info-box {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      background-color: #F8FAFD;
      border: 1px solid #DCE6F2;
    }
    table.info-box td {
      padding: 5px 8px;
      font-size: 9.5pt;
      vertical-align: top;
      border: 0.5px solid #DCE6F2;
    }
    .sec-heading {
      font-size: 10.5pt;
      font-weight: bold;
      color: #17365D;
      background-color: #EBF2FA;
      padding: 4px 8px;
      margin: 14px 0 8px;
      border-left: 4px solid #315D9B;
      text-transform: uppercase;
    }
    ol, ul {
      margin: 6px 0 10px;
      padding-left: 22px;
    }
    li {
      margin-bottom: 4px;
      font-size: 9.5pt;
      color: #243852;
    }
    .answer-box {
      border: 1px dashed #708aa8;
      background: #fafcff;
      min-height: 90px;
      padding: 10px;
      margin: 8px 0 14px;
      font-size: 9pt;
      color: #64748b;
    }
    table.sig-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      border: none;
    }
    table.sig-table td {
      border: none;
      text-align: center;
      width: 50%;
      vertical-align: top;
      font-size: 9.5pt;
    }
  </style>
</head>
<body>
  <div class="Section1">
    {/* Kop Header */}
    <div class="kop">
      <div class="kop-kicker">MEDIA PEMBELAJARAN INFORMATIKA SMA / SMK</div>
      <div class="kop-title">SINAUPY — PYTHON LEARNING ENVIRONMENT</div>
      <div class="kop-sub">Modul Praktik Terbimbing, Tantangan Berjenjang, dan Kolaborasi Kelompok</div>
    </div>

    <div class="doc-main-title">
      LEMBAR KERJA TUGAS & ASESMEN PEMROGRAMAN PYTHON
    </div>

    {/* Identity Table */}
    <table class="info-box">
      <tr>
        <td style="width: 22%; font-weight: bold;">Mata Pelajaran</td>
        <td style="width: 2%;">:</td>
        <td style="width: 40%; font-weight: bold; color: #17365D;">Informatika (Fase E / Kelas X)</td>
        <td style="width: 16%; font-weight: bold;">Tanggal Unduh</td>
        <td style="width: 2%;">:</td>
        <td style="width: 18%;">${currentDate}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Materi / Topik</td>
        <td>:</td>
        <td>${taskDoc.topic}</td>
        <td style="font-weight: bold;">Jenis Tugas</td>
        <td>:</td>
        <td><strong style="text-transform: capitalize;">${taskDoc.taskType}</strong></td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Nama Tugas / Proyek</td>
        <td>:</td>
        <td colspan="4"><strong style="color: #315D9B;">${taskDoc.title}</strong></td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Nama Siswa / Ketua</td>
        <td>:</td>
        <td><strong>${studentName}</strong></td>
        <td style="font-weight: bold;">Kelas / Rombel</td>
        <td>:</td>
        <td><strong>${studentClass}</strong></td>
      </tr>
      ${
        isGroup
          ? `
      <tr>
        <td style="font-weight: bold;">Nama Kelompok</td>
        <td>:</td>
        <td><strong>${groupName}</strong></td>
        <td style="font-weight: bold;">Anggota Tim</td>
        <td>:</td>
        <td colspan="1">${groupMembers}</td>
      </tr>
      `
          : ''
      }
    </table>

    ${themeSectionHtml}

    {/* Section 1: Tujuan Pembelajaran */}
    <div class="sec-heading">I. TUJUAN PEMBELAJARAN</div>
    <ol>${objectivesHtml}</ol>

    {/* Section 2: Deskripsi & Petunjuk */}
    <div class="sec-heading">II. DESKRIPSI DAN PETUNJUK PENGERJAAN</div>
    <p style="margin: 6px 0; font-size: 9.8pt; text-align: justify;">${taskDoc.description}</p>
    <ul>${guidelinesHtml}</ul>

    {/* Section 3: Soal & Instruksi */}
    <div class="sec-heading">III. SOAL DAN INSTRUKSI TUGAS</div>
    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 10px 14px; border-radius: 4px; font-size: 10pt; line-height: 1.5; margin-bottom: 10px;">
      <strong>Instruksi Utama:</strong><br/>
      ${taskDoc.instructions}
    </div>

    ${testCasesHtml}
    ${codeSnippetHtml}

    {/* Section 4: Lembar Jawaban & Kode Siswa */}
    <div class="sec-heading">IV. LEMBAR RANCANGAN & HASIL PENGERJAAN SISWA</div>
    
    <div style="font-size: 9.5pt; font-weight: bold; margin-top: 6px;">1. Rancangan Alur Logika / Algoritma (Deskripsi Singkat / Pseudocode):</div>
    <div class="answer-box">
      <em>(Tuliskan langkah-langkah logika atau rumus yang digunakan kelompokmu di sini...)</em>
    </div>

    <div style="font-size: 9.5pt; font-weight: bold; margin-top: 8px;">2. Kode Program Python Solusi:</div>
    <div style="border: 1.5px solid #17365D; background: #070d18; color: #4ade80; padding: 12px; font-family: 'Courier New', monospace; font-size: 9pt; min-height: 140px; border-radius: 4px; white-space: pre-wrap;">
${taskDoc.userCode || '# Tempel atau tuliskan kode program Python hasil pengerjaanmu di sini\n\n'}
    </div>

    <div style="font-size: 9.5pt; font-weight: bold; margin-top: 10px;">3. Salinan Hasil Eksekusi Terminal (Output Program):</div>
    <div style="border: 1px solid #333; background: #fafafa; padding: 10px; font-family: 'Courier New', monospace; font-size: 8.5pt; min-height: 80px; white-space: pre-wrap;">
${taskDoc.userOutput || '[Hasil keluaran terminal program yang berhasil dijalankan]\n'}
    </div>

    <div style="font-size: 9.5pt; font-weight: bold; margin-top: 10px;">4. Refleksi dan Kendala Pembelajaran:</div>
    <div class="answer-box" style="min-height: 60px;">
      <em>(Apa konsep baru yang dipahami dan apa tantangan yang dihadapi selama menyelesaikan tugas ini?)</em>
    </div>

    {/* Section 5: Kriteria Penilaian */}
    <div class="sec-heading">V. KRITERIA DAN RUBRIK PENILAIAN</div>
    ${rubricHtml}

    {/* Section 6: Signatures */}
    <table class="sig-table">
      <tr>
        <td>
          <div>Mengetahui,</div>
          <div>Guru Pengampu Mata Pelajaran Informatika</div>
          <div style="height: 55px;"></div>
          <div>( .................................................... )</div>
          <div style="font-size: 8.5pt; color: #555;">NIP. ............................................</div>
        </td>
        <td>
          <div>Diverifikasi pada: ${currentDate}</div>
          <div>${isGroup ? 'Ketua Kelompok' : 'Siswa Peserta Didik'}</div>
          <div style="height: 55px;"></div>
          <div><strong>( ${studentName} )</strong></div>
          <div style="font-size: 8.5pt; color: #555;">Kelas: ${studentClass} ${isGroup ? `• ${groupName}` : ''}</div>
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

  const filename = `${taskDoc.filenameBase || 'Dokumen_Tugas_Informatika'}.doc`
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ==========================================================================
// 2. GENERATE PDF (Pure Client-Side PDF 1.4 Binary Generator)
// ==========================================================================
export function downloadTaskPdf(taskDoc: TaskDocumentData): void {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const studentName = taskDoc.studentName || 'Siswa'
  const studentClass = taskDoc.studentClass || 'X'
  const isGroup = taskDoc.taskType === 'kelompok' || taskDoc.taskType === 'proyek'
  const groupName = taskDoc.groupName || '-'
  const groupMembers =
    taskDoc.groupMembers && taskDoc.groupMembers.length > 0
      ? taskDoc.groupMembers.filter(Boolean).join(', ')
      : '-'

  // Clean text for PDF Type 1 encoding (ASCII safe)
  const cleanAscii = (str: string): string => {
    return str
      .replace(/[•●]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[—–]/g, '-')
      .replace(/[↵]/g, ' ')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/[^\x20-\x7E]/g, '')
  }

  const escapePdf = (str: string): string => {
    return cleanAscii(str)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
  }

  // Page dimensions (A4 in points: 595.28 x 841.89)
  const pageWidth = 595.28
  const pageHeight = 841.89
  const marginX = 42
  const contentWidth = pageWidth - 2 * marginX
  const topMargin = pageHeight - 48
  const bottomMargin = 52

  const pages: string[] = []
  let currentCommands: string[] = []
  let cursorY = topMargin

  const startNewPage = () => {
    if (currentCommands.length > 0) {
      pages.push(currentCommands.join('\n'))
    }
    currentCommands = []
    cursorY = topMargin

    // Running Header
    currentCommands.push('0.4 0.45 0.55 rg')
    currentCommands.push('BT /F1 7.5 Tf')
    currentCommands.push(
      `${marginX} ${pageHeight - 28} Td (SINAUPY - Media Pembelajaran Informatika SMA/SMK) Tj ET`
    )
    currentCommands.push(
      `0.85 0.88 0.92 RG 0.5 w ${marginX} ${pageHeight - 32} m ${pageWidth - marginX} ${pageHeight - 32} l S`
    )

    // Reset default text fill
    currentCommands.push('0.09 0.21 0.36 rg')
  }

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY - neededHeight < bottomMargin) {
      startNewPage()
    }
  }

  // Start Page 1
  startNewPage()

  // --- KOP HEADER ---
  currentCommands.push('0.19 0.36 0.61 rg')
  currentCommands.push('BT /F2 8 Tf')
  currentCommands.push(
    `${marginX + (contentWidth - 280) / 2} ${cursorY} Td (MEDIA PEMBELAJARAN INFORMATIKA SMA / SMK) Tj ET`
  )
  cursorY -= 14

  currentCommands.push('0.09 0.21 0.36 rg')
  currentCommands.push('BT /F2 13 Tf')
  currentCommands.push(
    `${marginX + (contentWidth - 270) / 2} ${cursorY} Td (SINAUPY - PYTHON LEARNING ENVIRONMENT) Tj ET`
  )
  cursorY -= 12

  currentCommands.push('0.38 0.46 0.56 rg')
  currentCommands.push('BT /F1 7.5 Tf')
  currentCommands.push(
    `${marginX + (contentWidth - 320) / 2} ${cursorY} Td (Modul Praktik Terbimbing, Tantangan Berjenjang, dan Kolaborasi Kelompok) Tj ET`
  )
  cursorY -= 10

  // Kop Double Divider
  currentCommands.push(
    `0.09 0.21 0.36 RG 1.5 w ${marginX} ${cursorY} m ${pageWidth - marginX} ${cursorY} l S`
  )
  cursorY -= 2.5
  currentCommands.push(
    `0.09 0.21 0.36 RG 0.5 w ${marginX} ${cursorY} m ${pageWidth - marginX} ${cursorY} l S`
  )
  cursorY -= 14

  // --- DOCUMENT TITLE ---
  currentCommands.push('0.09 0.21 0.36 rg')
  currentCommands.push('BT /F2 10.5 Tf')
  currentCommands.push(
    `${marginX + (contentWidth - 290) / 2} ${cursorY} Td (LEMBAR KERJA TUGAS & ASESMEN PEMROGRAMAN) Tj ET`
  )
  cursorY -= 14

  // --- IDENTITY BOX ---
  const idBoxHeight = isGroup ? 66 : 52
  checkPageBreak(idBoxHeight + 10)
  currentCommands.push(
    `0.96 0.97 0.99 rg ${marginX} ${cursorY - idBoxHeight} ${contentWidth} ${idBoxHeight} re f`
  )
  currentCommands.push(
    `0.85 0.89 0.94 RG 1 w ${marginX} ${cursorY - idBoxHeight} ${contentWidth} ${idBoxHeight} re S`
  )

  let idY = cursorY - 12
  currentCommands.push('0.09 0.21 0.36 rg')

  // Row 1
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 10} ${idY} Td (Mata Pelajaran: ) Tj ET`)
  currentCommands.push('BT /F1 8.5 Tf')
  currentCommands.push(`${marginX + 80} ${idY} Td (Informatika (Fase E / Kelas X)) Tj ET`)
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 320} ${idY} Td (Tanggal Unduh: ) Tj ET`)
  currentCommands.push('BT /F1 8.5 Tf')
  currentCommands.push(`${marginX + 395} ${idY} Td (${escapePdf(currentDate)}) Tj ET`)

  // Row 2
  idY -= 12
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 10} ${idY} Td (Materi / Topik: ) Tj ET`)
  currentCommands.push('BT /F1 8.5 Tf')
  currentCommands.push(`${marginX + 80} ${idY} Td (${escapePdf(taskDoc.topic).slice(0, 42)}) Tj ET`)
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 320} ${idY} Td (Jenis Tugas: ) Tj ET`)
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 395} ${idY} Td (${escapePdf(taskDoc.taskType.toUpperCase())}) Tj ET`)

  // Row 3
  idY -= 12
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 10} ${idY} Td (Nama Tugas: ) Tj ET`)
  currentCommands.push('0.19 0.36 0.61 rg BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 80} ${idY} Td (${escapePdf(taskDoc.title).slice(0, 42)}) Tj ET`)
  currentCommands.push('0.09 0.21 0.36 rg BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 320} ${idY} Td (Kelas / Rombel: ) Tj ET`)
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 395} ${idY} Td (${escapePdf(studentClass)}) Tj ET`)

  // Row 4 (Group info)
  idY -= 12
  currentCommands.push('BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 10} ${idY} Td (Nama Siswa: ) Tj ET`)
  currentCommands.push('BT /F1 8.5 Tf')
  currentCommands.push(`${marginX + 80} ${idY} Td (${escapePdf(studentName)}) Tj ET`)

  if (isGroup) {
    idY -= 12
    currentCommands.push('BT /F2 8.5 Tf')
    currentCommands.push(`${marginX + 10} ${idY} Td (Kelompok: ) Tj ET`)
    currentCommands.push('BT /F1 8.5 Tf')
    currentCommands.push(
      `${marginX + 80} ${idY} Td (${escapePdf(groupName)} - Anggota: ${escapePdf(groupMembers).slice(0, 48)}) Tj ET`
    )
  }

  cursorY = cursorY - idBoxHeight - 16

  // Helper to draw section heading bar
  const drawSectionHeading = (numRoman: string, titleStr: string) => {
    checkPageBreak(30)
    currentCommands.push(
      `0.92 0.95 0.98 rg ${marginX} ${cursorY - 14} ${contentWidth} 16 re f`
    )
    currentCommands.push(
      `0.19 0.36 0.61 rg ${marginX} ${cursorY - 14} 4 16 re f`
    )
    currentCommands.push('0.09 0.21 0.36 rg BT /F2 9 Tf')
    currentCommands.push(
      `${marginX + 8} ${cursorY - 10} Td (${escapePdf(`${numRoman}. ${titleStr}`)}) Tj ET`
    )
    cursorY -= 22
  }

  // --- SECTION I: TUJUAN PEMBELAJARAN ---
  drawSectionHeading('I', 'TUJUAN PEMBELAJARAN')
  taskDoc.learningObjectives.forEach((obj, idx) => {
    checkPageBreak(14)
    currentCommands.push('0.09 0.21 0.36 rg BT /F1 8.5 Tf')
    currentCommands.push(
      `${marginX + 6} ${cursorY} Td (${idx + 1}. ${escapePdf(obj)}) Tj ET`
    )
    cursorY -= 12
  })
  cursorY -= 4

  // --- SECTION II: DESKRIPSI & PETUNJUK PENGERJAAN ---
  drawSectionHeading('II', 'DESKRIPSI DAN PETUNJUK PENGERJAAN')

  // Description text wrapping
  const wrapAndDrawText = (text: string, fontName = '/F1', fontSize = 8.5, maxChars = 94, lineSpacing = 11) => {
    const words = cleanAscii(text).split(' ')
    let line = ''
    words.forEach((w) => {
      if ((line + ' ' + w).length <= maxChars) {
        line += (line ? ' ' : '') + w
      } else {
        checkPageBreak(lineSpacing + 2)
        currentCommands.push(`0.09 0.21 0.36 rg BT ${fontName} ${fontSize} Tf`)
        currentCommands.push(`${marginX + 6} ${cursorY} Td (${escapePdf(line)}) Tj ET`)
        cursorY -= lineSpacing
        line = w
      }
    })
    if (line) {
      checkPageBreak(lineSpacing + 2)
      currentCommands.push(`0.09 0.21 0.36 rg BT ${fontName} ${fontSize} Tf`)
      currentCommands.push(`${marginX + 6} ${cursorY} Td (${escapePdf(line)}) Tj ET`)
      cursorY -= lineSpacing
    }
  }

  wrapAndDrawText(taskDoc.description, '/F1', 8.5, 96, 11)
  cursorY -= 4

  taskDoc.guidelines.forEach((g) => {
    checkPageBreak(12)
    wrapAndDrawText(`- ${g}`, '/F1', 8, 96, 10.5)
  })
  cursorY -= 6

  // --- SECTION III: SOAL & INSTRUKSI TUGAS ---
  drawSectionHeading('III', 'SOAL DAN INSTRUKSI TUGAS')

  // Instruction Box
  checkPageBreak(40)
  currentCommands.push(
    `0.97 0.98 1 rg ${marginX} ${cursorY - 26} ${contentWidth} 28 re f`
  )
  currentCommands.push(
    `0.80 0.85 0.92 RG 1 w ${marginX} ${cursorY - 26} ${contentWidth} 28 re S`
  )
  currentCommands.push('0.09 0.21 0.36 rg BT /F2 8.5 Tf')
  currentCommands.push(`${marginX + 8} ${cursorY - 10} Td (Instruksi Pengerjaan:) Tj ET`)
  cursorY -= 14
  wrapAndDrawText(taskDoc.instructions, '/F1', 8, 92, 10)
  cursorY -= 16

  // Test Cases Table (if present)
  if (taskDoc.testCases && taskDoc.testCases.length > 0) {
    checkPageBreak(60)
    currentCommands.push('0.09 0.21 0.36 rg BT /F2 8.5 Tf')
    currentCommands.push(`${marginX + 6} ${cursorY} Td (Contoh Kasus Uji (Test Cases):) Tj ET`)
    cursorY -= 12

    // Table Header
    currentCommands.push(
      `0.92 0.95 0.98 rg ${marginX} ${cursorY - 12} ${contentWidth} 14 re f`
    )
    currentCommands.push(
      `0.2 0.3 0.4 RG 0.5 w ${marginX} ${cursorY - 12} ${contentWidth} 14 re S`
    )
    currentCommands.push('BT /F2 7.5 Tf')
    currentCommands.push(`${marginX + 8} ${cursorY - 9} Td (Kasus) Tj ET`)
    currentCommands.push(`${marginX + 70} ${cursorY - 9} Td (Masukan Program (Input)) Tj ET`)
    currentCommands.push(`${marginX + 270} ${cursorY - 9} Td (Target Keluaran yang Diharapkan) Tj ET`)
    cursorY -= 14

    taskDoc.testCases.forEach((tc, idx) => {
      checkPageBreak(16)
      currentCommands.push(
        `0.85 0.88 0.92 RG 0.5 w ${marginX} ${cursorY - 12} ${contentWidth} 14 re S`
      )
      currentCommands.push('BT /F2 7.5 Tf')
      currentCommands.push(`${marginX + 8} ${cursorY - 9} Td (Kasus #${idx + 1}) Tj ET`)
      currentCommands.push('BT /F3 7 Tf')
      currentCommands.push(
        `${marginX + 70} ${cursorY - 9} Td (${escapePdf(tc.input).slice(0, 42)}) Tj ET`
      )
      currentCommands.push('BT /F1 7.5 Tf')
      currentCommands.push(
        `${marginX + 270} ${cursorY - 9} Td (${escapePdf(tc.expected).slice(0, 45)}) Tj ET`
      )
      cursorY -= 14
    })
    cursorY -= 6
  }

  // Code Snippet Box (if present)
  if (taskDoc.codeSnippet) {
    checkPageBreak(70)
    currentCommands.push('0.09 0.21 0.36 rg BT /F2 8.5 Tf')
    currentCommands.push(`${marginX + 6} ${cursorY} Td (Kode Awal / Referensi Python:) Tj ET`)
    cursorY -= 10

    const snippetLines = taskDoc.codeSnippet.split('\n').slice(0, 18)
    const boxH = Math.min(snippetLines.length * 9.5 + 8, 120)

    currentCommands.push(
      `0.04 0.08 0.15 rg ${marginX} ${cursorY - boxH} ${contentWidth} ${boxH} re f`
    )
    currentCommands.push(
      `0.12 0.20 0.32 RG 1 w ${marginX} ${cursorY - boxH} ${contentWidth} ${boxH} re S`
    )

    let codeY = cursorY - 9
    currentCommands.push('0.49 0.83 0.99 rg')
    snippetLines.forEach((cline) => {
      currentCommands.push('BT /F3 7 Tf')
      currentCommands.push(`${marginX + 8} ${codeY} Td (${escapePdf(cline).slice(0, 80)}) Tj ET`)
      codeY -= 9.5
    })
    cursorY = cursorY - boxH - 12
  }

  // --- SECTION IV: LEMBAR JAWABAN & HASIL SISWA ---
  drawSectionHeading('IV', 'LEMBAR RANCANGAN & HASIL PENGERJAAN SISWA')

  // Box 1: Rancangan
  checkPageBreak(50)
  currentCommands.push('BT /F2 8 Tf')
  currentCommands.push(`${marginX + 6} ${cursorY} Td (1. Rancangan Alur Algoritma / Pseudocode:) Tj ET`)
  cursorY -= 8
  currentCommands.push(
    `0.98 0.99 1 rg ${marginX} ${cursorY - 34} ${contentWidth} 36 re f`
  )
  currentCommands.push(
    `0.6 0.7 0.85 RG 0.5 w ${marginX} ${cursorY - 34} ${contentWidth} 36 re S`
  )
  currentCommands.push('0.4 0.45 0.55 rg BT /F1 7.5 Tf')
  currentCommands.push(
    `${marginX + 8} ${cursorY - 14} Td ((Ruang coretan perancangan variabel, alur percabangan, dan rumus)) Tj ET`
  )
  cursorY -= 44

  // Box 2: Kode Program Solusi Siswa
  checkPageBreak(70)
  currentCommands.push('0.09 0.21 0.36 rg BT /F2 8 Tf')
  currentCommands.push(`${marginX + 6} ${cursorY} Td (2. Kode Program Solusi Python Siswa:) Tj ET`)
  cursorY -= 8

  const userLines = (taskDoc.userCode || '# Kode program Python kelompokmu yang telah diuji di SinauPy\n').split('\n').slice(0, 14)
  const userBoxH = Math.min(userLines.length * 9.5 + 8, 100)
  currentCommands.push(
    `0.03 0.05 0.10 rg ${marginX} ${cursorY - userBoxH} ${contentWidth} ${userBoxH} re f`
  )
  currentCommands.push(
    `0.1 0.2 0.35 RG 1 w ${marginX} ${cursorY - userBoxH} ${contentWidth} ${userBoxH} re S`
  )
  let uY = cursorY - 9
  currentCommands.push('0.29 0.87 0.5 rg')
  userLines.forEach((l) => {
    currentCommands.push('BT /F3 7 Tf')
    currentCommands.push(`${marginX + 8} ${uY} Td (${escapePdf(l).slice(0, 80)}) Tj ET`)
    uY -= 9.5
  })
  cursorY = cursorY - userBoxH - 12

  // --- SECTION V: RUBRIK PENILAIAN ---
  if (taskDoc.rubric && taskDoc.rubric.length > 0) {
    drawSectionHeading('V', 'KRITERIA DAN RUBRIK PENILAIAN')
    checkPageBreak(50)

    // Rubric Table Header
    currentCommands.push(
      `0.92 0.95 0.98 rg ${marginX} ${cursorY - 12} ${contentWidth} 14 re f`
    )
    currentCommands.push(
      `0.2 0.3 0.4 RG 0.5 w ${marginX} ${cursorY - 12} ${contentWidth} 14 re S`
    )
    currentCommands.push('0.09 0.21 0.36 rg BT /F2 7.5 Tf')
    currentCommands.push(`${marginX + 8} ${cursorY - 9} Td (Kriteria Penilaian) Tj ET`)
    currentCommands.push(`${marginX + 150} ${cursorY - 9} Td (Bobot) Tj ET`)
    currentCommands.push(`${marginX + 200} ${cursorY - 9} Td (Deskripsi Capaian Kompetensi) Tj ET`)
    currentCommands.push(`${marginX + 450} ${cursorY - 9} Td (Skor) Tj ET`)
    cursorY -= 14

    taskDoc.rubric.forEach((r) => {
      checkPageBreak(16)
      currentCommands.push(
        `0.85 0.88 0.92 RG 0.5 w ${marginX} ${cursorY - 12} ${contentWidth} 14 re S`
      )
      currentCommands.push('BT /F2 7.5 Tf')
      currentCommands.push(`${marginX + 8} ${cursorY - 9} Td (${escapePdf(r.criteria).slice(0, 26)}) Tj ET`)
      currentCommands.push('0.19 0.36 0.61 rg BT /F2 7.5 Tf')
      currentCommands.push(`${marginX + 155} ${cursorY - 9} Td (${escapePdf(r.weight)}) Tj ET`)
      currentCommands.push('0.09 0.21 0.36 rg BT /F1 7 Tf')
      currentCommands.push(`${marginX + 200} ${cursorY - 9} Td (${escapePdf(r.description).slice(0, 52)}) Tj ET`)
      cursorY -= 14
    })
    cursorY -= 6
  }

  // --- SIGNATURES ---
  checkPageBreak(65)
  cursorY -= 10
  currentCommands.push('0.09 0.21 0.36 rg BT /F1 7.5 Tf')
  currentCommands.push(`${marginX + 40} ${cursorY} Td (Mengetahui,) Tj ET`)
  currentCommands.push(
    `${marginX + 330} ${cursorY} Td (Diverifikasi pada: ${escapePdf(currentDate)}) Tj ET`
  )
  cursorY -= 10
  currentCommands.push('BT /F2 7.5 Tf')
  currentCommands.push(
    `${marginX + 40} ${cursorY} Td (Guru Pengampu Informatika) Tj ET`
  )
  currentCommands.push(
    `${marginX + 330} ${cursorY} Td (${isGroup ? 'Ketua Kelompok' : 'Siswa Peserta Didik'}) Tj ET`
  )
  cursorY -= 36

  currentCommands.push(
    `0.4 0.4 0.4 RG 0.5 w ${marginX + 40} ${cursorY} m ${marginX + 180} ${cursorY} l S`
  )
  currentCommands.push(
    `0.4 0.4 0.4 RG 0.5 w ${marginX + 330} ${cursorY} m ${marginX + 470} ${cursorY} l S`
  )
  cursorY -= 10
  currentCommands.push('BT /F2 7.5 Tf')
  currentCommands.push(`${marginX + 40} ${cursorY} Td (NIP. ....................................) Tj ET`)
  currentCommands.push(
    `${marginX + 330} ${cursorY} Td (${escapePdf(studentName)} / ${escapePdf(studentClass)}) Tj ET`
  )

  // Push final page
  pages.push(currentCommands.join('\n'))

  // Add Footers to all pages with Total Page Count
  const totalPages = pages.length
  const finalPages = pages.map((pageContent, idx) => {
    const footerStr = `
0.4 0.45 0.55 rg
BT /F1 7.5 Tf
${marginX} 28 Td (SinauPy - Media Belajar Informatika SMA/SMK | ${escapePdf(taskDoc.title).slice(0, 45)}) Tj ET
BT /F1 7.5 Tf
${pageWidth - marginX - 70} 28 Td (Halaman ${idx + 1} dari ${totalPages}) Tj ET
0.85 0.88 0.92 RG 0.5 w ${marginX} 36 m ${pageWidth - marginX} 36 l S
`
    return pageContent + footerStr
  })

  // Assemble Standard Compliant PDF 1.4 Binary
  let pdfOutput = '%PDF-1.4\n%âãÏÓ\n'
  const offsets: number[] = []

  const addObj = (objContent: string): number => {
    offsets.push(pdfOutput.length)
    const objNum = offsets.length
    pdfOutput += `${objNum} 0 obj\n${objContent}\nendobj\n`
    return objNum
  }

  // 1: Catalog
  // 2: Pages
  // 3: Font F1 (Helvetica)
  // 4: Font F2 (Helvetica-Bold)
  // 5: Font F3 (Courier)
  // 6.. : Page and Content objects
  const f1Num = 3
  const f2Num = 4
  const f3Num = 5

  const pageObjNums: number[] = []
  const contentObjNums: number[] = []

  // Pre-calculate page and content object IDs
  for (let i = 0; i < totalPages; i++) {
    pageObjNums.push(6 + i * 2)
    contentObjNums.push(7 + i * 2)
  }

  // Obj 1: Catalog
  addObj('<< /Type /Catalog /Pages 2 0 R >>')

  // Obj 2: Pages
  addObj(
    `<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(' ')}] /Count ${totalPages} >>`
  )

  // Obj 3, 4, 5: Fonts
  addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')
  addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>')

  // Generate Page & Content Objects
  for (let i = 0; i < totalPages; i++) {
    const stream = finalPages[i]
    // Page Obj
    addObj(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${f1Num} 0 R /F2 ${f2Num} 0 R /F3 ${f3Num} 0 R >> >> /Contents ${contentObjNums[i]} 0 R >>`
    )
    // Content Stream Obj
    addObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
  }

  // Cross-reference table
  const startXref = pdfOutput.length
  pdfOutput += `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \r\n`
  for (let i = 0; i < offsets.length; i++) {
    const offStr = String(offsets[i]).padStart(10, '0')
    pdfOutput += `${offStr} 00000 n \r\n`
  }

  pdfOutput += `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`

  const blob = new Blob([pdfOutput], { type: 'application/pdf' })
  const filename = `${taskDoc.filenameBase || 'Dokumen_Tugas_Informatika'}.pdf`
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
