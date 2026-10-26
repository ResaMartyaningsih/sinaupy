/**
 * Modul Data Pembelajaran Berbasis Penemuan (Discovery Learning) SinauPy
 * Mengimplementasikan 6 Sintaks Pembelajaran Penemuan:
 * 1. Stimulation (Pemberian Rangsangan & Pengamatan Fenomena)
 * 2. Problem Statement (Identifikasi Masalah & Prediksi/Hipotesis)
 * 3. Data Collection (Pengumpulan Data / Eksperimen Terarah di Compiler)
 * 4. Data Processing (Pengolahan Data, Tabel Komparasi, & Analisis Pola)
 * 5. Verification (Pembuktian Konsep, Uji Mandiri, & Penjelasan Ilmiah Terverifikasi)
 * 6. Generalization (Menarik Kesimpulan, Tantangan Transfer, & Refleksi Pembelajar)
 */

import type { MaterialTopic } from './materialsData'

export interface DiscoveryTrialStep {
  step: number
  title: string
  action: string
  codeToTry: string
  inputIfAny?: string
}

export interface ObservationRow {
  trialNumber: number
  codeVariation: string
  observedResult: string
  analysisPrompt: string
}

export interface TransferChallenge {
  title: string
  scenario: string
  task: string
  starterHint: string
  sampleInput?: string
  expectedOutput: string
}

export interface DiscoveryTopicData {
  // 1. Stimulation
  stimulationContext: string
  stimulationCode: string
  stimulationQuestions: string[]

  // 2. Problem Statement
  problemStatement: string
  predictionPrompt: string

  // 3. Data Collection
  experimentGuide: string
  trials: DiscoveryTrialStep[]

  // 4. Data Processing
  observationTable: ObservationRow[]
  reasoningQuestions: string[]

  // 5. Verification
  verificationQuiz: {
    question: string
    codeSnippet: string
    options: { text: string; isCorrect: boolean; feedback: string }[]
  }
  verifiedExplanation: string
  commonPitfalls: string[]

  // 6. Generalization
  goldenRule: string
  transferChallenge: TransferChallenge
  reflectionQuestions: string[]
}

// Map custom data per topik
const TOPIC_DISCOVERY_MAP: Record<string, Partial<DiscoveryTopicData>> = {
  'Pengenalan Python': {
    stimulationContext:
      'Bayangkan kamu baru pertama kali berkomunikasi dengan mesin komputer. Bagaimana cara membuat komputer menuliskan kalimat pertamamu ke layar?',
    stimulationCode: 'print("Halo, Dunia!")\nprint(10 + 25)\nprint("10 + 25")',
    stimulationQuestions: [
      'Mengapa baris kedua menghasilkan angka 35, sedangkan baris ketiga justru mencetak teks "10 + 25"?',
      'Apa fungsi tanda petik ganda ("...") di dalam tanda kurung print()?',
      'Apa yang terjadi jika tanda kurung pada print dihilangkan?',
    ],
    problemStatement:
      'Bagaimana aturan dasar kerja instruksi print() dalam membedakan teks literal dengan ekspresi perhitungan matematika?',
    predictionPrompt:
      'Menurut prediksimu, apa perbedaan perlakuan komputer terhadap sesuatu yang diapit tanda petik dengan yang tanpa tanda petik?',
    trials: [
      {
        step: 1,
        title: 'Mencetak Teks Literal',
        action: 'Ketik print("Saya belajar Python di SinauPy") lalu jalankan.',
        codeToTry: 'print("Saya belajar Python di SinauPy")',
      },
      {
        step: 2,
        title: 'Mencetak Operasi Aritmatika',
        action: 'Ubah teks menjadi perhitungan matematika tanpa tanda petik: print(50 * 2).',
        codeToTry: 'print(50 * 2)',
      },
      {
        step: 3,
        title: 'Mengamati Pesan Kesalahan (SyntaxError)',
        action: 'Hapus tanda kurung tutup: print("Halo" lalu amati apa yang dilaporkan oleh terminal.',
        codeToTry: 'print("Halo"',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'print("Saya belajar Python")',
        observedResult: 'Saya belajar Python',
        analysisPrompt: 'Teks di dalam petik dicetak apa adanya ke layar (string literal).',
      },
      {
        trialNumber: 2,
        codeVariation: 'print(50 * 2)',
        observedResult: '100',
        analysisPrompt: 'Komputer mengevaluasi operasi matematika terlebih dahulu sebelum mencetak nilainya.',
      },
      {
        trialNumber: 3,
        codeVariation: 'print("Halo" (tanpa kurung tutup)',
        observedResult: 'SyntaxError: was never closed',
        analysisPrompt: 'Python menolak eksekusi karena melanggar aturan tata bahasa (sintaks tanda kurung wajib berpasangan).',
      },
    ],
    reasoningQuestions: [
      'Berdasarkan 3 percobaan, kapan kita wajib menggunakan tanda petik dan kapan kita tidak menggunakannya?',
      'Bagaimana Python merespons jika kita melanggar kaidah penulisan sintaks?',
    ],
    verifiedExplanation:
      'Fungsi print() adalah fungsi bawaan (built-in function) standar Python untuk menampilkan data ke layar konsol terminal. Teks yang diapit tanda kutip ("..." atau \'...\') bertipe String dan dicetak apa adanya. Nilai tanpa tanda petik dianggap sebagai variabel atau ekspresi matematika yang dihitung terlebih dahulu nilainya oleh interpreter sebelum dicetak.',
    commonPitfalls: [
      'Lupa menutup tanda kurung atau tanda petik.',
      'Menulis Print() dengan huruf kapital P (Python bersifat case-sensitive).',
      'Mengira perintah print("5 + 5") akan menghasilkan 10.',
    ],
    goldenRule:
      'Perintah print() mengeksekusi apa pun di dalam kurungnya: teks diapit tanda petik, sedangkan angka dan perhitungan ditulis langsung tanpa petik.',
    transferChallenge: {
      title: 'Biodata Konsol Siswa',
      scenario: 'Pihak sekolah ingin membuat program sambutan yang mencetak nama siswa, kelas, dan umur 5 tahun mendatang.',
      task: 'Buat program yang mencetak "Nama: Resa", "Kelas: X-1", dan hasil umur 16 + 5 secara tepat menggunakan fungsi print().',
      starterHint: 'Gunakan tiga baris print(). Dua baris pertama untuk string, baris ketiga untuk perhitungan angka 16 + 5.',
      expectedOutput: 'Nama: Resa\nKelas: X-1\nUmur 5 tahun lagi: 21',
    },
  },

  'Variabel': {
    stimulationContext:
      'Dalam kehidupan nyata, kita sering menyimpan barang dalam kardus dan menempelkan label nama di luarnya. Jika isi kardus diganti, label luarnya tetap sama tetapi isinya telah berubah. Bagaimana hal ini bekerja di memori komputer?',
    stimulationCode: 'skor = 100\nprint("Skor awal:", skor)\nskor = 250\nprint("Skor baru:", skor)',
    stimulationQuestions: [
      'Mengapa saat perintah print(skor) kedua dijalankan, angka 100 tidak lagi muncul?',
      'Apakah variabel dapat menampung dua nilai yang berbeda secara bersamaan?',
      'Apa yang terjadi jika kita mencoba mencetak variabel yang belum pernah diberi nilai?',
    ],
    problemStatement:
      'Bagaimana mekanisme penyimpanan nilai di dalam variabel dan apa pengaruh proses penugasan ulang (re-assignment) terhadap nilai lama?',
    predictionPrompt:
      'Jika variabel nama = "Andi" kemudian di baris berikutnya ditulis nama = "Budi", apa yang akan dicetak oleh print(nama)?',
    trials: [
      {
        step: 1,
        title: 'Menugaskan Nilai Awal',
        action: 'Ketik nama = "Rani" lalu print(nama).',
        codeToTry: 'nama = "Rani"\nprint(nama)',
      },
      {
        step: 2,
        title: 'Menimpa Nilai (Re-assignment)',
        action: 'Tambahkan baris nama = "Doni" tepat sebelum print(nama).',
        codeToTry: 'nama = "Rani"\nnama = "Doni"\nprint(nama)',
      },
      {
        step: 3,
        title: 'Menggunakan Variabel dalam Perhitungan',
        action: 'Buat variabel harga = 5000, jumlah = 3, lalu print(harga * jumlah).',
        codeToTry: 'harga = 5000\njumlah = 3\ntotal = harga * jumlah\nprint("Total:", total)',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'nama = "Rani"',
        observedResult: 'Rani',
        analysisPrompt: 'Variabel nama menyimpan alamat memori dari teks "Rani".',
      },
      {
        trialNumber: 2,
        codeVariation: 'nama = "Rani" lalu nama = "Doni"',
        observedResult: 'Doni',
        analysisPrompt: 'Nilai lama digantikan sepenuhnya oleh nilai baru (overwritten).',
      },
      {
        trialNumber: 3,
        codeVariation: 'total = harga * jumlah',
        observedResult: 'Total: 15000',
        analysisPrompt: 'Variabel dapat dioperasikan secara matematis jika bertipe numerik.',
      },
    ],
    reasoningQuestions: [
      'Apa yang terjadi pada nilai sebelumnya ketika sebuah variabel diberi nilai baru?',
      'Mengapa penamaan variabel yang deskriptif (misal harga vs x) penting dalam menyusun program?',
    ],
    verifiedExplanation:
      'Variabel di Python adalah pengenal (identifier) yang merujuk pada objek di memori. Tanda sama dengan (=) disebut operator assignment (penugasan), bukan persamaan matematis. Saat baris dieksekusi, nilai di sisi kanan dievaluasi lalu disimpan ke variabel di sisi kiri. Jika variabel tersebut diberi nilai baru di baris berikutnya, variabel akan merujuk ke nilai baru tersebut.',
    commonPitfalls: [
      'Menulis angka di awal nama variabel (misal: 1nama = "Budi" akan memicu SyntaxError).',
      'Menggunakan spasi dalam nama variabel (gunakan underscore seperti nama_siswa).',
      'Membalik urutan assignment: 100 = nilai (seharusnya nilai = 100).',
    ],
    goldenRule:
      'Variabel adalah wadah data di memori. Nilai di sisi kanan operator (=) disimpan ke nama variabel di sisi kiri, dan nilai terbaru akan menimpa nilai lama.',
    transferChallenge: {
      title: 'Kalkulator Saldo Tabungan',
      scenario: 'Seorang siswa ingin mencatat saldo awal tabungan, uang jajan yang disisihkan, dan sisa saldo setelah membeli buku.',
      task: 'Buat variabel saldo_awal = 50000, setor = 20000, beli_buku = 35000. Hitung saldo_akhir dan cetak hasilnya dengan f-string yang rapi.',
      starterHint: 'saldo_akhir = saldo_awal + setor - beli_buku, lalu print dengan label yang jelas.',
      expectedOutput: 'Sisa saldo tabungan: Rp35000',
    },
  },

  'Menampilkan dan Menerima Input (`print()` dan `input()`)': {
    stimulationContext:
      'Semua aplikasi modern (Instagram, game, portal sekolah) bersifat interaktif. Program tidak hanya mencetak nilai mati, melainkan menerima data langsung dari pengguna.',
    stimulationCode: 'nama = input("Siapa namamu? ")\nprint("Halo", nama)\numur = input("Berapa umurmu? ")\nprint("Tahun depan umurmu:", umur + 1)',
    stimulationQuestions: [
      'Jika kode di atas dijalankan dan kamu memasukkan umur 16, mengapa baris terakhir justru memicu TypeError?',
      'Tipe data apa yang sebenarnya dihasilkan oleh fungsi input() secara bawaan?',
      'Bagaimana cara mengubah masukan pengguna agar dapat dijumlahkan dengan angka?',
    ],
    problemStatement:
      'Mengapa data dari input() tidak dapat langsung dioperasikan secara matematika dan bagaimana menghubungkan masukan teks dengan konversi tipe data?',
    predictionPrompt:
      'Menurutmu, jika pengguna mengetik angka 10 pada input(), apakah Python menganggapnya sebagai bilangan (integer) atau sebagai teks ("10")?',
    trials: [
      {
        step: 1,
        title: 'Menerima Input Teks',
        action: 'Ketik nama = input("Nama: ") lalu print("Selamat datang,", nama).',
        codeToTry: 'nama = input("Nama: ")\nprint("Selamat datang,", nama)',
        inputIfAny: 'Andi',
      },
      {
        step: 2,
        title: 'Menguji Operasi Angka dari input() Langsung',
        action: 'Coba jumlahkan dua input angka tanpa konversi: a = input() dan b = input(), lalu print(a + b).',
        codeToTry: 'a = input("Angka 1: ")\nb = input("Angka 2: ")\nprint("Hasil a + b:", a + b)',
        inputIfAny: '5\n5',
      },
      {
        step: 3,
        title: 'Mengonversi Input dengan int()',
        action: 'Bungkus input() dengan int() agar dikonversi ke bilangan bulat: x = int(input()).',
        codeToTry: 'x = int(input("Angka 1: "))\ny = int(input("Angka 2: "))\nprint("Hasil penjumlahan riil:", x + y)',
        inputIfAny: '5\n5',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'input("Nama: ")',
        observedResult: 'Selamat datang, Andi',
        analysisPrompt: 'input() menghentikan eksekusi sementara untuk menunggu pengguna mengetik di terminal dan menekan Enter.',
      },
      {
        trialNumber: 2,
        codeVariation: 'input("5") + input("5")',
        observedResult: 'Hasil a + b: 55',
        analysisPrompt: 'Tanda + pada teks (string) berfungsi menggabungkan kata (concatenation), bukan menjumlahkan angka matematis.',
      },
      {
        trialNumber: 3,
        codeVariation: 'int(input()) + int(input())',
        observedResult: 'Hasil penjumlahan riil: 10',
        analysisPrompt: 'Fungsi int() mengubah teks menjadi angka integer murni sehingga operasi penjumlahan berhasil.',
      },
    ],
    reasoningQuestions: [
      'Mengapa keluaran pada Percobaan 2 adalah "55" bukan 10?',
      'Kapan kita wajib menggunakan fungsi int() atau float() saat menerima input dari pengguna?',
    ],
    verifiedExplanation:
      'Fungsi input(prompt) selalu mengembalikan data dalam tipe String (teks), meskipun pengguna mengetik angka. Operator tambah (+) pada string melakukan penggabungan (string concatenation: "5" + "5" = "55"). Agar dapat dihitung secara matematis, teks angka tersebut harus dikonversi terlebih dahulu menggunakan fungsi type casting seperti int() untuk bilangan bulat atau float() untuk angka desimal.',
    commonPitfalls: [
      'Lupa mengonversi input angka sebelum melakukan operasi aritmatika (+, -, *, /).',
      'Memasukkan huruf ke dalam fungsi int(input()) sehingga menimbulkan ValueError.',
      'Menulis prompt input tanpa spasi di akhir sehingga teks ketikan pengguna menempel ke pertanyaan.',
    ],
    goldenRule:
      'Hasil pembacaan input() selalu berupa teks (string). Gunakan int(input()) atau float(input()) jika data tersebut akan digunakan dalam kalkulasi angka.',
    transferChallenge: {
      title: 'Program Kasir Fotokopi Sekolah',
      scenario: 'Koperasi sekolah melayani fotokopi lembar tugas dengan tarif Rp250 per lembar.',
      task: 'Buat program yang meminta nama pemesan dan jumlah lembar fotokopi melalui input(), lalu hitung dan cetak total tagihan yang harus dibayar.',
      starterHint: 'nama = input("Nama: "), lembar = int(input("Jumlah lembar: ")), total = lembar * 250.',
      expectedOutput: 'Tagihan fotokopi Budi: Rp25000',
    },
  },

  'Percabangan `if`, `elif`, dan `else`': {
    stimulationContext:
      'Komputer cerdas bukan karena bisa menghitung cepat, tetapi karena mampu mengambil keputusan berbeda berdasarkan kondisi yang ditemui (seperti lampu lalu lintas atau portal parkir otomatis).',
    stimulationCode: 'nilai = 70\nif nilai >= 75:\n    print("Tuntas KKM")\nelse:\n    print("Remedial")',
    stimulationQuestions: [
      'Mengapa hanya teks "Remedial" yang tercetak dan bukan kedua-duanya?',
      'Apa yang terjadi jika nilai diganti menjadi 85?',
      'Bagaimana jika ada tingkatan nilai lebih dari dua (misal Predikat A, B, C, D)?',
    ],
    problemStatement:
      'Bagaimana cara kerja evaluasi kondisi boolean (True/False) dalam menentukan blok kode mana yang akan dieksekusi oleh Python?',
    predictionPrompt:
      'Menurutmu, jika kondisi if bernilai True, apakah blok else akan tetap diperiksa atau langsung diabaikan oleh Python?',
    trials: [
      {
        step: 1,
        title: 'Menguji Kondisi Terpenuhi (True)',
        action: 'Jalankan kode dengan nilai = 80.',
        codeToTry: 'nilai = 80\nif nilai >= 75:\n    print("Lulus")\nelse:\n    print("Tidak Lulus")',
      },
      {
        step: 2,
        title: 'Menguji Kondisi Tidak Terpenuhi (False)',
        action: 'Ubah nilai menjadi 65 lalu amati perpindahan alur eksekusi.',
        codeToTry: 'nilai = 65\nif nilai >= 75:\n    print("Lulus")\nelse:\n    print("Tidak Lulus")',
      },
      {
        step: 3,
        title: 'Menguji Percabangan Majemuk (elif)',
        action: 'Tambahkan elif untuk memberikan predikat bertingkat.',
        codeToTry: 'nilai = 88\nif nilai >= 85:\n    print("Predikat A")\nelif nilai >= 75:\n    print("Predikat B")\nelse:\n    print("Predikat C")',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'nilai = 80 (>= 75 bernilai True)',
        observedResult: 'Lulus',
        analysisPrompt: 'Blok di dalam if dieksekusi, blok else dilewati sepenuhnya.',
      },
      {
        trialNumber: 2,
        codeVariation: 'nilai = 65 (>= 75 bernilai False)',
        observedResult: 'Tidak Lulus',
        analysisPrompt: 'Blok if dilewati, Python melompat ke blok alternatif else.',
      },
      {
        trialNumber: 3,
        codeVariation: 'if >= 85 elif >= 75 else',
        observedResult: 'Predikat A',
        analysisPrompt: 'Kondisi diuji dari atas ke bawah; ketika satu kondisi terpenuhi, cabang lain diabaikan.',
      },
    ],
    reasoningQuestions: [
      'Apa yang menjadi syarat agar perintah di dalam blok if dieksekusi?',
      'Mengapa urutan penulisan kondisi elif dari yang terbesar ke yang terkecil sangat penting?',
    ],
    verifiedExplanation:
      'Struktur kontrol percabangan menguji ekspresi logika bernilai Boolean (True atau False). Jika ekspresi if bernilai True, blok perintah berindentasi di bawahnya langsung dijalankan dan seluruh cabang elif/else setelahnya dilewati. Jika False, program mengecek kondisi elif berikutnya, dan jika semua salah maka blok else akan dijalankan sebagai opsi default terakhir.',
    commonPitfalls: [
      'Lupa menulis tanda titik dua (:) di akhir baris if, elif, atau else.',
      'Lupa memberikan indentasi (4 spasi) pada baris yang merupakan isi dari blok.',
      'Menggunakan satu tanda sama dengan (=) untuk membandingkan alih-alih dua tanda sama dengan (==).',
    ],
    goldenRule:
      'Percabangan mengevaluasi kondisi secara berurutan dari atas ke bawah. Blok yang dieksekusi hanyalah blok pertama yang kondisinya bernilai True.',
    transferChallenge: {
      title: 'Sistem Deteksi Suhu Tubuh UKS',
      scenario: 'UKS sekolah memasang termometer digital otomatis. Suhu normal: 36.0 s/d 37.5°C. Suhu demam: di atas 37.5°C. Hipotermia: di bawah 36.0°C.',
      task: 'Buat program yang menerima input suhu badan (float), lalu cetak status kesehatan siswa sesuai kriteria UKS.',
      starterHint: 'suhu = float(input("Suhu: ")). Gunakan if suhu > 37.5: ... elif suhu >= 36.0: ... else: ...',
      expectedOutput: 'Status: Suhu Normal (Aman beraktivitas)',
    },
  },

  'Perulangan `for`': {
    stimulationContext:
      'Bayangkan kamu diminta mencetak angka 1 sampai 100. Apakah kamu harus mengetik perintah print() sebanyak 100 kali?',
    stimulationCode: 'for i in range(5):\n    print("Iterasi ke-", i)',
    stimulationQuestions: [
      'Mengapa angka yang tercetak dimulai dari 0 dan berakhir di 4, bukan di 5?',
      'Bagaimana cara membuat perulangan berjalan mulai dari 1 sampai 5?',
      'Apa fungsi dari variabel i di dalam perulangan for?',
    ],
    problemStatement:
      'Bagaimana cara kerja generator range() dalam mengatur nilai awal, batas akhir, dan langkah (step) pada perulangan for?',
    predictionPrompt:
      'Menurut prediksimu, jika kita menulis range(1, 10, 2), angka-angka apa saja yang akan dicetak oleh loop?',
    trials: [
      {
        step: 1,
        title: 'Menguji range() Satu Parameter',
        action: 'Jalankan for i in range(4): print(i).',
        codeToTry: 'for i in range(4):\n    print("Nilai:", i)',
      },
      {
        step: 2,
        title: 'Menentukan Batas Awal dan Batas Akhir',
        action: 'Ubah menjadi range(1, 6) untuk mencetak 1 sampai 5.',
        codeToTry: 'for i in range(1, 6):\n    print("Urutan:", i)',
      },
      {
        step: 3,
        title: 'Menambahkan Langkah Lompatan (Step)',
        action: 'Gunakan 3 parameter range(2, 11, 2) untuk mencetak bilangan genap.',
        codeToTry: 'for genap in range(2, 11, 2):\n    print("Bilangan genap:", genap)',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'range(4)',
        observedResult: '0, 1, 2, 3',
        analysisPrompt: 'Satu parameter menentukan jumlah perulangan, selalu dimulai dari 0 hingga (batas - 1).',
      },
      {
        trialNumber: 2,
        codeVariation: 'range(1, 6)',
        observedResult: '1, 2, 3, 4, 5',
        analysisPrompt: 'Dua parameter menentukan (awal, akhir). Nilai akhir bersifat eksklusif (tidak diikutsertakan).',
      },
      {
        trialNumber: 3,
        codeVariation: 'range(2, 11, 2)',
        observedResult: '2, 4, 6, 8, 10',
        analysisPrompt: 'Parameter ketiga adalah step (kelipatan kenaikan nilai di setiap putaran).',
      },
    ],
    reasoningQuestions: [
      'Mengapa nilai batas akhir pada range(a, b) tidak pernah diikutsertakan oleh Python?',
      'Bagaimana cara membuat perulangan yang menghitung mundur (misal 5, 4, 3, 2, 1)?',
    ],
    verifiedExplanation:
      'Perulangan for di Python digunakan untuk mengulang sekumpulan instruksi sebanyak urutan yang ditentukan atau melintasi elemen koleksi data. Fungsi range(stop) menghasilkan deret angka mulai dari 0 hingga stop - 1. Fungsi range(start, stop, step) memungkinkan penentuan nilai awal, batas akhir eksklusif, serta interval kenaikan/penurunan nilai.',
    commonPitfalls: [
      'Mengira range(1, 5) akan menghasilkan angka 1 sampai 5 (sebenarnya berhenti di 4).',
      'Lupa indentasi pada baris kode yang ingin diulang di dalam blok for.',
      'Mengubah nilai variabel pencacah (i) secara manual di dalam badan loop.',
    ],
    goldenRule:
      'Perulangan for mengeksekusi blok kode sebanyak elemen yang disediakan. Fungsi range(start, stop, step) menghasilkan barisan angka dengan batas akhir yang bersifat eksklusif (tidak ikut dicetak).',
    transferChallenge: {
      title: 'Penghitung Roket Hitung Mundur',
      scenario: 'Pusat sains sekolah mengadakan peluncuran roket air dan membutuhkan hitung mundur dari 10 sampai 1 lalu meneriakkan "Meluncur!".',
      task: 'Buat program perulangan for dengan range() berparameter negatif yang mencetak angka 10 hingga 1 menurun, lalu cetak "Roket Meluncur!".',
      starterHint: 'Gunakan range(10, 0, -1) untuk menghasilkan hitungan mundur.',
      expectedOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nRoket Meluncur!',
    },
  },

  'List': {
    stimulationContext:
      'Bagaimana jika kamu harus mencatat nilai ujian dari 36 siswa di kelas? Apakah kamu akan membuat 36 variabel berbeda seperti nilai1, nilai2, ... nilai36?',
    stimulationCode: 'nilai = [80, 95, 75, 90]\nprint(nilai[0])\nprint(nilai[3])\nprint(len(nilai))',
    stimulationQuestions: [
      'Mengapa indeks pertama nilai[0] bernilai 80, bukan nilai[1]?',
      'Bagaimana cara menambahkan data siswa baru ke dalam list tersebut?',
      'Apa yang terjadi jika kita memanggil indeks yang melebihi jumlah elemen (misal nilai[10])?',
    ],
    problemStatement:
      'Bagaimana konsep indeks berbasis nol (zero-based indexing) dan sifat dinamis (mutable) pada struktur data List di Python?',
    predictionPrompt:
      'Jika sebuah list memiliki 4 elemen, berapakah nomor indeks untuk elemen terakhirnya?',
    trials: [
      {
        step: 1,
        title: 'Membuat dan Mengakses List',
        action: 'Ketik buah = ["Apel", "Jeruk", "Mangga"] lalu print(buah[0]).',
        codeToTry: 'buah = ["Apel", "Jeruk", "Mangga"]\nprint("Elemen pertama:", buah[0])',
      },
      {
        step: 2,
        title: 'Menambahkan Elemen dengan append()',
        action: 'Gunakan method append() untuk memasukkan "Pisang" ke akhir list.',
        codeToTry: 'buah = ["Apel", "Jeruk", "Mangga"]\nbuah.append("Pisang")\nprint("List setelah append:", buah)',
      },
      {
        step: 3,
        title: 'Mengamati IndexError',
        action: 'Coba panggil buah[10] dan amati pesan yang muncul di terminal.',
        codeToTry: 'buah = ["Apel", "Jeruk", "Mangga"]\nprint(buah[10])',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'buah[0]',
        observedResult: 'Apel',
        analysisPrompt: 'Indeks di Python dimulai dari angka 0, bukan 1.',
      },
      {
        trialNumber: 2,
        codeVariation: 'buah.append("Pisang")',
        observedResult: '[\'Apel\', \'Jeruk\', \'Mangga\', \'Pisang\']',
        analysisPrompt: 'List bersifat dinamis (mutable), ukurannya dapat bertambah secara fleksibel saat program berjalan.',
      },
      {
        trialNumber: 3,
        codeVariation: 'buah[10]',
        observedResult: 'IndexError: list index out of range',
        analysisPrompt: 'Python memicu error jika program mencoba mengakses nomor indeks yang berada di luar batas panjang list.',
      },
    ],
    reasoningQuestions: [
      'Mengapa indeks dalam struktur data pemrograman dimulai dari nol (0)?',
      'Apa keunggulan menggunakan satu variabel List dibandingkan membuat puluhan variabel tunggal?',
    ],
    verifiedExplanation:
      'List adalah struktur data koleksi berurutan yang dapat menyimpan berbagai jenis data. Elemen dalam list diapit oleh tanda kurung siku [...] dan dipisahkan dengan tanda koma. Setiap elemen memiliki nomor posisi (indeks) berbasis nol (zero-based indexing). List bersifat mutable, artinya elemen di dalamnya dapat ditambah (.append()), diubah (list[i] = baru), atau dihapus (.remove() / del).',
    commonPitfalls: [
      'Mengira elemen pertama berada pada indeks 1 (mengakibatkan salah ambil data atau off-by-one error).',
      'Mengakses indeks di luar jangkauan (IndexError).',
      'Lupa menulis tanda kurung siku saat mendefinisikan list.',
    ],
    goldenRule:
      'List menyimpan banyak nilai dalam satu variabel terurut. Akses elemen menggunakan indeks mulai dari 0, dan gunakan .append() untuk menambah data baru.',
    transferChallenge: {
      title: 'Inventaris Peralatan Komputer Lab',
      scenario: 'Penanggung jawab lab komputer ingin mendata perangkat input/output yang tersedia dan mencatat total item terdaftar.',
      task: 'Buat list perangkat = ["Monitor", "Keyboard", "Mouse"]. Tambahkan "Headset" menggunakan append(), lalu cetak seluruh isi list dan total jumlah barangnya menggunakan len().',
      starterHint: 'Gunakan perangkat.append("Headset") lalu print(len(perangkat)).',
      expectedOutput: 'Daftar perangkat: [\'Monitor\', \'Keyboard\', \'Mouse\', \'Headset\']\nTotal item: 4 unit',
    },
  },
}

// Fallback generator pedagogis otomatis untuk topik yang belum memiliki pemetaan khusus
export function getDiscoveryForTopic(topic: MaterialTopic): DiscoveryTopicData {
  const custom = TOPIC_DISCOVERY_MAP[topic.title]
  const firstExample = topic.examples[0]
  const sampleCode = firstExample?.code || 'print("Belajar Python")'
  const sampleOutput = firstExample?.output.join('\n') || 'Output berhasil'

  const defaultData: DiscoveryTopicData = {
    stimulationContext: `Pada topik "${topic.title}", kita akan menyelidiki bagaimana Python memproses konsep ini untuk menyelesaikan kebutuhan komputasi nyata.`,
    stimulationCode: sampleCode,
    stimulationQuestions: [
      `Bagaimana alur kerja instruksi pada kode di atas menurut pengamatan awalmu?`,
      `Apa bagian terpenting dari sintaks tersebut yang menentukan hasil keluarannya?`,
      `Apa yang terjadi jika salah satu nilai atau parameter dalam kode diubah?`,
    ],
    problemStatement: `Bagaimana cara kerja, aturan sintaks, dan dampak perubahan nilai pada konsep ${topic.title}?`,
    predictionPrompt: `Sebelum menjalankan kode di compiler, tuliskan analisismu mengenai apa fungsi utama dari konsep ${topic.title} ini:`,
    experimentGuide: `Buka Online Python Compiler di bawah. Ketik baris kode terarah secara mandiri tanpa copy-paste untuk merasakan alur eksekusi sintaks.`,
    trials: [
      {
        step: 1,
        title: 'Pengujian Nilai Standar',
        action: `Ketik dan jalankan kode dasar materi untuk mengamati keluaran awalnya.`,
        codeToTry: sampleCode,
        inputIfAny: firstExample?.inputSample,
      },
      {
        step: 2,
        title: 'Eksperimen Modifikasi Parameter',
        action: `Ubah salah satu nilai variabel atau argumen dalam program, lalu jalankan kembali untuk membandingkan output.`,
        codeToTry: sampleCode.replace(/([0-9]+|"[\w\s]+")/, (m) => (m.startsWith('"') ? '"Eksperimen"' : '99')),
      },
      {
        step: 3,
        title: 'Pengujian Kondisi Batas',
        action: `Uji perilaku program dengan input atau nilai yang berbeda untuk memastikan batas kerja konsep.`,
        codeToTry: topic.exercise.length > 5 ? topic.answerCode : sampleCode,
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'Kode Awal Standar',
        observedResult: sampleOutput,
        analysisPrompt: 'Program berjalan sesuai alur dasar konsep.',
      },
      {
        trialNumber: 2,
        codeVariation: 'Modifikasi Parameter/Variabel',
        observedResult: 'Keluaran berubah sesuai nilai parameter baru',
        analysisPrompt: 'Perubahan parameter secara langsung mengubah luaran atau logika pemrosesan.',
      },
      {
        trialNumber: 3,
        codeVariation: 'Pengujian Kasus Lanjutan',
        observedResult: 'Program menghasilkan evaluasi kasus baru',
        analysisPrompt: 'Konsep terbukti konsisten pada berbagai variasi skenario.',
      },
    ],
    reasoningQuestions: [
      `Perbedaan apa yang paling mencolok antara percobaan awal dengan percobaan modifikasi?`,
      `Bagian sintaks mana yang paling krusial untuk diperhatikan agar tidak terjadi error?`,
    ],
    verificationQuiz: {
      question: `Berdasarkan hasil eksperimenmu, apa kesimpulan paling tepat mengenai aturan kerja ${topic.title}?`,
      codeSnippet: sampleCode,
      options: [
        {
          text: `Konsep ini memproses data baris demi baris sesuai aturan sintaks Python.`,
          isCorrect: true,
          feedback: `Tepat sekali! Pola yang kamu temukan melalui percobaan sudah sesuai dengan kaidah resmi bahasa Python.`,
        },
        {
          text: `Program mengabaikan parameter dan selalu menghasilkan keluaran acak.`,
          isCorrect: false,
          feedback: `Belum tepat. Python bersifat deterministik, hasil keluaran sepenuhnya ditentukan oleh sintaks dan data input.`,
        },
        {
          text: `Konsep ini hanya bisa bekerja jika seluruh baris kode tidak memiliki variabel.`,
          isCorrect: false,
          feedback: `Belum tepat. Variabel justru merupakan pendukung utama dalam pemrosesan dinamis.`,
        },
      ],
    },
    verifiedExplanation: topic.explanation,
    commonPitfalls: [
      'Kesalahan penulisan huruf besar/kecil (case sensitivity).',
      'Kesalahan indentasi atau kurung yang tidak lengkap.',
      'Ketidaksesuaian tipe data pada saat operasi.',
    ],
    goldenRule: `Kaidah Kunci ${topic.title}: Pahami aturan penulisan sintaks, pastikan tipe data sesuai, dan perhatikan urutan baris eksekusi kode.`,
    transferChallenge: {
      title: `Tantangan Transfer: ${topic.title}`,
      scenario: `Terapkan konsep yang baru saja kamu temukan pada skenario pemecahan masalah baru di bawah ini.`,
      task: topic.exercise,
      starterHint: `Ingat kembali pola yang kamu temukan pada tahap eksperimen dan verifikasi.`,
      expectedOutput: topic.answerExplanation,
    },
    reflectionQuestions: [
      'Konsep penting apa yang berhasil saya pahami melalui rangkaian percobaan ini?',
      'Percobaan atau tahapan mana yang paling membantu saya menemukan aturan kerja konsep ini?',
      'Kendala sintaks apa yang sempat saya alami dan bagaimana cara saya memperbaikinya?',
    ],
  }

  if (!custom) return defaultData

  return {
    ...defaultData,
    ...custom,
    trials: custom.trials || defaultData.trials,
    observationTable: custom.observationTable || defaultData.observationTable,
    transferChallenge: custom.transferChallenge || defaultData.transferChallenge,
  }
}

// ============================================================================
// DATA PEMBELAJARAN PENEMUAN PADA LEVEL 1 MATERI POKOK (KATEGORI / BAB UTUH)
// ============================================================================
const CATEGORY_DISCOVERY_MAP: Record<string, DiscoveryTopicData> = {
  'A. Dasar-Dasar Python': {
    stimulationContext:
      'Perhatikan bagaimana Python berinteraksi dengan tipe data dan masukan pengguna. Mengapa operasi penjumlahan dua angka bisa menghasilkan angka 20, namun di saat lain menghasilkan teks "1010"?',
    stimulationCode: `# Eksperimen Sintaks Dasar & Interaksi Tipe Data
a = "10"
b = "10"
print("Hasil 1:", a + b)

x = int(a)
y = int(b)
print("Hasil 2:", x + y)

nama = "Budi"
print(f"Halo {nama}, selamat datang!")`,
    stimulationQuestions: [
      'Mengapa "10" + "10" menghasilkan "1010", sedangkan 10 + 10 menghasilkan 20?',
      'Apa yang dilakukan fungsi int() terhadap variabel a dan b?',
      'Bagaimana cara f-string menggabungkan teks dengan nilai variabel secara ringkas?',
    ],
    problemStatement:
      'Bagaimana aturan dasar Python dalam mengenali tipe data (string, integer, float), melakukan konversi input, dan memformat teks keluaran secara tepat?',
    predictionPrompt:
      'Tuliskan hipotesismu: Mengapa penting mengonversi masukan dari input() sebelum melakukan operasi aritmetika?',
    experimentGuide:
      'Jalankan 3 langkah uji coba di bawah ini pada Online Compiler untuk membuktikan bagaimana Python memperlakukan tipe data yang berbeda.',
    trials: [
      {
        step: 1,
        title: 'Uji Coba Penggabungan Teks (String Concatenation)',
        action: 'Ketik teks = "Nilai: " + "100" lalu cetak. Amati tanda kutip ganda.',
        codeToTry: 'teks = "Nilai: " + "100"\nprint(teks)',
      },
      {
        step: 2,
        title: 'Uji Coba Penjumlahan Matematika dengan int()',
        action: 'Ubah teks angka menjadi integer menggunakan int() sebelum dijumlahkan.',
        codeToTry: 'angka1 = int("25")\nangka2 = int("75")\nprint("Total:", angka1 + angka2)',
      },
      {
        step: 3,
        title: 'Uji Coba Format f-string Dinamis',
        action: 'Gabungkan teks, nama, dan hasil perhitungan dalam satu baris f-string.',
        codeToTry: 'barang = "Buku Tulis"\nharga = 5000\njumlah = 3\nprint(f"Beli {jumlah}x {barang} = Rp{harga * jumlah:,}")',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: '"10" + "10"',
        observedResult: '"1010" (Teks Digabungkan)',
        analysisPrompt: 'Operator + pada tipe string berfungsi menyambung teks, bukan menjumlahkan nilai angka.',
      },
      {
        trialNumber: 2,
        codeVariation: 'int("25") + int("75")',
        observedResult: '100 (Penjumlahan Matematis)',
        analysisPrompt: 'Fungsi int() mengubah karakter string menjadi angka bulat sehingga dapat dihitung secara aritmetis.',
      },
      {
        trialNumber: 3,
        codeVariation: 'f"Beli {jumlah}x = Rp{harga*jumlah:,}"',
        observedResult: 'Beli 3x = Rp15,000',
        analysisPrompt: 'f-string secara otomatis mengevaluasi ekspresi matematika di dalam { } dan memformat hasilnya ke dalam teks.',
      },
    ],
    reasoningQuestions: [
      'Apa yang terjadi jika kita mencoba menjumlahkan string dengan integer secara langsung tanpa konversi (contoh: "Nilai: " + 100)?',
      'Kapan kita harus menggunakan float() dan kapan cukup menggunakan int()?',
    ],
    verificationQuiz: {
      question: 'Jika seorang siswa mengetik input usia = input("Usia: ") dan memasukkan angka 16, apa tipe data variabel usia tersebut?',
      codeSnippet: 'usia = input("Usia: ")\nprint(type(usia).__name__)',
      options: [
        {
          text: 'str (String) — karena fungsi input() selalu mengembalikan teks',
          isCorrect: true,
          feedback: 'Tepat sekali! Seluruh nilai yang dibaca oleh fungsi input() di Python selalu bertipe string, meskipun pengguna mengetik angka.',
        },
        {
          text: 'int (Integer) — karena pengguna mengetik angka tanpa tanda petik',
          isCorrect: false,
          feedback: 'Belum tepat. Python tidak otomatis mengubah teks input menjadi angka; pemrogram wajib memanggil int() atau float() secara eksplisit.',
        },
        {
          text: 'bool (Boolean) — karena memeriksa kebenaran angka',
          isCorrect: false,
          feedback: 'Belum tepat. Boolean hanya bernilai True atau False.',
        },
      ],
    },
    verifiedExplanation:
      'Kaidah Resmi Dasar Python: Python adalah bahasa pemrograman bertipe dinamis (dynamically typed) namun strongly typed. Artinya, Python tidak akan otomatis mengonversi tipe data saat operasi yang tidak kompatibel dilakukan (misal menjumlahkan string dengan integer memicu TypeError). Seluruh masukan dari keyboard melalui input() selalu menghasilkan string. Oleh karena itu, konversi eksplisit dengan int() atau float() wajib dilakukan untuk kalkulasi matematis. F-string (formatted string literal) adalah standar modern Python 3.6+ untuk interpolasi variabel ke dalam teks dengan efisien.',
    commonPitfalls: [
      'TypeError: can only concatenate str (not "int") to str — terjadi saat menggabungkan string dan angka dengan operator +.',
      'ValueError: invalid literal for int() — terjadi jika mencoba mengonversi teks non-angka seperti int("halo").',
      'Lupa menulis huruf f sebelum tanda kutip pada f-string, sehingga kurung kurawal {variabel} tidak tergantikan.',
    ],
    goldenRule:
      'Prinsip Emas Dasar Python: Selalu konversi teks masukan input() dengan int() atau float() sebelum dihitung, dan gunakan f-string untuk menampilkan output yang rapi dan profesional.',
    transferChallenge: {
      title: 'Tantangan Transfer: Kalkulator Pembelian Tiket Kereta',
      scenario: 'Stasiun sekolah ingin membuat program terminal tiket otomatis yang meminta nama penumpang, jumlah tiket, dan harga satuan, lalu mencetak total biaya.',
      task: 'Buat program yang membaca nama penumpang, jumlah tiket (int), dan harga tiket (int). Hitung total biaya lalu cetak dengan format: "Tiket atas nama [nama]: [jumlah] lembar = Total Rp[total]".',
      starterHint: 'Gunakan nama = input(), jumlah = int(input()), harga = int(input()), dan f-string untuk output.',
      expectedOutput: 'Tiket atas nama Budi: 2 lembar = Total Rp50,000',
    },
    reflectionQuestions: [
      'Bagaimana pemahaman tentang tipe data membantumu merancang program yang bebas dari bug konversi?',
      'Apa keunggulan f-string dibandingkan penggabungan string lama menggunakan tanda koma atau operator plus?',
      'Kesalahan sintaks apa yang sempat kamu temukan saat bereksperimen dengan input dan bagaimana kamu menyelesaikannya?',
    ],
  },

  'B. Alur Program': {
    stimulationContext:
      'Sebuah program komputer tidak hanya berjalan lurus dari atas ke bawah. Program cerdas mampu mengambil keputusan dan mengulang tugas ribuan kali dalam sekejap.',
    stimulationCode: `# Eksperimen Struktur Kontrol Alur
nilai = 85
if nilai >= 90:
    print("Predikat A")
elif nilai >= 75:
    print("Predikat B")
else:
    print("Predikat C")

total = 0
for i in range(1, 4):
    total += i
print("Total Akumulasi:", total)`,
    stimulationQuestions: [
      'Mengapa baris `print("Predikat A")` dilewati oleh Python saat nilai = 85?',
      'Bagaimana urutan kerja range(1, 4)? Apakah angka 4 ikut dihitung?',
      'Apa peran indentasi (spasi menjorok) dalam menentukan blok kode di Python?',
    ],
    problemStatement:
      'Bagaimana cara kerja percabangan logika if-elif-else, perulangan for/while, dan fungsi berparameter dalam mengendalikan alur eksekusi program secara presisi?',
    predictionPrompt:
      'Menurut prediksimu, apa yang terjadi jika indentasi di dalam blok if dihilangkan oleh pemrogram?',
    experimentGuide:
      'Buka Online Compiler di bawah. Uji bagaimana kondisi logika dan batasan range mempengaruhi jalannya program.',
    trials: [
      {
        step: 1,
        title: 'Uji Percabangan Multi-Kondisi',
        action: 'Ubah nilai menjadi 65 dan amati cabang mana yang dieksekusi.',
        codeToTry: 'nilai = 65\nif nilai >= 75:\n    print("Tuntas")\nelse:\n    print("Remedial")',
      },
      {
        step: 2,
        title: 'Uji Batas range() pada Perulangan For',
        action: 'Uji perulangan range(2, 8, 2) untuk mengamati nilai awal, akhir, dan langkah (step).',
        codeToTry: 'for x in range(2, 8, 2):\n    print("Iterasi:", x)',
      },
      {
        step: 3,
        title: 'Uji Fungsi dengan Nilai Kembalian (return)',
        action: 'Buat fungsi hitung_diskon(total) yang mengembalikan 10% jika total >= 100000.',
        codeToTry: 'def hitung_diskon(total):\n    if total >= 100000:\n        return total * 0.1\n    return 0\n\nprint("Diskon:", hitung_diskon(150000))',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'nilai = 65 -> if nilai >= 75',
        observedResult: 'Remedial',
        analysisPrompt: 'Kondisi if bernilai False, sehingga Python langsung melompat ke blok else.',
      },
      {
        trialNumber: 2,
        codeVariation: 'range(2, 8, 2)',
        observedResult: '2, 4, 6',
        analysisPrompt: 'Parameter kedua pada range bersifat eksklusif (berhenti sebelum 8), dengan kenaikan 2 langkah.',
      },
      {
        trialNumber: 3,
        codeVariation: 'return total * 0.1',
        observedResult: 'Diskon: 15000.0',
        analysisPrompt: 'Fungsi mengembalikan nilai hasil perhitungan ke baris pemanggil menggunakan kata kunci return.',
      },
    ],
    reasoningQuestions: [
      'Apa perbedaan mendasar antara perulangan `for` dengan perulangan `while`?',
      'Mengapa kata kunci `return` pada fungsi lebih fleksibel daripada langsung memanggil `print()` di dalam fungsi?',
    ],
    verificationQuiz: {
      question: 'Berapa kali perulangan `for i in range(0, 5):` akan dieksekusi?',
      codeSnippet: 'for i in range(0, 5):\n    print(i)',
      options: [
        {
          text: '5 kali (dengan nilai i: 0, 1, 2, 3, 4)',
          isCorrect: true,
          feedback: 'Tepat sekali! range(0, 5) menghasilkan 5 angka dimulai dari 0 dan berakhir pada angka 4 (batas akhir tidak disertakan).',
        },
        {
          text: '4 kali (karena berhenti pada angka 4)',
          isCorrect: false,
          feedback: 'Belum tepat. Karena dimulai dari 0, urutannya adalah 0, 1, 2, 3, 4 yang berjumlah tepat 5 kali.',
        },
        {
          text: '6 kali (dari 0 sampai 5)',
          isCorrect: false,
          feedback: 'Belum tepat. Batas akhir pada fungsi range() bersifat eksklusif, angka 5 tidak pernah dieksekusi.',
        },
      ],
    },
    verifiedExplanation:
      'Kaidah Resmi Alur Program Python: Python menggunakan indentasi wajib (indentation-based syntax, standarnya 4 spasi) untuk mendefinisikan blok kode percabangan, loop, dan fungsi, menggantikan kurung kurawal { } pada bahasa lain. Pada percabangan if-elif-else, kondisi dievaluasi dari atas ke bawah; cabang pertama yang bernilai True akan dijalankan dan cabang lainnya dilewati. Fungsi `range(start, stop, step)` menghasilkan deret bilangan bulat setengah terbuka [start, stop). Fungsi dengan `return` memungkinkan hasil komputasi digunakan kembali dalam perhitungan lanjutan.',
    commonPitfalls: [
      'IndentationError: expected an indented block — lupa memberikan indentasi spasi setelah tanda titik dua (:).',
      'Infinite Loop pada `while` — lupa memperbarui variabel penghitung (counter) sehingga kondisi selalu True.',
      'Mengira batas akhir `range(1, 10)` mencakup angka 10 (padahal hanya sampai 9).',
    ],
    goldenRule:
      'Prinsip Emas Alur Program: Indentasi adalah struktur logika, bukan sekadar hiasan. Rancang kondisi percabangan dari yang paling spesifik ke yang umum, dan pastikan setiap perulangan memiliki kondisi henti yang pasti.',
    transferChallenge: {
      title: 'Tantangan Transfer: Sistem Pembayaran Parkir Mall Cerdas',
      scenario: 'Pengelola mall menetapkan tarif parkir motor: 2 jam pertama Rp3.000, setiap jam berikutnya Rp2.000. Jika parkir lebih dari 5 jam, diberikan diskon Rp1.000.',
      task: 'Buat fungsi `hitung_parkir(jam)` yang menerima lama parkir dalam jam, lalu mengembalikan total biaya parkir yang harus dibayar sesuai aturan di atas.',
      starterHint: 'Gunakan percabangan if jam <= 2: tarif = 3000, else: tarif = 3000 + (jam - 2) * 2000.',
      expectedOutput: 'Parkir 6 jam: Total Bayar Rp10,000',
    },
    reflectionQuestions: [
      'Bagaimana pemahaman alur kontrol membantumu memecahkan masalah logika yang rumit secara bertahap?',
      'Kapan situasi terbaik untuk menggunakan fungsi (def) dalam menyederhanakan kode program?',
      'Strategi apa yang kamu gunakan ketika kode percabangan menghasilkan output yang tidak sesuai harapan?',
    ],
  },

  'C. Struktur Data': {
    stimulationContext:
      'Bagaimana jika kamu harus mengelola data presensi 40 siswa dalam satu kelas? Membuat 40 variabel terpisah (siswa1, siswa2, ...) tentu sangat tidak efisien. Di sinilah struktur data berperan.',
    stimulationCode: `# Eksperimen Struktur Data Koleksi
daftar_siswa = ["Ahmad", "Budi", "Citra"]
print("Siswa pertama:", daftar_siswa[0])

daftar_siswa.append("Dewi")
print("Total siswa:", len(daftar_siswa))

biodata = {"nama": "Ahmad", "kelas": "X-1", "nilai": 92}
print("Nilai Ahmad:", biodata["nilai"])`,
    stimulationQuestions: [
      'Mengapa elemen pertama pada List diakses dengan indeks [0] dan bukan [1]?',
      'Apa perbedaan mendasar antara List yang menggunakan kurung siku [...] dengan Dictionary yang menggunakan pasangan key:value {...}?',
      'Mengapa kita membutuhkan Tuple jika List sudah bisa menyimpan banyak data?',
    ],
    problemStatement:
      'Bagaimana cara memilih dan memanfaatkan struktur data koleksi (List, Tuple, Set, Dictionary) untuk mengorganisasikan informasi secara terstruktur dan efisien?',
    predictionPrompt:
      'Tuliskan analisismu: Apa yang terjadi jika kita mencoba mengubah isi elemen sebuah Tuple setelah ia dibuat?',
    experimentGuide:
      'Buka Online Compiler di bawah. Uji coba manipulasi List (tambah, ubah) dan Dictionary (baca nilai berdasarkan kunci).',
    trials: [
      {
        step: 1,
        title: 'Uji Operasi List & Indeks Negatif',
        action: 'Ketik angka = [10, 20, 30, 40] lalu cetak elemen terakhir menggunakan indeks angka[-1].',
        codeToTry: 'angka = [10, 20, 30, 40]\nprint("Elemen pertama:", angka[0])\nprint("Elemen terakhir:", angka[-1])',
      },
      {
        step: 2,
        title: 'Uji Immutability pada Tuple',
        action: 'Coba ubah elemen tuple dan amati error yang dihasilkan oleh Python.',
        codeToTry: 'koordinat = (100, 200)\nprint("Koordinat:", koordinat)\n# koordinat[0] = 150 # Ini akan memicu TypeError',
      },
      {
        step: 3,
        title: 'Uji Akses Dictionary Berdasarkan Kunci',
        action: 'Buat dictionary produk kasir dengan harga dan stok, lalu update stoknya.',
        codeToTry: 'produk = {"nama": "Buku", "harga": 5000, "stok": 10}\nproduk["stok"] += 5\nprint(f"Stok {produk[\'nama\']} terbaru: {produk[\'stok\']}")',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'angka[-1]',
        observedResult: '40',
        analysisPrompt: 'Indeks negatif di Python menghitung posisi dari arah belakang (-1 adalah elemen paling akhir).',
      },
      {
        trialNumber: 2,
        codeVariation: 'tuple[0] = nilai',
        observedResult: 'TypeError: \'tuple\' object does not support item assignment',
        analysisPrompt: 'Tuple bersifat immutable (kekal), elemennya tidak dapat diganti atau dihapus setelah didefinisikan.',
      },
      {
        trialNumber: 3,
        codeVariation: 'produk["stok"] += 5',
        observedResult: 'Stok Buku terbaru: 15',
        analysisPrompt: 'Dictionary memungkinkan pembacaan dan pembaruan data secara langsung menggunakan nama kunci (key), bukan nomor indeks.',
      },
    ],
    reasoningQuestions: [
      'Mengapa Dictionary sangat cocok digunakan untuk data entitas (seperti biodata siswa atau produk toko)?',
      'Apa keunggulan menggunakan Set saat kita ingin mengeliminasi data ganda (duplikat)?',
    ],
    verificationQuiz: {
      question: 'Struktur data Python manakah yang elemennya dijamin unik (tidak memiliki duplikat) dan tidak terurut?',
      codeSnippet: 'data = {1, 2, 2, 3, 3, 3}\nprint(data)',
      options: [
        {
          text: 'Set — otomatis menyaring nilai duplikat menjadi satu kemunculan unik',
          isCorrect: true,
          feedback: 'Tepat sekali! Set di Python didefinisikan dengan kurung kurawal {...} tanpa key:value dan otomatis menghapus seluruh elemen duplikat.',
        },
        {
          text: 'List — karena dapat menampung angka berapa saja',
          isCorrect: false,
          feedback: 'Belum tepat. List memperbolehkan elemen ganda sebanyak apa pun dan mempertahankan urutan indeks.',
        },
        {
          text: 'Tuple — karena nilainya tidak dapat diubah',
          isCorrect: false,
          feedback: 'Belum tepat. Tuple juga memperbolehkan duplikasi data, hanya saja elemennya tidak dapat diubah.',
        },
      ],
    },
    verifiedExplanation:
      'Kaidah Resmi Struktur Data Python: Python menyediakan empat struktur data koleksi bawaan: (1) List [ ] — berurutan, dapat diubah (mutable), mengizinkan duplikat. (2) Tuple ( ) — berurutan, tidak dapat diubah (immutable), mengizinkan duplikat, hemat memori. (3) Set { } — tidak berurutan, elemen unik tanpa duplikat, sangat cepat untuk pencarian keanggotaan (membership test). (4) Dictionary {k: v} — pemetaan pasangan kunci dan nilai, kuncinya harus unik dan immutable, sangat ideal untuk representasi data berbasis entitas.',
    commonPitfalls: [
      'IndexError: list index out of range — mencoba mengakses indeks yang melebihi jumlah elemen list.',
      'KeyError — mencoba membaca kunci dictionary yang tidak terdaftar tanpa menggunakan method .get().',
      'Mencoba mengubah elemen Tuple (TypeError: tuple does not support assignment).',
    ],
    goldenRule:
      'Prinsip Emas Struktur Data: Pilih List saat urutan dan fleksibilitas data diperlukan. Pilih Tuple untuk data konstan yang aman dari perubahan. Pilih Set untuk himpunan unik. Pilih Dictionary untuk data terstruktur dengan identitas kunci.',
    transferChallenge: {
      title: 'Tantangan Transfer: Rekap Nilai Siswa Menggunakan Dictionary & List',
      scenario: 'Wali kelas ingin merekap data nilai ujian informatika dari 3 siswa dalam bentuk list of dictionaries, lalu menghitung rata-rata nilai kelas.',
      task: 'Buat list `kelas = [{"nama": "Andi", "nilai": 80}, {"nama": "Budi", "nilai": 90}, {"nama": "Citra", "nilai": 85}]`. Gunakan perulangan for untuk menjumlahkan nilai ketiga siswa dan cetak rata-rata nilai kelas.',
      starterHint: 'Gunakan total = 0, loop for s in kelas: total += s["nilai"], lalu rata_rata = total / len(kelas).',
      expectedOutput: 'Rata-rata nilai kelas Informatika: 85.0',
    },
    reflectionQuestions: [
      'Bagaimana pemahaman struktur data mengubah cara pandangmu dalam mengorganisasikan data yang kompleks?',
      'Di antara List dan Dictionary, mana yang paling sering kamu gunakan dan mengapa?',
      'Apa kendala terbesar yang kamu hadapi saat mengakses data bertingkat (nested structure) dan bagaimana solusinya?',
    ],
  },

  'D. Pemrosesan Data': {
    stimulationContext:
      'Dalam era Big Data, data mentah tidak memiliki arti sebelum diolah. Python menyediakan metode pemrosesan data yang ekspresif untuk mengurutkan, menyaring, dan mentransformasikan informasi.',
    stimulationCode: `# Eksperimen Pemrosesan Data
nilai = [78, 92, 65, 88, 70]
nilai_urut = sorted(nilai, reverse=True)
print("Peringkat 3 teratas:", nilai_urut[:3])

tuntas = [n for n in nilai if n >= 75]
print("Nilai tuntas KKM:", tuntas)`,
    stimulationQuestions: [
      'Apa perbedaan antara nilai.sort() yang mengubah list asli dengan sorted(nilai) yang menghasilkan list baru?',
      'Bagaimana cara kerja teknik List Comprehension [n for n in nilai if n >= 75]?',
      'Apa fungsi parameter reverse=True pada fungsi pengurutan?',
    ],
    problemStatement:
      'Bagaimana cara mengolah, mengurutkan, memfilter, dan mengekstrak informasi esensial dari sekumpulan data mentah menggunakan teknik pemrosesan Python?',
    predictionPrompt:
      'Tuliskan hipotesismu: Mengapa fungsi sorted() lebih disukai ketika data asli tidak boleh rusak atau berubah urutannya?',
    experimentGuide:
      'Gunakan Online Compiler untuk menguji fungsi pengurutan data dan pemfilteran list comprehension.',
    trials: [
      {
        step: 1,
        title: 'Uji Pengurutan Data Angka & Teks',
        action: 'Urutkan daftar nama siswa secara alfabetis dari A ke Z.',
        codeToTry: 'nama = ["Eko", "Budi", "Dewi", "Andi", "Citra"]\nprint("Urut A-Z:", sorted(nama))',
      },
      {
        step: 2,
        title: 'Uji List Comprehension untuk Transformasi Data',
        action: 'Kalikan setiap angka dalam list dengan 2 menggunakan list comprehension.',
        codeToTry: 'angka = [1, 2, 3, 4, 5]\nkuadrat = [x * 2 for x in angka]\nprint("Hasil kali 2:", kuadrat)',
      },
      {
        step: 3,
        title: 'Uji Pemfilteran Berdasarkan Kriteria',
        action: 'Filter hanya angka genap dari sebuah deret bilangan.',
        codeToTry: 'deret = [12, 7, 19, 24, 30, 15]\ngenap = [x for x in deret if x % 2 == 0]\nprint("Bilangan genap:", genap)',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'sorted(["Eko", "Budi", "Dewi", ...])',
        observedResult: '[\'Andi\', \'Budi\', \'Citra\', \'Dewi\', \'Eko\']',
        analysisPrompt: 'Python mengurutkan string berdasarkan nilai ASCII/Unicode dari karakter pertama hingga terakhir.',
      },
      {
        trialNumber: 2,
        codeVariation: '[x * 2 for x in angka]',
        observedResult: '[2, 4, 6, 8, 10]',
        analysisPrompt: 'List comprehension menerapkan formula matematika ke setiap item secara simultan dalam satu baris kode ringkas.',
      },
      {
        trialNumber: 3,
        codeVariation: '[x for x in deret if x % 2 == 0]',
        observedResult: '[12, 24, 30]',
        analysisPrompt: 'Klausa if pada list comprehension bertindak sebagai filter: hanya elemen yang memenuhi syarat yang dipertahankan.',
      },
    ],
    reasoningQuestions: [
      'Mengapa list comprehension sering dianggap lebih "Pythonic" dibandingkan membuat perulangan for kosong dengan .append()?',
      'Bagaimana cara mengurutkan list of dictionaries berdasarkan nilai kunci tertentu?',
    ],
    verificationQuiz: {
      question: 'Apa hasil dari ekspresi `[x for x in range(6) if x > 2]`?',
      codeSnippet: 'hasil = [x for x in range(6) if x > 2]\nprint(hasil)',
      options: [
        {
          text: '[3, 4, 5] — angka dari range(6) yang bernilai lebih besar dari 2',
          isCorrect: true,
          feedback: 'Tepat sekali! range(6) menghasilkan 0 s.d 5, dan syarat if x > 2 menyaring hanya angka 3, 4, dan 5.',
        },
        {
          text: '[2, 3, 4, 5] — karena dimulai dari angka 2',
          isCorrect: false,
          feedback: 'Belum tepat. Syaratnya adalah x > 2 (lebih besar ketat), sehingga angka 2 tidak disertakan.',
        },
        {
          text: '[3, 4, 5, 6] — sampai angka 6',
          isCorrect: false,
          feedback: 'Belum tepat. range(6) berhenti sebelum angka 6.',
        },
      ],
    },
    verifiedExplanation:
      'Kaidah Resmi Pemrosesan Data Python: Python menggunakan algoritma Timsort (campuran merge sort dan insertion sort) yang sangat stabil dan berkinerja tinggi O(n log n). Metode `.sort()` mengurutkan list in-place (mengubah objek asli dan mengembalikan None), sedangkan fungsi global `sorted(iterable)` mengembalikan list baru tanpa mengubah data sumber. List Comprehension `[ekspresi for item in iterable if kondisi]` adalah sintaks idiomatik Python yang lebih cepat dan ringkas untuk memetakan dan menyaring koleksi data.',
    commonPitfalls: [
      'Salah menulis `hasil = data.sort()` lalu mendapati `hasil` bernilai `None` (karena .sort() tidak mengembalikan nilai).',
      'Mengurutkan list yang berisi tipe data campuran angka dan string yang memicu TypeError di Python 3.',
      'Sintaks list comprehension terbalik antara bagian `for` dan `if`.',
    ],
    goldenRule:
      'Prinsip Emas Pemrosesan Data: Gunakan `sorted()` jika data asli harus terjaga, dan manfaatkan List Comprehension untuk pemfilteran data yang ringkas, ekspresif, dan berkinerja tinggi.',
    transferChallenge: {
      title: 'Tantangan Transfer: Peringkat Nilai Tryout Sekolah',
      scenario: 'Panitia tryout ingin menampilkan 3 nilai tertinggi dari seluruh peserta dan memisahkan daftar peserta yang berhak mendapatkan beasiswa (nilai >= 85).',
      task: 'Diberikan list nilai = [70, 88, 95, 62, 85, 90, 78]. Urutkan dari tertinggi ke terendah, cetak top 3 nilai, dan buat list peserta beasiswa.',
      starterHint: 'Gunakan sorted(nilai, reverse=True)[:3] untuk top 3, dan [n for n in nilai if n >= 85] untuk beasiswa.',
      expectedOutput: 'Top 3 Nilai: [95, 90, 88]\nPenerima Beasiswa: [88, 95, 85, 90]',
    },
    reflectionQuestions: [
      'Bagaimana keterampilan pemrosesan data membantumu dalam analisis data di bidang studi lain seperti Sains atau Matematika?',
      'Kapan list comprehension sebaiknya tidak digunakan (misalnya saat logika terlalu kompleks)?',
      'Wawasan baru apa yang paling berharga bagi pemahaman kodingmu dari materi ini?',
    ],
  },

  'E. Modul dan Penanganan Error': {
    stimulationContext:
      'Program profesional tidak boleh tiba-tiba berhenti (crash) saat menerima masukan salah dari pengguna. Program yang baik mampu mengantisipasi error dan memanfaatkan modul eksternal.',
    stimulationCode: `# Eksperimen Error Handling & Modul
import math

try:
    angka = int("bukan_angka")
    print("Akar:", math.sqrt(angka))
except ValueError as e:
    print("Penanganan Aman: Masukan harus berupa angka numerik!")
finally:
    print("Blok selesai dieksekusi dengan aman.")`,
    stimulationQuestions: [
      'Mengapa program tidak langsung mati (crash) saat mengeksekusi int("bukan_angka")?',
      'Apa peran blok `try` dan blok `except` dalam melindungi jalannya program?',
      'Bagaimana cara modul eksternal seperti `math` memperkaya fitur dasar Python?',
    ],
    problemStatement:
      'Bagaimana cara membangun program yang tangguh (robust) menggunakan penanganan eksepsi try-except dan memanfaatkan modul bawaan Python?',
    predictionPrompt:
      'Tuliskan analisismu: Apa dampak buruk bagi pengguna aplikasi jika sebuah program tidak dilengkapi dengan try-except?',
    experimentGuide:
      'Gunakan compiler untuk menguji bagaimana try-except menangkap kesalahan pembagian dengan nol (ZeroDivisionError) dan konversi nilai.',
    trials: [
      {
        step: 1,
        title: 'Uji Coba Penanganan ZeroDivisionError',
        action: 'Bagi sebuah angka dengan nol di dalam blok try-except.',
        codeToTry: 'try:\n    hasil = 100 / 0\n    print(hasil)\nexcept ZeroDivisionError:\n    print("Pencegahan: Tidak dapat membagi angka dengan nol!")',
      },
      {
        step: 2,
        title: 'Uji Modul Matematika (math)',
        action: 'Gunakan fungsi math.sqrt() untuk menghitung akar kuadrat dan math.pi untuk nilai pi.',
        codeToTry: 'import math\nprint("Akar 144:", math.sqrt(144))\nprint("Nilai Pi:", round(math.pi, 4))',
      },
      {
        step: 3,
        title: 'Uji Blok Finally yang Selalu Berjalan',
        action: 'Buktikan bahwa blok finally selalu dieksekusi baik terjadi error maupun tidak.',
        codeToTry: 'try:\n    x = 10\n    print("Nilai x:", x)\nfinally:\n    print("Pembersihan sumber daya selesai.")',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: '100 / 0 di dalam try-except',
        observedResult: 'Pencegahan: Tidak dapat membagi angka dengan nol!',
        analysisPrompt: 'Alur program dialihkan ke blok except yang sesuai sehingga aplikasi tetap berjalan normal tanpa crash.',
      },
      {
        trialNumber: 2,
        codeVariation: 'import math -> math.sqrt(144)',
        observedResult: 'Akar 144: 12.0',
        analysisPrompt: 'Perintah import menyediakan pustaka fungsi matematis siap pakai yang teroptimasi.',
      },
      {
        trialNumber: 3,
        codeVariation: 'Blok finally',
        observedResult: 'Pembersihan sumber daya selesai.',
        analysisPrompt: 'Blok finally dijamin berjalan dalam kondisi apa pun untuk menutup koneksi atau membersihkan memori.',
      },
    ],
    reasoningQuestions: [
      'Mengapa menangkap error secara spesifik (misal `except ValueError:`) jauh lebih baik daripada `except:` tanpa nama error?',
      'Bagaimana modul seperti `random` dapat digunakan dalam pembuatan game atau simulasi komputer?',
    ],
    verificationQuiz: {
      question: 'Blok manakah dalam struktur try-except-finally yang dijamin PASTI selalu dijalankan?',
      codeSnippet: 'try:\n    pass\nexcept Exception:\n    pass\nfinally:\n    print("Selalu Jalan")',
      options: [
        {
          text: 'Blok finally — selalu dijalankan baik ada error maupun tidak',
          isCorrect: true,
          feedback: 'Tepat sekali! Blok finally dirancang khusus untuk proses pembersihan yang wajib berjalan dalam segala kondisi eksekusi.',
        },
        {
          text: 'Blok except — selalu dijalankan pada setiap baris',
          isCorrect: false,
          feedback: 'Belum tepat. Blok except hanya dieksekusi jika terjadi error (exception) di dalam blok try.',
        },
        {
          text: 'Tidak ada yang pasti, program selalu berhenti di blok try',
          isCorrect: false,
          feedback: 'Belum tepat. Python menjamin eksekusi blok finally setelah try atau except selesai.',
        },
      ],
    },
    verifiedExplanation:
      'Kaidah Resmi Penanganan Error & Modul: Eksepsi adalah peristiwa abnormal saat runtime yang mengganggu alur instruksi program. Struktur `try-except-else-finally` memungkinkan penanganan error secara elegan (*graceful degradation*). Praktik terbaik adalah menangkap eksepsi secara spesifik (misal `ValueError`, `ZeroDivisionError`, `FileNotFoundError`) agar bug tersembunyi tidak terabaikan secara tidak sengaja. Modul Python adalah file berekstensi .py yang memuat fungsi dan variabel yang dapat digunakan ulang melalui pernyataan `import`.',
    commonPitfalls: [
      'Menggunakan "bare except" (`except:`) yang menangkap semua sinyal termasuk KeyboardInterrupt (Ctrl+C).',
      'Lupa mengimpor modul sebelum memanggil fungsinya (NameError: name \'math\' is not defined).',
      'Menulis kode di dalam blok `try` terlalu banyak sehingga sulit melacak baris mana yang memicu error.',
    ],
    goldenRule:
      'Prinsip Emas Robust Programming: Lindungi setiap masukan pengguna dan operasi berisiko dengan try-except spesifik, dan jangan pernah biarkan program crash tanpa pesan penjelasan yang ramah.',
    transferChallenge: {
      title: 'Tantangan Transfer: Validasi Input Angka Kasir Tangguh',
      scenario: 'Kasir minimarket sering salah ketik huruf pada kolom nominal pembayaran uang tunai. Buat sistem validasi yang tidak akan pernah crash.',
      task: 'Buat fungsi `baca_uang()` yang membaca input pengguna. Jika pengguna memasukkan huruf, tangkap ValueError dan tampilkan "Input salah, masukkan angka murni!". Jika benar, tampilkan "Pembayaran diterima: Rp[nominal]".',
      starterHint: 'Gunakan try: nominal = int(input()) except ValueError: print(...).',
      expectedOutput: 'Input: "lima puluh ribu" -> Output: "Input salah, masukkan angka murni!"',
    },
    reflectionQuestions: [
      'Mengapa penanganan error merupakan ciri utama perangkat lunak tingkat produksi (production-ready)?',
      'Bagaimana pemanfaatan modul Python dapat mempercepat pengembangan proyek aplikasimu?',
      'Strategi apa yang kamu terapkan untuk mengidentifikasi potensi error sebelum kode dijalankan oleh pengguna?',
    ],
  },

  'F. Pemrograman Berorientasi Objek (OOP)': {
    stimulationContext:
      'Di dunia nyata, kita berinteraksi dengan objek: sebuah mobil memiliki atribut (warna, merk) dan kemampuan aksi (maju, rem). OOP memodelkan dunia nyata ke dalam kode pemrograman.',
    stimulationCode: `# Eksperimen Paradigma Objek (OOP)
class Siswa:
    def __init__(self, nama, kelas):
        self.nama = nama
        self.kelas = kelas
        self.poin = 100

    def tambah_prestasi(self, nilai):
        self.poin += nilai

siswa1 = Siswa("Rizki", "X-A")
siswa1.tambah_prestasi(50)
print(f"Poin {siswa1.nama}: {siswa1.poin}")`,
    stimulationQuestions: [
      'Apa peran metode `__init__` saat objek `siswa1 = Siswa(...)` diciptakan?',
      'Mengapa setiap metode di dalam class wajib menyertakan parameter `self`?',
      'Apa keuntungan membuat class dibandingkan hanya menggunakan variabel dan fungsi lepas?',
    ],
    problemStatement:
      'Bagaimana konsep Class, Objek, Atribut, Metode, dan Inheritance mempermudah perancangan sistem perangkat lunak yang modular, terstruktur, dan dapat digunakan kembali?',
    predictionPrompt:
      'Tuliskan hipotesismu: Apa yang membedakan sebuah Class (cetak biru) dengan Object (wujud nyata)?',
    experimentGuide:
      'Gunakan compiler untuk membuat class sederhana, menginstansiasi objek, dan memanggil metodenya.',
    trials: [
      {
        step: 1,
        title: 'Uji Pembuatan Class & Instansiasi Objek',
        action: 'Definisikan class PersegiPanjang dengan atribut panjang dan lebar, lalu buat objeknya.',
        codeToTry: 'class PersegiPanjang:\n    def __init__(self, p, l):\n        self.panjang = p\n        self.lebar = l\n\npp = PersegiPanjang(10, 5)\nprint(f"Dimensi: {pp.panjang} x {pp.lebar}")',
      },
      {
        step: 2,
        title: 'Uji Pembuatan Method pada Class',
        action: 'Tambahkan method hitung_luas() yang mengembalikan hasil kali panjang dan lebar.',
        codeToTry: 'class PersegiPanjang:\n    def __init__(self, p, l):\n        self.p = p\n        self.l = l\n    def luas(self):\n        return self.p * self.l\n\npp = PersegiPanjang(8, 4)\nprint("Luas:", pp.luas())',
      },
      {
        step: 3,
        title: 'Uji Konsep Pewarisan Sifat (Inheritance)',
        action: 'Buat subclass SiswaPrestasi yang mewarisi sifat dari class Siswa dasar.',
        codeToTry: 'class Siswa:\n    def __init__(self, nama):\n        self.nama = nama\n\nclass SiswaPrestasi(Siswa):\n    def dapat_piala(self):\n        return f"{self.nama} meraih piala kejuaraan!"\n\njuara = SiswaPrestasi("Siti")\nprint(juara.dapat_piala())',
      },
    ],
    observationTable: [
      {
        trialNumber: 1,
        codeVariation: 'pp = PersegiPanjang(10, 5)',
        observedResult: 'Dimensi: 10 x 5',
        analysisPrompt: 'Metode __init__ (konstruktor) otomatis dipanggil untuk menginisialisasi atribut instansi saat objek baru dibuat.',
      },
      {
        trialNumber: 2,
        codeVariation: 'pp.luas()',
        observedResult: 'Luas: 32',
        analysisPrompt: 'Method mengakses atribut internal objek menggunakan referensi self.',
      },
      {
        trialNumber: 3,
        codeVariation: 'class SiswaPrestasi(Siswa)',
        observedResult: 'Siti meraih piala kejuaraan!',
        analysisPrompt: 'Subclass secara otomatis mewarisi atribut nama dari class induk tanpa perlu menulis ulang kodenya.',
      },
    ],
    reasoningQuestions: [
      'Mengapa parameter `self` sangat penting untuk membedakan data milik objek satu dengan objek lainnya?',
      'Bagaimana konsep Inheritance (Pewarisan) mencegah duplikasi kode pada program skala besar?',
    ],
    verificationQuiz: {
      question: 'Apa fungsi utama dari metode `__init__` pada sebuah Class di Python?',
      codeSnippet: 'class Mobil:\n    def __init__(self, merk):\n        self.merk = merk',
      options: [
        {
          text: 'Konstruktor — otomatis dieksekusi saat objek baru diciptakan untuk menetapkan nilai atribut awal',
          isCorrect: true,
          feedback: 'Tepat sekali! __init__ adalah metode inisialisasi (konstruktor) yang secara otomatis berjalan setiap kali sebuah instansi class baru dibuat.',
        },
        {
          text: 'Metode untuk menghapus objek dari memori',
          isCorrect: false,
          feedback: 'Belum tepat. Penghapusan objek ditangani oleh __del__ atau garbage collector otomatis.',
        },
        {
          text: 'Fungsi global yang tidak terikat pada class',
          isCorrect: false,
          feedback: 'Belum tepat. __init__ adalah metode khusus (magic method) yang terikat langsung pada struktur class.',
        },
      ],
    },
    verifiedExplanation:
      'Kaidah Resmi OOP Python: Pemrograman Berorientasi Objek mengorganisasikan kode ke dalam entitas mandiri yang menggabungkan keadaan (state/atribut) dan perilaku (behavior/metode). Class adalah cetak biru (blueprint), sedangkan Object adalah instansi nyata dari cetak biru tersebut. Parameter `self` mewakili instansi objek yang sedang aktif diproses. Empat pilar OOP adalah: Enkapsulasi (pembungkusan data), Abstraksi (penyembunyian kompleksitas), Pewarisan (Inheritance untuk penggunaan ulang kode), dan Polimorfisme (antarmuka seragam untuk tipe berbeda).',
    commonPitfalls: [
      'Lupa menyertakan parameter `self` sebagai parameter pertama saat mendefinisikan method di dalam class.',
      'Lupa memanggil tanda kurung saat membuat objek (misal `s = Siswa` alih-alih `s = Siswa()`).',
      'Mengacaukan antara Class Attribute (berlaku untuk semua objek) dengan Instance Attribute (milik tiap objek individual).',
    ],
    goldenRule:
      'Prinsip Emas OOP: Gunakan Class untuk memodelkan entitas dunia nyata. Satukan data dan aksi di dalam satu wadah mandiri untuk menjaga kode tetap modular, bersih, dan mudah diperluas.',
    transferChallenge: {
      title: 'Tantangan Transfer: Sistem Akun Tabungan Bank Siswa',
      scenario: 'Koperasi sekolah ingin memodelkan rekening tabungan siswa yang memiliki saldo awal, kemampuan setor uang, dan tarik tunai dengan pengecekan saldo cukup.',
      task: 'Buat class RekeningBank dengan atribut nama dan saldo. Buat method setor(jumlah) dan tarik(jumlah). Jika saldo tidak cukup saat tarik, cetak "Saldo tidak mencukupi!".',
      starterHint: 'Gunakan if jumlah <= self.saldo: self.saldo -= jumlah else: print("Saldo tidak mencukupi!").',
      expectedOutput: 'Rekening Andi: Setor 50000 -> Tarik 20000 -> Sisa Saldo: Rp30,000',
    },
    reflectionQuestions: [
      'Bagaimana cara berpikir berorientasi objek mempermudah perancangan aplikasi game atau simulasi bisnis?',
      'Di antara paradigma fungsional/prosedural dan OOP, kapan masing-masing pendekatan paling tepat digunakan?',
      'Pelajaran komputasional terpenting apa yang kamu peroleh setelah menyelesaikan seluruh modul di SinauPy?',
    ],
  },
}

export function getDiscoveryForCategory(categoryTitle: string): DiscoveryTopicData {
  const found = CATEGORY_DISCOVERY_MAP[categoryTitle]
  if (found) return found

  // Fallback to Category A if not found
  return CATEGORY_DISCOVERY_MAP['A. Dasar-Dasar Python']
}
