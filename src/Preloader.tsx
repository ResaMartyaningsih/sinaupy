import { useEffect, useState } from 'react'
import { IconPythonLogo, IconBrand } from './Icons'
import './Preloader.css'

type PreloaderProps = {
  onComplete: () => void
}

const TERMINAL_LOGS = [
  '> initializing environment...',
  '> loading learning modules...',
  '> preparing your workspace...',
  '> ready to code!',
]

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const duration = 1800 // ~1.8s
    const intervalTime = 30
    const totalSteps = duration / intervalTime
    let step = 0

    const timer = setInterval(() => {
      step++
      const currentProgress = Math.min(100, Math.round((step / totalSteps) * 100))
      setProgress(currentProgress)

      if (currentProgress >= 25 && currentProgress < 50) {
        setLogIndex(1)
      } else if (currentProgress >= 50 && currentProgress < 85) {
        setLogIndex(2)
      } else if (currentProgress >= 85) {
        setLogIndex(3)
      }

      if (step >= totalSteps) {
        clearInterval(timer)
        setIsFadingOut(true)
        setTimeout(() => {
          onComplete()
        }, 350)
      }
    }, intervalTime)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={`preloader-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <header className="preloader-header">
        <div className="preloader-brand">
          <IconBrand className="preloader-brand-icon" />
          <span className="preloader-brand-name">Sinau<span>Py</span></span>
        </div>
      </header>

      <main className="preloader-center">
        <div className="preloader-mascot-wrap">
          <IconPythonLogo size={100} className="preloader-python-icon" />
          <div className="floating-shape square-blue-1" />
          <div className="floating-shape square-yellow-1" />
          <div className="floating-shape square-blue-2" />
        </div>

        <h1 className="preloader-title">SinauPy</h1>
        <p className="preloader-tagline">Python untuk Masa Depanmu</p>

        <div className="preloader-terminal">
          {TERMINAL_LOGS.slice(0, logIndex + 1).map((log, idx) => (
            <div key={idx} className="terminal-line">
              {log}
            </div>
          ))}
        </div>

        <div className="preloader-progress-wrap">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-percentage">{progress}%</span>
        </div>
      </main>

      <footer className="preloader-footer">
        <span className="version-tag">SinauPy v1.0.0</span>
        <span className="motto-tag">Learn • Practice • Build</span>
      </footer>
    </div>
  )
}

