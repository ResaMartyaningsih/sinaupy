import { useState } from 'react'
import { IconBrand, IconPythonLogo, IconArrowUpRight, IconAlert } from './Icons'
import { saveStudentProfile, type StudentProfile } from './studentData'
import './StudentIdentityScreen.css'

type StudentIdentityScreenProps = {
  initialName?: string
  initialClass?: string
  onComplete: (profile: StudentProfile) => void
}

const CLASS_OPTIONS = ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7']

export default function StudentIdentityScreen({
  initialName = '',
  initialClass = '',
  onComplete,
}: StudentIdentityScreenProps) {
  const [name, setName] = useState(initialName)
  const [className, setClassName] = useState(initialClass)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap siswa.')
      return
    }

    if (!className || className === '') {
      setErrorMessage('Silakan pilih kelas Anda (X-1 sampai X-7).')
      return
    }

    const profile: StudentProfile = {
      name: name.trim(),
      className: className.trim(),
    }

    // Persist to session and local storage
    saveStudentProfile(profile)
    onComplete(profile)
  }

  return (
    <div className="identity-screen">
      <header className="identity-header">
        <div className="identity-brand">
          <IconBrand className="brand-logo-icon" />
          <span className="brand-name">Sinau<span>Py</span></span>
        </div>
      </header>

      <div className="identity-container">
        <div className="identity-card-box">
          {/* Left Column: Form */}
          <div className="identity-card-left">
            <div className="identity-step-kicker">
              LANGKAH 01 · IDENTITAS SISWA
            </div>

            <h1 className="identity-title">Sebelum Mulai,<br />Kenalan Dulu!</h1>
            
            <p className="identity-desc">
              Lengkapi nama dan kelasmu agar pengalaman belajar pemrograman Python di SinauPy dapat disesuaikan dan tercatat rapi.
            </p>

            {errorMessage && (
              <div className="identity-error-banner" role="alert">
                <IconAlert />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="identity-form">
              <div className="form-field">
                <label htmlFor="student-full-name">
                  Nama Lengkap Siswa <span className="req-star">*</span>
                </label>
                <input
                  id="student-full-name"
                  type="text"
                  placeholder="Ketik nama lengkapmu (contoh: Ahmad Rizki)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label htmlFor="student-class-select">
                  Kelas / Rombel <span className="req-star">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="student-class-select"
                    value={className}
                    onChange={(e) => {
                      setClassName(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                  >
                    <option value="">-- Pilih kelas Anda --</option>
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        Kelas {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Class Pills for Single-Tap Selection */}
                <div className="quick-class-pills">
                  <span className="pills-label">Pilihan Cepat:</span>
                  <div className="pills-group">
                    {CLASS_OPTIONS.map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        className={`class-pill-btn ${className === cls ? 'active' : ''}`}
                        onClick={() => {
                          setClassName(cls)
                          if (errorMessage) setErrorMessage('')
                        }}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className="identity-submit-btn">
                Mulai Belajar Sekarang <IconArrowUpRight />
              </button>

              <div className="identity-footnote-pill">
                <span>🔒 Data identitas tersimpan di peramban ini (tanpa perlu login akun)</span>
              </div>
            </form>
          </div>

          {/* Right Column: Creative Visual Mascot */}
          <div className="identity-card-right" aria-hidden="true">
            <div className="identity-illustration-canvas">
              <div className="mascot-wrapper">
                <IconPythonLogo size={170} className="identity-python-mascot" />
                
                <div className="mascot-badge-tag">
                  <span>&lt;/&gt; Python 3</span>
                </div>
                <div className="mascot-dot dot-yellow-1" />
                <div className="mascot-dot dot-blue-1" />
                <div className="mascot-dot dot-yellow-2" />
                <div className="mascot-cube cube-blue" />
                <div className="mascot-cube cube-yellow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
