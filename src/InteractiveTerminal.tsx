import React from 'react'
import { IconClose } from './Icons'
import type { ExecutionStatus, TerminalChunk } from './pythonRuntime'
import './InteractiveTerminal.css'

export type InteractiveTerminalProps = {
  title?: string
  chunks: TerminalChunk[]
  status: ExecutionStatus
  isWaitingForInput: boolean
  currentInputValue: string
  onInputChange: (val: string) => void
  onSubmitInput: () => void
  onStop: () => void
  onClear: () => void
  terminalBodyRef: React.RefObject<HTMLDivElement | null>
  activeInputRef: React.RefObject<HTMLInputElement | null>
  welcomeMessage?: string
  containerClassName?: string
}

export default function InteractiveTerminal({
  title = 'TERMINAL KONSOL PYTHON',
  chunks,
  status,
  isWaitingForInput,
  currentInputValue,
  onInputChange,
  onSubmitInput,
  onStop,
  onClear,
  terminalBodyRef,
  activeInputRef,
  welcomeMessage,
  containerClassName = '',
}: InteractiveTerminalProps) {
  const isRunning = status === 'running' || status === 'waiting_input' || status === 'loading'

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmitInput()
    }
  }

  return (
    <div className={`interactive-terminal-container ${containerClassName}`}>
      {/* Top Header */}
      <div className="terminal-top-header">
        <div className="terminal-header-left">
          <span className="terminal-title">{title}</span>
          <span className={`terminal-status-badge status-${status}`}>
            <span className="status-indicator-dot" />
            {status === 'idle' && 'Siap Dijalankan'}
            {status === 'loading' && 'Memuat Runtime...'}
            {status === 'running' && 'Sedang Berjalan...'}
            {status === 'waiting_input' && 'Menunggu Input Pengguna...'}
            {status === 'finished' && 'Selesai'}
            {status === 'stopped' && 'Dihentikan'}
            {status === 'error' && 'Ada Kesalahan (Error)'}
          </span>
        </div>

        <div className="terminal-header-actions">
          {(status === 'running' || status === 'waiting_input') && (
            <button
              type="button"
              className="terminal-btn-stop"
              onClick={onStop}
              title="Hentikan program (Stop)"
            >
              <IconClose /> Hentikan
            </button>
          )}
          <button
            type="button"
            className="terminal-btn-clear"
            onClick={onClear}
            title="Bersihkan riwayat terminal"
          >
            Bersihkan
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div
        className="terminal-console-body"
        ref={terminalBodyRef}
        onClick={() => {
          if (isWaitingForInput) {
            activeInputRef.current?.focus()
          }
        }}
      >
        {chunks.length === 0 && !isWaitingForInput && (
          <div className="terminal-welcome-screen">
            <p className="welcome-title">
              {welcomeMessage || '🐍 Terminal Konsol SinauPy Siap Digunakan'}
            </p>
            <p className="welcome-sub">
              Tekan tombol <strong>"Jalankan Program"</strong> untuk mengeksekusi kode Python.
            </p>
            <div className="welcome-instructions">
              <div className="inst-row">
                <span className="inst-badge">Interaktif</span>
                <span>Prompt <code>input()</code> akan langsung tampil di terminal ini.</span>
              </div>
              <div className="inst-row">
                <span className="inst-badge">Pengetikan Langsung</span>
                <span>Ketik jawabanmu tepat di baris terminal lalu tekan <strong>Enter ↵</strong>.</span>
              </div>
              <div className="inst-row">
                <span className="inst-badge">Real-Time</span>
                <span>Hasil <code>print()</code> dicetak secara bertahap sesuai alur eksekusi sebenarnya.</span>
              </div>
            </div>
          </div>
        )}

        {/* Streamed Output Log */}
        <div className="terminal-stream-log">
          {chunks.map((chunk) => (
            <span key={chunk.id} className={`stream-chunk chunk-${chunk.type}`}>
              {chunk.text}
            </span>
          ))}

          {/* Active Prompt & Inline Input Row */}
          {isWaitingForInput && (
            <div className="terminal-active-input-row">
              <span className="terminal-cursor-indicator">&gt;&gt;&gt;&nbsp;</span>
              <input
                ref={activeInputRef}
                type="text"
                className="terminal-active-input-field"
                value={currentInputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik jawaban di sini lalu tekan Enter ↵"
                autoFocus
              />
              <button
                type="button"
                className="terminal-input-submit-btn"
                onClick={onSubmitInput}
                title="Kirim jawaban ke Python (Enter)"
              >
                Enter ↵
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Console Footer Banner */}
      <div className="terminal-console-footer">
        <span className="terminal-footer-hint">
          {isWaitingForInput ? (
            <strong className="hint-waiting">
              ⚠️ Program sedang menunggu input di atas. Ketik nilai lalu tekan Enter ↵
            </strong>
          ) : isRunning ? (
            'Sedang menjalankan program Python...'
          ) : (
            'Terminal interaktif WebAssembly — Mendukung input bertahap, loop, casting int/float, dan traceback.'
          )}
        </span>
      </div>
    </div>
  )
}

