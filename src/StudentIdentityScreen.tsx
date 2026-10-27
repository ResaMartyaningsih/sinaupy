import { useState } from 'react'
import { IconBrand, IconPythonLogo, IconArrowUpRight, IconAlert } from './Icons'
import { saveStudentProfile, syncScoresWithCloud, type StudentProfile } from './studentData'
import {
  isSupabaseConfigured,
  signInStudent,
  signUpStudent,
} from './supabaseClient'
import './StudentIdentityScreen.css'

type StudentIdentityScreenProps = {
  initialName?: string
  initialClass?: string
  onComplete: (profile: StudentProfile) => void
}

const CLASS_OPTIONS = ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7']

function formatEmail(input: string): string {
  const trimmed = input.trim().toLowerCase()
  if (trimmed.includes('@')) {
    return trimmed
  }
  const cleanId = trimmed.replace(/[^a-z0-9._-]/g, '')
  return `${cleanId || 'siswa'}@sinaupy.sch.id`
}

export default function StudentIdentityScreen({
  initialName = '',
  initialClass = '',
  onComplete,
}: StudentIdentityScreenProps) {
  const hasCloud = isSupabaseConfigured()
  const [authMode, setAuthMode] = useState<'cloud' | 'guest'>(hasCloud ? 'cloud' : 'guest')
  const [cloudAction, setCloudAction] = useState<'signin' | 'signup'>('signin')

  // Form states
  const [name, setName] = useState(initialName)
  const [className, setClassName] = useState(initialClass)
  const [accountIdentifier, setAccountIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle Guest / Local Storage Submission
  const handleGuestSubmit = (e: React.FormEvent) => {
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
      isCloudAccount: false,
    }

    saveStudentProfile(profile)
    onComplete(profile)
  }

  // Handle Cloud Supabase Authentication (Login / Sign Up)
  const handleCloudSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!accountIdentifier.trim()) {
      setErrorMessage('Silakan masukkan Email atau NISN / Username akun siswa.')
      return
    }

    if (!password || password.length < 6) {
      setErrorMessage('Kata sandi / PIN minimal 6 karakter.')
      return
    }

    const finalEmail = formatEmail(accountIdentifier)

    if (cloudAction === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Silakan masukkan nama lengkap siswa untuk pendaftaran.')
        return
      }
      if (!className) {
        setErrorMessage('Silakan pilih kelas siswa untuk pendaftaran.')
        return
      }

      setIsLoading(true)
      const res = await signUpStudent(finalEmail, password, name.trim(), className)
      setIsLoading(false)

      if (res.error) {
        setErrorMessage(res.error)
        return
      }

      if (res.user) {
        const profile: StudentProfile = {
          name: name.trim(),
          className: className,
          email: finalEmail,
          authId: res.user.id,
          isCloudAccount: true,
        }
        saveStudentProfile(profile)
        await syncScoresWithCloud()
        onComplete(profile)
      } else {
        setErrorMessage('Pendaftaran diproses. Silakan periksa konfirmasi jika email verification diaktifkan, atau masuk langsung.')
      }
    } else {
      // Sign In
      setIsLoading(true)
      const res = await signInStudent(finalEmail, password)
      setIsLoading(false)

      if (res.error) {
        setErrorMessage(`Gagal masuk: ${res.error}. Periksa kembali email/NISN dan kata sandi Anda.`)
        return
      }

      if (res.user) {
        const metadata = res.user.user_metadata || {}
        const studentName = metadata.full_name || name.trim() || 'Siswa'
        const studentClass = metadata.class_name || className || 'X-1'

        const profile: StudentProfile = {
          name: studentName,
          className: studentClass,
          email: finalEmail,
          authId: res.user.id,
          isCloudAccount: true,
        }
        saveStudentProfile(profile)
        await syncScoresWithCloud()
        onComplete(profile)
      }
    }
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
              PORTAL AKSES SISWA · SINAUPY
            </div>

            <h1 className="identity-title">Selamat Datang di SinauPy!</h1>
            
            <p className="identity-desc">
              Masuk dengan akun siswa untuk menyimpan seluruh nilai dan portofolio koding ke database terpusat secara aman, atau gunakan mode tamu.
            </p>

            {/* Mode Selector Tabs */}
            {hasCloud && (
              <div className="identity-auth-tabs">
                <button
                  type="button"
                  className={`auth-tab-btn ${authMode === 'cloud' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMode('cloud')
                    setErrorMessage('')
                  }}
                >
                  🔐 Akun Siswa Terverifikasi (Cloud)
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn ${authMode === 'guest' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMode('guest')
                    setErrorMessage('')
                  }}
                >
                  ⚡ Mode Tamu (Penyimpanan Lokal)
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="identity-error-banner" role="alert">
                <IconAlert />
                <span>{errorMessage}</span>
              </div>
            )}

            {authMode === 'cloud' && hasCloud ? (
              /* Cloud Authentication Form */
              <form onSubmit={handleCloudSubmit} className="identity-form">
                <div className="cloud-action-toggle">
                  <button
                    type="button"
                    className={`action-toggle-btn ${cloudAction === 'signin' ? 'active' : ''}`}
                    onClick={() => {
                      setCloudAction('signin')
                      setErrorMessage('')
                    }}
                  >
                    Masuk Akun
                  </button>
                  <button
                    type="button"
                    className={`action-toggle-btn ${cloudAction === 'signup' ? 'active' : ''}`}
                    onClick={() => {
                      setCloudAction('signup')
                      setErrorMessage('')
                    }}
                  >
                    Daftar Akun Baru
                  </button>
                </div>

                {cloudAction === 'signup' && (
                  <>
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
                        required
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
                          required
                        >
                          <option value="">-- Pilih kelas Anda --</option>
                          {CLASS_OPTIONS.map((cls) => (
                            <option key={cls} value={cls}>
                              Kelas {cls}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-field">
                  <label htmlFor="account-id">
                    Email Siswa atau NISN / Username <span className="req-star">*</span>
                  </label>
                  <input
                    id="account-id"
                    type="text"
                    placeholder="Contoh: 12345678 atau ahmad@sekolah.id"
                    value={accountIdentifier}
                    onChange={(e) => {
                      setAccountIdentifier(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    required
                  />
                  <small className="field-hint">Bisa menggunakan NISN atau alamat email sekolah.</small>
                </div>

                <div className="form-field">
                  <label htmlFor="student-password">
                    Kata Sandi / PIN Siswa <span className="req-star">*</span>
                  </label>
                  <input
                    id="student-password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    required
                  />
                </div>

                <button type="submit" className="identity-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    'Memproses Akun...'
                  ) : cloudAction === 'signin' ? (
                    <>
                      Masuk & Buka Materi <IconArrowUpRight />
                    </>
                  ) : (
                    <>
                      Daftar Akun & Mulai Belajar <IconArrowUpRight />
                    </>
                  )}
                </button>

                <div className="identity-footnote-pill">
                  <span>🔒 Dilindungi Row Level Security (RLS) Supabase — Nilaimu hanya bisa diakses olehmu</span>
                </div>
              </form>
            ) : (
              /* Guest / Local Storage Form */
              <form onSubmit={handleGuestSubmit} className="identity-form">
                {!hasCloud && (
                  <div className="local-notice-box">
                    <span>💡 Mode Penyimpanan Lokal Aktif (database cloud Supabase belum dikonfigurasi). Nilai akan tersimpan aman di peramban ini.</span>
                  </div>
                )}

                <div className="form-field">
                  <label htmlFor="guest-full-name">
                    Nama Lengkap Siswa <span className="req-star">*</span>
                  </label>
                  <input
                    id="guest-full-name"
                    type="text"
                    placeholder="Ketik nama lengkapmu (contoh: Ahmad Rizki)"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    autoFocus
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="guest-class-select">
                    Kelas / Rombel <span className="req-star">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="guest-class-select"
                      value={className}
                      onChange={(e) => {
                        setClassName(e.target.value)
                        if (errorMessage) setErrorMessage('')
                      }}
                      required
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
                  <span>💾 Data identitas dan nilai tersimpan di penyimpanan lokal peramban ini</span>
                </div>
              </form>
            )}
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
