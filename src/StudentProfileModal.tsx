import { useState, useEffect } from 'react'
import { getStudentProfile, saveStudentProfile, type StudentProfile } from './studentData'
import { IconClose, IconSave, IconArrowRight, IconAlert } from './Icons'
import './StudentProfileModal.css'

type StudentProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave?: (profile: StudentProfile) => void
  isOnboarding?: boolean
}

const CLASS_SUGGESTIONS = ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7']

export default function StudentProfileModal({
  isOpen,
  onClose,
  onSave,
  isOnboarding = false,
}: StudentProfileModalProps) {
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupMembers, setGroupMembers] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      const current = getStudentProfile()
      setName(current.name || '')
      setClassName(current.className || '')
      setGroupName(current.groupName || '')
      setGroupMembers(current.groupMembers || '')
      setErrorMessage('')
    }
  }, [isOpen])

  // Accessibility: Escape key handling
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap siswa terlebih dahulu.')
      return
    }
    if (!className.trim()) {
      setErrorMessage('Silakan pilih atau masukkan kelas siswa.')
      return
    }

    const updated: StudentProfile = {
      name: name.trim(),
      className: className.trim(),
      groupName: groupName.trim(),
      groupMembers: groupMembers.trim(),
    }
    saveStudentProfile(updated)
    if (onSave) onSave(updated)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="modal-header">
          <div>
            <span className="modal-badge">
              {isOnboarding ? 'LANGKAH AWAL BELAJAR' : 'IDENTITAS SISWA'}
            </span>
            <h3 id="profile-modal-title">
              {isOnboarding ? 'Sebelum Mulai Belajar di SinauPy' : 'Data Siswa & Kelas'}
            </h3>
          </div>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Tutup modal">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-description">
            {isOnboarding
              ? 'Selamat datang di SinauPy! Silakan lengkapi nama dan kelas Anda untuk memulai materi pembelajaran. Data disimpan lokal di peramban untuk mencatat progres dan hasil asesmen tanpa perlu login/kata sandi.'
              : 'Data diri disimpan secara lokal di peramban ini untuk mencatat hasil asesmen dan pencetakan lembar nilai. Tidak memerlukan kata sandi atau akun masuk.'}
          </p>

          {errorMessage && (
            <div className="modal-error-banner" role="alert">
              <IconAlert />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="student-name">
              Nama Lengkap Siswa <span className="required-star">*</span>
            </label>
            <input
              id="student-name"
              type="text"
              placeholder="Contoh: Muhammad Rizky Pratama"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-class">
              Kelas <span className="required-star">*</span>
            </label>
            <input
              id="student-class"
              type="text"
              placeholder="Contoh: X-1, X MIPA 2, atau X RPL 1"
              value={className}
              onChange={(e) => {
                setClassName(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              required
            />
            <div className="class-suggestions">
              <span className="suggestion-label">Pilih Cepat:</span>
              <div className="suggestion-pills">
                {CLASS_SUGGESTIONS.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    className={`suggestion-pill ${className === cls ? 'active' : ''}`}
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

          <div className="form-divider">
            <span>Opsional: Untuk Tugas Kelompok</span>
          </div>

          <div className="form-group">
            <label htmlFor="group-name">Nama Kelompok</label>
            <input
              id="group-name"
              type="text"
              placeholder="Contoh: Kelompok Algoritma 1"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="group-members">Daftar Anggota Kelompok</label>
            <input
              id="group-members"
              type="text"
              placeholder="Contoh: Rizky (Programmer), Siti (Analis), Budi (Tester)"
              value={groupMembers}
              onChange={(e) => setGroupMembers(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-save">
              {isOnboarding ? (
                <>
                  Mulai Belajar Sekarang <IconArrowRight />
                </>
              ) : (
                <>
                  <IconSave /> Simpan Identitas
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

