export interface TestCase {
  input: string
  expected: string
}

export interface ChallengeItem {
  id: string
  category: 'individu' | 'kelompok' | 'hots'
  level: number
  title: string
  subtitle: string
  competency: string
  roles?: string[]
  story: string
  task: string
  inputGuide: string
  outputGuide: string
  hints: string[]
  initialCode: string
  testCases: TestCase[]
  points: number
}

export const INDIVIDUAL_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ind-lvl-1',
    category: 'individu',
    level: 1,
    title: 'Sistem Tiket Kebun Raya Sekolah',
    subtitle: 'Variabel, Input Angka, dan Percabangan Dasar',
    competency: 'Menerapkan input dinamis dan percabangan if-elif-else untuk penentuan kategori harga.',
    story:
      'Kebun Raya Sekolah membuka kunjungan edukasi biologi. Tarif tiket ditentukan berdasarkan usia pengunjung: Anak-anak (di bawah 12 tahun) seharga Rp10.000, Pelajar/Remaja (12 - 18 tahun) seharga Rp15.000, dan Dewasa (di atas 18 tahun) seharga Rp25.000.',
    task:
      'Buatlah program yang meminta nama pengunjung dan usia pengunjung. Program kemudian mencetak nama pengunjung, kategori pengunjung, dan harga tiket yang harus dibayar.',
    inputGuide: 'Baris 1: Nama pengunjung (teks)\nBaris 2: Usia (bilangan bulat)',
    outputGuide: 'Nama, kategori tiket (Anak-anak / Pelajar / Dewasa), dan total biaya tiket.',
    hints: [
      'Gunakan nama = input() untuk baris pertama.',
      'Gunakan usia = int(input()) untuk baris kedua.',
      'Gunakan if usia < 12, elif usia <= 18, dan else untuk menentukan tarif.',
    ],
    initialCode: '',
    testCases: [
      { input: 'Andi\n10', expected: 'Kategori: Anak-anak, Tiket: Rp10.000' },
      { input: 'Siti\n16', expected: 'Kategori: Pelajar, Tiket: Rp15.000' },
      { input: 'Pak Budi\n35', expected: 'Kategori: Dewasa, Tiket: Rp25.000' },
    ],
    points: 100,
  },
  {
    id: 'ind-lvl-2',
    category: 'individu',
    level: 2,
    title: 'Kalkulator Gaji & Upah Lembur Koperasi',
    subtitle: 'Aritmatika, Operator Logika, dan Percabangan Majemuk',
    competency: 'Menghitung upah pokok, lembur, dan bonus bersyarat berdasarkan jam kerja riil.',
    story:
      'Karyawan koperasi sekolah memiliki jam kerja standar 40 jam per minggu dengan upah pokok Rp20.000 per jam. Jika bekerja lebih dari 40 jam, sisa jam dihitung lembur dengan upah 1.5 kali lipat (Rp30.000 per jam). Karyawan yang bekerja minimal 50 jam juga mendapat bonus disiplin Rp50.000.',
    task:
      'Buatlah program yang meminta nama karyawan dan jumlah total jam kerja dalam seminggu. Hitung dan tampilkan upah pokok, upah lembur, bonus, dan total penghasilan bersih.',
    inputGuide: 'Baris 1: Nama karyawan\nBaris 2: Jam kerja (angka bulat/desimal)',
    outputGuide: 'Rincian upah pokok, upah lembur, bonus disiplin, dan total gaji.',
    hints: [
      'Gunakan percabangan if jam_kerja > 40 untuk memisahkan jam reguler dan jam lembur.',
      'Jika jam lembur > 10 (total >= 50 jam), tambahkan bonus Rp50.000.',
      'Format keluaran menggunakan f-string agar rapi.',
    ],
    initialCode: '',
    testCases: [
      { input: 'Budi\n38', expected: 'Total upah: Rp760.000 (tanpa lembur)' },
      { input: 'Dewi\n45', expected: 'Lembur 5 jam: Rp150.000, Total: Rp950.000' },
      { input: 'Fajar\n52', expected: 'Lembur 12 jam + Bonus Rp50.000, Total: Rp1.210.000' },
    ],
    points: 100,
  },
  {
    id: 'ind-lvl-3',
    category: 'individu',
    level: 3,
    title: 'Analisis Statistik Nilai Asesmen Kelas',
    subtitle: 'List, Perulangan For, dan Pengolahan Data Array',
    competency: 'Memproses sekumpulan nilai numerik untuk menemukan nilai tertinggi, terendah, rata-rata, dan status kelulusan KKM.',
    story:
      'Guru Informatika memerlukan sistem untuk menganalisis daftar nilai ujian kelas. Sistem harus membaca jumlah siswa, kemudian membaca setiap nilai siswa ke dalam list, lalu mencari nilai tertinggi, terendah, nilai rata-rata kelas, serta menghitung berapa siswa yang tuntas (nilai >= 75) dan belum tuntas (< 75).',
    task:
      'Buatlah program yang meminta jumlah siswa, kemudian membaca nilai masing-masing siswa. Tampilkan nilai tertinggi, terendah, rata-rata kelas (2 angka di belakang koma), serta jumlah siswa yang tuntas KKM.',
    inputGuide: 'Baris 1: Jumlah siswa N\nBaris 2 s/d N+1: Nilai masing-masing siswa',
    outputGuide: 'Nilai tertinggi, terendah, rata-rata kelas, dan jumlah tuntas KKM.',
    hints: [
      'Buat list kosong nilai_list = [] lalu gunakan loop for _ in range(n) dengan append.',
      'Gunakan fungsi max(), min(), sum() untuk kalkulasi cepat.',
      'Hitung tuntas dengan loop atau list comprehension [x for x in nilai_list if x >= 75].',
    ],
    initialCode: '',
    testCases: [
      { input: '4\n80\n90\n70\n60', expected: 'Max: 90, Min: 60, Rata-rata: 75.0, Tuntas: 2 siswa' },
      { input: '3\n85\n75\n100', expected: 'Max: 100, Min: 75, Rata-rata: 86.67, Tuntas: 3 siswa' },
    ],
    points: 100,
  },
  {
    id: 'ind-lvl-4',
    category: 'individu',
    level: 4,
    title: 'Auditor Keamanan Sandi Akun Siswa',
    subtitle: 'Manipulasi String, Boolean Flag, dan Validasi Keamanan',
    competency: 'Melakukan validasi kompleks terhadap sebuah teks string berdasarkan kriteria keamanan ganda.',
    story:
      'Untuk melindungi portal belajar siswa dari ancaman peretasan, tim IT sekolah menerapkan aturan kata sandi yang ketat: Sandi harus memiliki panjang minimal 8 karakter, mengandung setidaknya 1 huruf besar (A-Z), setidaknya 1 huruf kecil (a-z), setidaknya 1 angka (0-9), dan setidaknya 1 karakter spesial (!@#$%^&*).',
    task:
      'Buatlah program yang membaca kata sandi dari input, lalu mengevaluasi setiap kriteria tersebut. Jika semua syarat terpenuhi, cetak "Sandi Kuat - Diterima". Jika tidak, sebutkan kekurangan syaratnya (misal: "Kurang huruf besar", "Kurang angka", dll) dan cetak "Sandi Lemah - Ditolak".',
    inputGuide: 'Baris 1: Kata sandi yang akan diuji',
    outputGuide: 'Hasil evaluasi status sandi dan detail kriteria yang belum terpenuhi.',
    hints: [
      'Gunakan variabel penanda (flag) boolean: ada_besar = False, ada_kecil = False, ada_angka = False, ada_simbol = False.',
      'Gunakan for char in sandi: lalu uji dengan char.isupper(), char.islower(), char.isdigit().',
      'Karakter khusus dapat dicek dengan char in "!@#$%^&*".',
    ],
    initialCode: '',
    testCases: [
      { input: 'Belajar123!', expected: 'Sandi Kuat - Diterima' },
      { input: 'python', expected: 'Sandi Lemah - Ditolak (Panjang kurang, tidak ada huruf besar/angka/simbol)' },
      { input: 'Rahasia123', expected: 'Sandi Lemah - Ditolak (Kurang simbol spesial)' },
    ],
    points: 100,
  },
]

export const GROUP_CHALLENGES: ChallengeItem[] = [
  {
    id: 'grp-lvl-1',
    category: 'kelompok',
    level: 1,
    title: 'Sistem Kasir Koperasi Siswa & Struk Digital',
    subtitle: 'Kolaborasi: Input Multi-Item, Pajak, Diskon Member, dan Formatting',
    competency: 'Merancang program transaksi kasir mini terstruktur dengan pembagian peran tim.',
    roles: [
      'Peran 1 (Analis Transaksi): Merancang alur input nama pembeli, status member, dan daftar item belanja.',
      'Peran 2 (Programmer Rumus): Menyusun logika hitung subtotal, diskon member (5%), pajak PPN (11%), dan total bayar.',
      'Peran 3 (Quality Tester): Menguji struk belanja dengan kasus belanja di atas Rp100.000 dan kasus member vs non-member.',
    ],
    story:
      'Koperasi Siswa Mandiri memerlukan program kasir sederhana untuk bazar sekolah. Program harus mencatat nama pembeli, status keanggotaan (Member / Non-Member), dan 3 barang belanjaan (nama barang, harga satuan, dan kuantitas). Anggota koperasi (Member) mendapat diskon 5% dari subtotal sebelum pajak PPN 11%.',
    task:
      'Susun bersama program yang meminta nama pembeli, status member (Y/T), lalu 3 kali membaca nama barang, harga, dan jumlah beli. Hitung subtotal, diskon member, PPN 11%, dan total bayar akhir.',
    inputGuide: 'Baris 1: Nama pembeli\nBaris 2: Member (Y/T)\nBaris 3-5: Nama barang, harga satuan, jumlah (berulang 3 kali)',
    outputGuide: 'Rincian subtotal ketiga barang, potongan diskon member, PPN 11%, dan total pembayaran akhir.',
    hints: [
      'Gunakan loop for i in range(3) untuk membaca 3 barang belanjaan secara efisien.',
      'Hitung subtotal = harga * jumlah untuk setiap barang dan akumulasikan ke total_kotor.',
      'Jika status == "Y", diskon = 0.05 * total_kotor; jika tidak diskon = 0.',
      'Pajak = 0.11 * (total_kotor - diskon). Total bayar = (total_kotor - diskon) + pajak.',
    ],
    initialCode: '',
    testCases: [
      { input: 'Kelompok 1\nY\nBuku\n5000\n2\nPensil\n2000\n3\nPenghapus\n1000\n1', expected: 'Subtotal: Rp17.000, Diskon 5%: Rp850, PPN 11%: Rp1.776, Total: Rp17.926' },
      { input: 'Andi\nT\nKue\n10000\n2\nEs Teh\n3000\n2\nKeripik\n5000\n1', expected: 'Subtotal: Rp31.000, Diskon: Rp0, PPN 11%: Rp3.410, Total: Rp34.410' },
    ],
    points: 100,
  },
  {
    id: 'grp-lvl-2',
    category: 'kelompok',
    level: 2,
    title: 'Sistem Rekapitulasi Presensi & Disiplin Kelas',
    subtitle: 'Kolaborasi: Nested Data, Persentase Kehadiran, dan Ambang Batas',
    competency: 'Mengolah matriks kehadiran kelompok dan mengevaluasi siswa yang memerlukan pembinaan wali kelas.',
    roles: [
      'Peran 1 (Analis Data Siswa): Menentukan skema input nama siswa dan data absensi (Hadir, Izin, Sakit, Alpa).',
      'Peran 2 (Programmer Algoritma): Menghitung persentase kehadiran: (Hadir / Total Pertemuan) * 100% dan status pembinaan.',
      'Peran 3 (Penguji Kasus Batas): Memvalidasi jika ada siswa dengan kehadiran < 75% atau Alpa >= 3 kali.',
    ],
    story:
      'Pengurus kelas dan wali kelas membutuhkan rekap kehadiran 4 siswa selama 20 pertemuan efektif. Kriteria disiplin sekolah: Jika kehadiran minimal 90%, siswa mendapat predikat "Sangat Disiplin". Jika 75% - 89%, predikat "Cukup". Jika di bawah 75% ATAU siswa memiliki Alpa (tanpa keterangan) minimal 3 kali, status "Panggilan Wali Kelas".',
    task:
      'Tuliskan program kelompok yang membaca data untuk beberapa siswa (Nama, Hadir, Izin, Sakit, Alpa). Hitung persentase kehadiran setiap siswa dan tentukan predikat kedisiplinannya.',
    inputGuide: 'Baris 1: Jumlah siswa yang didata (misal: 3)\nSetiap siswa berikutnya: Nama, Hadir, Izin, Sakit, Alpa (masing-masing di baris terpisah)',
    outputGuide: 'Daftar nama siswa, persentase kehadiran, dan status kedisiplinan / peringatan.',
    hints: [
      'Pastikan Hadir + Izin + Sakit + Alpa dihitung atau gunakan standar total 20 pertemuan.',
      'Persentase = (hadir / 20) * 100.',
      'Kondisi waspada: persentase < 75 or alpa >= 3.',
    ],
    initialCode: '',
    testCases: [
      { input: '2\nRani\n19\n1\n0\n0\nDoni\n14\n1\n2\n3', expected: 'Rani: 95.0% (Sangat Disiplin); Doni: 70.0% (Panggilan Wali Kelas - Alpa 3x)' },
    ],
    points: 100,
  },
  {
    id: 'grp-lvl-3',
    category: 'kelompok',
    level: 3,
    title: 'Simulasi Sistem Parkir Cerdas SMA Taruna',
    subtitle: 'Kolaborasi: Logika Tarif Bertingkat, Plafon Maksimum, dan Rekap Finansial',
    competency: 'Merancang simulasi sistem parkir otomatis berbasis jenis kendaraan dan durasi parkir bertingkat.',
    roles: [
      'Peran 1 (Perancang Sistem): Merancang struktur aturan tarif Motor vs Mobil dan penanganan voucher.',
      'Peran 2 (Pengembang Logika): Menghitung jam pertama vs jam berikutnya, batas biaya harian (maksimal), dan potongan voucher.',
      'Peran 3 (Penguji Verifikasi): Menjalankan pengujian dengan durasi parkir singkat (1 jam), lama (10 jam), dan voucher.',
    ],
    story:
      'Sistem parkir pintar di lingkungan sekolah memiliki aturan: Motor: Rp2.000 untuk jam pertama, dan Rp1.000 untuk setiap jam berikutnya (maksimal Rp10.000 per hari). Mobil: Rp5.000 untuk jam pertama, dan Rp3.000 untuk setiap jam berikutnya (maksimal Rp25.000 per hari). Jika memiliki kode voucher "GURUSMA", biaya parkir gratis (Rp0).',
    task:
      'Buatlah program yang meminta jenis kendaraan (MOTOR/MOBIL), lama parkir dalam jam (pembulatan ke atas), dan kode voucher. Hitung dan tampilkan total tarif parkir yang harus dibayar.',
    inputGuide: 'Baris 1: Jenis kendaraan (MOTOR / MOBIL)\nBaris 2: Durasi dalam jam (angka bulat)\nBaris 3: Kode voucher (string)',
    outputGuide: 'Rincian tarif awal, tarif tambahan, diskon voucher, dan total biaya parkir akhir.',
    hints: [
      'Gunakan string.upper() untuk menghindari kesalahan huruf besar/kecil.',
      'Cek voucher "GURUSMA" terlebih dahulu, jika cocok total langsung Rp0.',
      'Gunakan fungsi min(biaya_terhitung, batas_maksimal) untuk menerapkan plafon harga harian.',
    ],
    initialCode: '',
    testCases: [
      { input: 'MOTOR\n4\nTIADA', expected: 'Jam 1: Rp2.000 + 3x Rp1.000 = Rp5.000' },
      { input: 'MOBIL\n12\nTIADA', expected: 'Terkena tarif batas maksimal: Rp25.000' },
      { input: 'MOBIL\n5\nGURUSMA', expected: 'Voucher valid! Total parkir: Rp0' },
    ],
    points: 100,
  },
  {
    id: 'grp-lvl-4',
    category: 'kelompok',
    level: 4,
    title: 'Sistem Monitoring Indeks Standar Pencemar Udara (ISPU)',
    subtitle: 'Kolaborasi: Pengolahan Sensor Multi-Parameter, Deteksi Bahaya & Protokol Mitigasi',
    competency: 'Menganalisis multi-sensor lingkungan dan merumuskan protokol darurat keselamatan sekolah secara otomatis.',
    roles: [
      'Peran 1 (Analis Sensor Lingkungan): Menentukan klasifikasi nilai ISPU PM2.5 (0-50 Baik, 51-100 Sedang, 101-200 Tidak Sehat, 201-300 Sangat Tidak Sehat, >300 Berbahaya).',
      'Peran 2 (Arsitek Keputusan Otomatis): Menentukan rekomendasi tindakan sekolah (Kegiatan luar ruangan normal, Wajib masker, Pembelajaran daring / evakuasi).',
      'Peran 3 (Penguji Protokol): Menguji sistem dengan nilai ekstrem (0, 75, 180, 350) dan memverifikasi kesesuaian tindakan darurat.',
    ],
    story:
      'Untuk menjaga kesehatan siswa di masa musim kabut asap / polusi kota, lab komputer sekolah merancang program stasiun pemantau udara. Program menerima 3 data pembacaan sensor PM2.5 pada pagi, siang, dan sore hari. Program harus menghitung rata-rata harian, mencari konsentrasi tertinggi, mengkategorikan level ISPU, dan mencetak instruksi keselamatan sekolah.',
    task:
      'Buatlah program yang membaca 3 nilai ISPU harian. Hitung nilai rata-rata dan nilai puncak (maksimum), tentukan kategori kualitas udara berdasarkan nilai rata-rata, dan berikan arahan keselamatan resmi bagi civitas sekolah.',
    inputGuide: 'Baris 1: Nilai PM2.5 Pagi\nBaris 2: Nilai PM2.5 Siang\nBaris 3: Nilai PM2.5 Sore',
    outputGuide: 'Rata-rata ISPU, Level Kualitas Udara, dan Rekomendasi Protokol Mitigasi Sekolah.',
    hints: [
      'Gunakan rata_rata = (pagi + siang + sore) / 3.',
      'Gunakan percabangan if-elif-else bertingkat sesuai ambang batas ISPU nasional.',
      'Cetak arahan yang jelas: misalnya jika "Tidak Sehat", larang olahraga di lapangan dan bagikan masker.',
    ],
    initialCode: '',
    testCases: [
      { input: '40\n45\n35', expected: 'Rata-rata: 40.0 -> Kategori: Baik. Kegiatan luar ruangan aman dilakukan.' },
      { input: '120\n150\n180', expected: 'Rata-rata: 150.0 -> Kategori: Tidak Sehat. Wajib masker & larang kegiatan luar.' },
      { input: '310\n320\n330', expected: 'Rata-rata: 320.0 -> Kategori: Berbahaya! Sekolah daring & aktifkan air purifier.' },
    ],
    points: 100,
  },
]

export const HOTS_CASE_STUDIES: ChallengeItem[] = [
  {
    id: 'hots-1',
    category: 'hots',
    level: 1,
    title: 'Studi Kasus HOTS: Tarif Listrik Progresif & Audit Subsidi Hijau',
    subtitle: 'Tingkat Kognitif C4 (Menganalisis) & C5 (Mengevaluasi Efisiensi Energi)',
    competency: 'Menganalisis struktur pembiayaan bertingkat (progressive tiering), menghitung subsidi bersyarat, serta merumuskan rekomendasi efisiensi energi.',
    story:
      'Laboratorium Komputer SMA sedang mengaudit pemakaian daya listrik. PLN Mini menerapkan tarif berjenjang per kWh:\n' +
      '• Golongan 1 (0 s/d 50 kWh): Rp1.200 per kWh\n' +
      '• Golongan 2 (51 s/d 150 kWh): Rp1.600 per kWh untuk kWh di atas 50\n' +
      '• Golongan 3 (> 150 kWh): Rp2.200 per kWh untuk kWh di atas 150\n' +
      '• Biaya Abodemen Beban Tetap: Rp25.000 untuk semua pelanggan.\n' +
      'INSENTIF HIJAU: Jika pemakaian total <= 80 kWh DAN ruangan tidak memiliki tunggakan denda (Tunggakan = 0), sekolah berhak atas Potongan Subsidi Hijau sebesar 15% dari total biaya sebelum pajak. Jika ada tunggakan, tidak ada subsidi dan dikenakan denda keterlambatan 5% dari biaya energi.',
    task:
      'Rancanglah program analitis yang membaca nama ruangan lab, jumlah kWh yang terpakai, dan status tunggakan (angka rupiah tunggakan). Hitung rincian pemakaian per golongan tier, biaya beban, subsidi atau denda, total tagihan akhir, serta saran efisiensi energi jika pemakaian berada di Golongan 3.',
    inputGuide: 'Baris 1: Nama Ruangan\nBaris 2: Pemakaian kWh (angka desimal/bulat)\nBaris 3: Nilai tunggakan (angka, 0 jika lunas)',
    outputGuide: 'Rincian perhitungan biaya tiap tier kWh, insentif subsidi / denda, total tagihan bersih, dan evaluasi efisiensi.',
    hints: [
      'Pecah pemakaian: tier1 = min(kwh, 50); sisa = max(0, kwh - 50); tier2 = min(sisa, 100); tier3 = max(0, sisa - 100).',
      'Hitung biaya_energi = (tier1 * 1200) + (tier2 * 1600) + (tier3 * 2200).',
      'Evaluasi kondisi insentif hijau: jika kwh <= 80 dan tunggakan == 0.',
    ],
    initialCode: '',
    testCases: [
      { input: 'Lab Komputer 1\n45\n0', expected: 'kWh Gol 1: Rp54.000 + Beban Rp25.000 = Rp79.000. Subsidi Hijau 15%: Hemat Rp11.850. Total: Rp67.150' },
      { input: 'Lab Multimedia\n180\n50000', expected: 'Tier 1: 50x1200 + Tier 2: 100x1600 + Tier 3: 30x2200. Denda 5%. Evaluasi: Boros energi!' },
    ],
    points: 100,
  },
  {
    id: 'hots-2',
    category: 'hots',
    level: 2,
    title: 'Studi Kasus HOTS: Algoritma Seleksi Multi-Kriteria Beasiswa Mandiri',
    subtitle: 'Tingkat Kognitif C5 (Mengevaluasi) & C6 (Menciptakan Model Keputusan)',
    competency: 'Mengevaluasi data multidimensi pelamar beasiswa dan merancang model skor bobot kelayakan transparan.',
    story:
      'Panitia beasiswa sekolah menyaring calon penerima dana pendidikan berprestasi. Kriteria seleksi:\n' +
      '1. Nilai Rapor (skala 0-100), bobot 40%.\n' +
      '2. Pendapatan Per Kapita Keluarga: (Penghasilan Orang Tua / Jumlah Anggota Keluarga). Jika <= Rp1.000.000 (bobot skor 100), jika Rp1.000.001 - Rp2.500.000 (bobot skor 70), jika > Rp2.500.000 (bobot skor 30). Bobot kriteria ini 35%.\n' +
      '3. Tingkat Prestasi (1 = Internasional [skor 100], 2 = Nasional [skor 85], 3 = Provinsi/Kota [skor 70], 4 = Tidak Ada [skor 40]), bobot 25%.\n' +
      'ATURAN KEPUTUSAN:\n' +
      '• Skor Akhir >= 80: "Lolos Kategori Beasiswa Penuh (100% SPP)"\n' +
      '• Skor Akhir 65 s/d 79: "Lolos Kategori Beasiswa Parsial (50% SPP)"\n' +
      '• Skor Akhir < 65: "Tidak Lolos Seleksi Beasiswa (Pertahankan Semangat Belajar)"\n' +
      'SYARAT MUTLAK: Jika Nilai Rapor di bawah 75, pelamar langsung dinyatakan "Gugur Syarat Akademik" tanpa melihat kriteria lain.',
    task:
      'Buatlah program sistem pendukung keputusan yang menerima data siswa, melakukan audit syarat mutlak, menghitung skor komposit berbobot, dan mengumumkan hasil seleksi beasiswa.',
    inputGuide: 'Baris 1: Nama Siswa\nBaris 2: Nilai Rapor (angka desimal/bulat)\nBaris 3: Penghasilan Orang Tua (Rp)\nBaris 4: Jumlah Anggota Keluarga\nBaris 5: Kode Prestasi (1/2/3/4)',
    outputGuide: 'Rincian skor per parameter, skor komposit akhir berbobot, dan surat keputusan status beasiswa.',
    hints: [
      'Periksa terlebih dahulu syarat mutlak: if nilai_rapor < 75: langsung tampilkan diskualifikasi.',
      'Hitung per_kapita = penghasilan / tanggungan lalu tentukan skor_ekonomi.',
      'Skor total = (0.40 * nilai_rapor) + (0.35 * skor_ekonomi) + (0.25 * skor_prestasi).',
    ],
    initialCode: '',
    testCases: [
      { input: 'Aisyah\n88\n3000000\n4\n2', expected: 'Per kapita: Rp750.000 (Skor 100), Prestasi Nasional (Skor 85). Skor Akhir: 86.45 -> Beasiswa Penuh' },
      { input: 'Bayu\n72\n1500000\n3\n3', expected: 'Gugur Syarat Akademik (Nilai Rapor < 75)' },
    ],
    points: 100,
  },
  {
    id: 'hots-3',
    category: 'hots',
    level: 3,
    title: 'Studi Kasus HOTS: Audit Bank Sampah Zero-Waste & Reduksi Jejak Karbon',
    subtitle: 'Tingkat Kognitif C5 (Mengevaluasi Data Lingkungan) & C6 (Sintesis Solusi Digital)',
    competency: 'Mengonversi kuantitas material daur ulang menjadi nilai konversi ekonomi, ekuivalen reduksi emisi CO2, dan klasifikasi keberlanjutan.',
    story:
      'Bank Sampah Hijau Sekolah mengelola 3 jenis limbah daur ulang: Plastik, Kertas, dan Logam Kaleng.\n' +
      'Data Parameter Konversi:\n' +
      '• Plastik: Rp3.500/kg | Reduksi Emisi: 1.5 kg CO2/kg | Poin Hijau: 10 poin/kg\n' +
      '• Kertas: Rp2.000/kg | Reduksi Emisi: 0.9 kg CO2/kg | Poin Hijau: 6 poin/kg\n' +
      '• Logam/Kaleng: Rp8.000/kg | Reduksi Emisi: 2.5 kg CO2/kg | Poin Hijau: 20 poin/kg\n' +
      'KUALIFIKASI PREDIKAT KELAS:\n' +
      'Jika Poin Hijau Total >= 250 DAN Reduksi Emisi CO2 >= 50 kg: Predikat "Kelas Adiwiyata Emas" (Bonus Saldo Kas Rp100.000).\n' +
      'Jika Poin Hijau Total >= 120: Predikat "Kelas Sahabat Lingkungan" (Bonus Saldo Kas Rp50.000).\n' +
      'Di bawah 120: Predikat "Kelas Sadar Sampah Pemula" (Belum berhak bonus kas).',
    task:
      'Rancang program audit lingkungan yang meminta nama kelas, lalu bobot (kg) untuk Plastik, Kertas, dan Logam. Hitung total nilai rupiah tabungan kelas, total Poin Hijau, total reduksi emisi CO2, predikat kehormatan, dan total saldo akhir beserta bonus kas.',
    inputGuide: 'Baris 1: Nama Kelas\nBaris 2: Berat Sampah Plastik (kg)\nBaris 3: Berat Sampah Kertas (kg)\nBaris 4: Berat Sampah Logam (kg)',
    outputGuide: 'Laporan neraca bank sampah, kalkulasi jejak karbon, predikat Adiwiyata, dan total saldo kas.',
    hints: [
      'Gunakan perkalian bobot dengan konstanta masing-masing jenis material.',
      'Jumlahkan poin dan emisi CO2 secara independen.',
      'Gunakan logika if-elif-else untuk menganalisis pemenuhan syarat Adiwiyata Emas.',
    ],
    initialCode: '',
    testCases: [
      { input: 'X-1\n15\n20\n5', expected: 'Nilai jual: Rp132.500, Poin: 370, Reduksi CO2: 53.0 kg -> Kelas Adiwiyata Emas (Bonus Rp100.000)' },
      { input: 'X-2\n5\n10\n1', expected: 'Nilai jual: Rp45.500, Poin: 110, Reduksi CO2: 19.0 kg -> Kelas Sadar Sampah Pemula' },
    ],
    points: 100,
  },
  {
    id: 'hots-4',
    category: 'hots',
    level: 4,
    title: 'Studi Kasus HOTS: Analisis Indeks Massa Tubuh (IMT) & Kebutuhan Kalori Harian (BMR)',
    subtitle: 'Tingkat Kognitif C4 (Dekomposisi Variabel Fisik) & C6 (Desain Rekomendasi Gizi)',
    competency: 'Mengimplementasikan rumus ilmiah IMT dan formula BMR Harris-Benedict untuk diagnosis kesehatan siswa.',
    story:
      'Unit Kesehatan Sekolah (UKS) mengembangkan aplikasi cerdas untuk skrining kesehatan fisik siswa kelas X.\n' +
      'RUMUS PERHITUNGAN:\n' +
      '1. IMT = Berat Badan (kg) / (Tinggi Badan (m) ** 2)\n' +
      '   Kategori IMT: < 18.5 (Berat Kurang), 18.5 - 22.9 (Normal Sehat), 23.0 - 24.9 (Kelebihan Berat / Overweight), >= 25.0 (Obesitas).\n' +
      '2. BMR (Basal Metabolic Rate) rumus Harris-Benedict revisi:\n' +
      '   • Laki-laki: BMR = 88.36 + (13.4 x berat) + (4.8 x tinggi_cm) - (5.7 x usia)\n' +
      '   • Perempuan: BMR = 447.6 + (9.25 x berat) + (3.1 x tinggi_cm) - (4.33 x usia)\n' +
      '3. Kebutuhan Kalori Total (TDEE) berdasarkan faktor aktivitas:\n' +
      '   • Tingkat 1 (Jarang olahraga): BMR x 1.2\n' +
      '   • Tingkat 2 (Olahraga sedang 3-5 hari/minggu): BMR x 1.55\n' +
      '   • Tingkat 3 (Aktif atlet sekolah): BMR x 1.725',
    task:
      'Susunlah program yang menerima nama siswa, jenis kelamin (L/P), berat badan (kg), tinggi badan (cm), usia (tahun), dan tingkat aktivitas (1/2/3). Hitung nilai IMT, tentukan status gizinya, hitung BMR dan kebutuhan kalori harian (TDEE), serta berikan anjuran asupan kalori (defisit 300 kkal jika obesitas, surplus 300 kkal jika kurus, atau seimbang jika normal).',
    inputGuide: 'Baris 1: Nama\nBaris 2: Gender (L/P)\nBaris 3: Berat (kg)\nBaris 4: Tinggi (cm)\nBaris 5: Usia (tahun)\nBaris 6: Aktivitas (1/2/3)',
    outputGuide: 'Hasil nilai IMT, Kategori Gizi, BMR (kkal), Kebutuhan Kalori Harian (kkal), dan Saran Diet Sehat.',
    hints: [
      'Ingat konversi tinggi badan ke meter untuk rumus IMT: tinggi_m = tinggi_cm / 100.',
      'Gunakan percabangan if gender.upper() == "L" untuk memilih formula BMR yang sesuai.',
      'Kalikan BMR dengan faktor pengali aktivitas 1.2, 1.55, atau 1.725.',
    ],
    initialCode: '',
    testCases: [
      { input: 'Farhan\nL\n65\n170\n16\n2', expected: 'IMT: 22.49 (Normal Sehat), BMR: ~1683 kkal, Kebutuhan Kalori: ~2609 kkal' },
      { input: 'Nadia\nP\n42\n155\n15\n1', expected: 'IMT: 17.48 (Berat Kurang), Disarankan surplus +300 kkal nutrisi bergizi' },
    ],
    points: 100,
  },
]

