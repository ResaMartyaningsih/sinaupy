# PythonLab

Media belajar Python interaktif untuk siswa kelas X. Siswa dapat mengikuti
materi bertahap, membaca contoh dan penjelasan kode, mengubah serta menjalankan
Python di setiap subbab, mengerjakan kuis prediksi output, lalu menyelesaikan
studi kasus dengan variasi konteks dan angka.

## Menjalankan secara lokal

```sh
npm install
npm run dev
```

Untuk memeriksa aplikasi sebelum dipublikasikan:

```sh
npm run lint
npm run build
```

## Praktik Python

Compiler menggunakan Pyodide yang dimuat saat tombol "Jalankan kode" pertama
kali ditekan. Browser memerlukan koneksi internet untuk mengunduh runtime dari
jsDelivr. Kode siswa dijalankan di browser; input program diberikan satu nilai
per baris melalui kotak input.

Beranda menyediakan halaman pengantar Python, katalog materi per bab, halaman
latihan coding, serta halaman tantangan pemrograman. Editor pada praktik materi
dan latihan dimulai kosong dengan instruksi serta petunjuk langkah demi langkah.

## Studi kasus dan penilaian

Studi kasus memilih variasi konteks dan angka saat halaman dibuka dan dapat
dibuat ulang oleh siswa. Variasi ini mendorong siswa menguji solusi sendiri,
tetapi aplikasi web sisi-klien tidak dapat menjamin pencegahan salin-tempel.
Untuk penilaian, mintalah siswa menjelaskan logika program serta memodifikasi
dan menguji program dengan data baru.
