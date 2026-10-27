import { IconArrowLeft, IconArrowRight } from './Icons'
import './LearningPage.css'

type LearningPageProps = {
  onShowMaterials: () => void
  onBack?: () => void
  onBackHome?: () => void
}

const learningSteps = [
  'Pengenalan Bahasa Python & Interpreter',
  'Variabel, Tipe Data, dan Konversi',
  'Operator Aritmatika & Perbandingan Logika',
  'Struktur Percabangan (If - Elif - Else)',
  'Struktur Perulangan (For dan While)',
  'Struktur Data Koleksi (List & Dictionary)',
  'Fungsi Modular (def)',
]

export default function LearningPage({ onShowMaterials, onBack, onBackHome }: LearningPageProps) {
  const handleBack = () => {
    if (onBack) onBack()
    else if (onBackHome) onBackHome()
    else window.history.back()
  }

  return (
    <section className="learning-page" aria-labelledby="learning-title">
      <div className="learning-top-bar">
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
      </div>

      <div className="learning-layout">
        <div className="learning-copy">
          <span className="section-kicker">PANDUAN AWAL SISWA</span>
          <h1 id="learning-title">Pengantar Belajar Python di SinauPy</h1>
          <p className="learning-intro">
            Python adalah bahasa pemrograman tingkat tinggi yang sintaksnya sangat mirip dengan bahasa Inggris sehari-hari.
            Bahasa ini dirancang agar mudah dibaca, dipahami, dan dipelajari oleh pemula, namun sangat andal digunakan
            dalam pengembangan perangkat lunak, sains data, dan kecerdasan buatan.
          </p>

          <div className="python-intro-card">
            <h4>Bagaimana program Python dieksekusi?</h4>
            <p>
              Instruksi yang kamu tulis di SinauPy akan diterjemahkan oleh interpreter Python baris demi baris dari atas ke bawah.
              Misalnya, perintah <code>print("Halo, dunia!")</code> meminta komputer untuk mencetak teks di dalam tanda kutip ke layar terminal keluaran.
            </p>
            <span className="card-note">
              Di SinauPy, seluruh kode dieksekusi langsung di perambanmu menggunakan teknologi WebAssembly Pyodide yang aman dan tanpa instalasi perangkat lunak tambahan.
            </span>
          </div>

          <a
            className="button button-primary"
            href="#materi"
            onClick={(event) => {
              event.preventDefault()
              onShowMaterials()
            }}
          >
            Mulai Masuk ke Katalog Materi <IconArrowRight />
          </a>
        </div>

        <aside className="learning-roadmap" aria-label="Alur tahapan belajar Python">
          <span className="roadmap-label">TAHAPAN MATERI KELAS X</span>
          <ol>
            {learningSteps.map((step, index) => (
              <li key={step}>
                <span className="roadmap-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="roadmap-step-text">{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  )
}
