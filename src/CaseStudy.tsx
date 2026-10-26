import { useState } from 'react'
import CodePlayground from './CodePlayground'
import './CaseStudy.css'

const caseVariants = [
  {
    setting: 'bazar kelas',
    goal: () => 'mengelola penjualan barang',
    input: 'nama barang, harga satuan, jumlah terjual',
    metric: (amount: number) => `Target pemasukan Rp${(amount * 1000).toLocaleString('id-ID')}`,
    requirement: (amount: number) => `Hitung pemasukan (harga satuan × jumlah terjual), lalu cek apakah minimal Rp${(amount * 1000).toLocaleString('id-ID')} tercapai.`,
    rubric: 'Gunakan input atau variabel, konversi angka, operasi hitung, dan percabangan.',
  },
  {
    setting: 'peminjaman buku kelas',
    goal: () => 'memeriksa pengajuan pinjam',
    input: 'judul buku, jumlah hari pinjam, status anggota',
    metric: (amount: number) => `Batas pinjam ${amount} hari`,
    requirement: (amount: number) => `Jika lama pinjam melebihi ${amount} hari, hitung denda Rp1.000 per hari keterlambatan dan tampilkan status pengajuan.`,
    rubric: 'Gunakan input atau variabel, konversi angka, operasi hitung, dan percabangan.',
  },
  {
    setting: 'persiapan lomba sekolah',
    goal: () => 'memeriksa perlengkapan tim',
    input: 'nama anggota, jumlah perlengkapan, stok tersedia',
    metric: (amount: number) => `Kebutuhan perlengkapan tim: ${amount} buah`,
    requirement: (amount: number) => `Bandingkan stok tersedia dengan kebutuhan ${amount} perlengkapan; hitung kekurangan jika stok belum cukup.`,
    rubric: 'Gunakan input atau variabel, perulangan, operasi hitung, dan percabangan.',
  },
  {
    setting: 'kantin minim sampah',
    goal: () => 'mencatat transaksi wadah pakai ulang',
    input: 'nama pembeli, jumlah wadah, harga per wadah',
    metric: (amount: number) => `Harga khusus per wadah: Rp${(amount * 1000).toLocaleString('id-ID')}`,
    requirement: (amount: number) => `Hitung total untuk jumlah wadah yang dipilih dengan harga Rp${(amount * 1000).toLocaleString('id-ID')} per wadah, lalu tampilkan ajakan membawa wadah kembali.`,
    rubric: 'Gunakan input atau variabel, operasi hitung, dan f-string untuk membuat ringkasan.',
  },
]

function createCase() {
  const variant = caseVariants[Math.floor(Math.random() * caseVariants.length)]
  const target = 8 + Math.floor(Math.random() * 23)
  return { ...variant, target }
}

function CaseStudy() {
  const [studyCase, setStudyCase] = useState(createCase)

  return (
    <section className="case-study" aria-labelledby="case-study-title">
      <div className="case-study-heading">
        <p className="section-kicker">TANTANGAN AKHIR</p>
        <h2 id="case-study-title">Studi kasus: {studyCase.setting}</h2>
        <p>
          Rancang program untuk {studyCase.goal()}. Setiap kali
          halaman dibuka, konteks dan angka tantangan dipilih kembali.
        </p>
      </div>

      <div className="case-study-brief">
        <div>
          <span>DATA YANG PERLU DIOLAH</span>
          <p>{studyCase.input}</p>
        </div>
        <div>
          <span>PARAMETER VARIAN INI</span>
          <p>{studyCase.metric(studyCase.target)}</p>
        </div>
        <div>
          <span>TUGAS</span>
          <p>{studyCase.requirement(studyCase.target)}</p>
        </div>
      </div>

      <div className="case-study-rubric">
        <strong>Target belajar</strong>
        <p>{studyCase.rubric} Program harus bisa diuji dengan nilai yang berbeda, bukan hanya satu contoh.</p>
        <p className="case-study-reflection">
          Setelah selesai, jelaskan pilihan logikamu dan ubah sendiri minimal dua nilai untuk menguji program.
        </p>
      </div>

      <CodePlayground
        title="Bangun solusi sendiri"
        instructions="Mulai dari kode kosong. Pecah masalah menjadi langkah kecil, tulis program, lalu uji dengan beberapa input."
        hints={[
          'Buat variabel atau minta input untuk menyimpan data pada studi kasus.',
          'Susun perhitungan dan aturan keputusan sesuai kebutuhan kasus.',
          'Jalankan dengan data yang memenuhi dan tidak memenuhi kondisi.',
        ]}
      />
      <button className="new-case-button" type="button" onClick={() => setStudyCase(createCase())}>
        Buat variasi studi kasus
      </button>
      <p className="case-study-note">
        Variasi konteks dan angka membantu latihan mandiri, tetapi aplikasi web tidak dapat menjamin pencegahan salin-tempel. Guru dapat meminta siswa menjelaskan kode dan mengubah data saat penilaian.
      </p>
    </section>
  )
}

export default CaseStudy
