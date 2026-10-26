import { useState, useRef, useEffect, useCallback } from 'react'
import { IconPlay, IconLock, IconAlert, IconClose, IconTrash, IconCode } from './Icons'
import InteractiveTerminal from './InteractiveTerminal'
import PythonCodeEditor from './PythonCodeEditor'
import {
  getPyodide,
  PYTHON_INTERACTIVE_RUNNER,
  type ExecutionStatus,
  type TerminalChunk,
} from './pythonRuntime'
import './CodePlayground.css'

export { getPyodide } from './pythonRuntime'

type CodePlaygroundProps = {
  title: string
  instructions: string
  hints?: string[]
  initialCode?: string
  initialInput?: string
  onRun?: (code: string, output: string, success: boolean) => void
}

export default function CodePlayground({
  title,
  instructions,
  hints = [],
  initialCode = '',
  onRun,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [terminalChunks, setTerminalChunks] = useState<TerminalChunk[]>([])
  const [status, setStatus] = useState<ExecutionStatus>('idle')
  const [isWaitingForInput, setIsWaitingForInput] = useState(false)
  const [currentInputValue, setCurrentInputValue] = useState('')
  const [pasteWarning, setPasteWarning] = useState<string | null>(null)

  const warningTimeoutRef = useRef<number | null>(null)
  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const activeInputRef = useRef<HTMLInputElement>(null)
  const pendingInputResolverRef = useRef<((val: string) => void) | null>(null)
  const stopRequestedRef = useRef(false)
  const fullOutputRef = useRef('')

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  // Append stream chunks safely
  const appendTerminal = useCallback(
    (text: string, type: 'stdout' | 'stderr' | 'input' | 'system') => {
      setTerminalChunks((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].type === type && type === 'stdout') {
          const last = prev[prev.length - 1]
          return [...prev.slice(0, -1), { ...last, text: last.text + text }]
        }
        return [...prev, { id: `${Date.now()}-${Math.random()}`, text, type }]
      })
    },
    []
  )

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalChunks, isWaitingForInput])

  // Focus active input when input() is requested
  useEffect(() => {
    if (isWaitingForInput) {
      const timer = setTimeout(() => {
        activeInputRef.current?.focus()
      }, 30)
      return () => clearTimeout(timer)
    }
  }, [isWaitingForInput])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRequestedRef.current = true
      if (pendingInputResolverRef.current) {
        pendingInputResolverRef.current('')
      }
    }
  }, [])

  const triggerPasteWarning = () => {
    setPasteWarning(
      'Mode pengetikan mandiri aktif. Fitur tempel (paste) dinonaktifkan agar siswa melatih pemahaman dan memori otot sintaks.'
    )
    if (warningTimeoutRef.current) {
      window.clearTimeout(warningTimeoutRef.current)
    }
    warningTimeoutRef.current = window.setTimeout(() => {
      setPasteWarning(null)
    }, 4500)
  }

  // Submit terminal input
  const submitTerminalInput = () => {
    if (!isWaitingForInput || !pendingInputResolverRef.current) return
    const val = currentInputValue
    appendTerminal(val + '\n', 'input')
    setCurrentInputValue('')
    const resolver = pendingInputResolverRef.current
    pendingInputResolverRef.current = null
    setIsWaitingForInput(false)
    setStatus('running')
    resolver(val)
  }

  // Handle Stop
  const handleStop = useCallback(() => {
    stopRequestedRef.current = true
    setStatus('stopped')

    if (pendingInputResolverRef.current) {
      appendTerminal('\n[Input dibatalkan — Program dihentikan]\n', 'system')
      const resolver = pendingInputResolverRef.current
      pendingInputResolverRef.current = null
      setIsWaitingForInput(false)
      resolver('')
    }

    if (onRun) {
      onRun(code, fullOutputRef.current, false)
    }
  }, [appendTerminal, code, onRun])

  // Clear Terminal
  const handleClearTerminal = () => {
    if (status === 'running' || status === 'waiting_input') {
      handleStop()
    }
    setTerminalChunks([])
    setStatus('idle')
    setIsWaitingForInput(false)
    setCurrentInputValue('')
    fullOutputRef.current = ''
  }

  // Run Code with Interactive Terminal Bridge
  const runCode = async () => {
    if (status === 'running' || status === 'waiting_input') return

    stopRequestedRef.current = false
    setStatus('loading')
    setIsWaitingForInput(false)
    setCurrentInputValue('')
    fullOutputRef.current = ''

    setTerminalChunks([
      {
        id: `start-${Date.now()}`,
        text: '=== Memulai Program SinauPy (Python 3.12 WebAssembly) ===\n',
        type: 'system',
      },
    ])

    window.sinaupyWriteTerminal = (text: string, isStderr: boolean) => {
      fullOutputRef.current += text
      appendTerminal(text, isStderr ? 'stderr' : 'stdout')
      if (isStderr && text.includes('Error')) {
        setStatus('error')
      }
    }

    window.sinaupyIsStopRequested = () => {
      return stopRequestedRef.current
    }

    window.sinaupyRequestInput = (_promptText: string): Promise<string> => {
      return new Promise<string>((resolve) => {
        if (stopRequestedRef.current) {
          resolve('')
          return
        }
        setIsWaitingForInput(true)
        setStatus('waiting_input')
        pendingInputResolverRef.current = resolve
      })
    }

    try {
      const pyodide = await getPyodide()

      if (stopRequestedRef.current) {
        setStatus('stopped')
        return
      }

      setStatus('running')

      await pyodide.runPythonAsync(PYTHON_INTERACTIVE_RUNNER)

      pyodide.globals.set('_user_code_raw', code)
      await pyodide.runPythonAsync('await _sinaupy_run_user_code(_user_code_raw)')

      if (!stopRequestedRef.current) {
        const hasErr = fullOutputRef.current.includes('Error:') || status === 'error'
        setStatus(hasErr ? 'error' : 'finished')
        appendTerminal('\n=== Program Selesai Dieksekusi ===\n', 'system')
        if (onRun) {
          onRun(code, fullOutputRef.current || '(Program selesai tanpa output)', !hasErr)
        }
      }
    } catch (runErr) {
      if (!stopRequestedRef.current) {
        setStatus('error')
        const msg = runErr instanceof Error ? runErr.message : String(runErr)
        appendTerminal(`\n[Kesalahan Sistem Pyodide]: ${msg}\n`, 'stderr')
        if (onRun) {
          onRun(code, fullOutputRef.current + `\n${msg}`, false)
        }
      }
    } finally {
      setIsWaitingForInput(false)
      pendingInputResolverRef.current = null
    }
  }

  const isRunning = status === 'running' || status === 'waiting_input' || status === 'loading'
  const lineCount = code ? code.split('\n').length : 1

  return (
    <section className="code-playground" aria-label={title}>
      <div className="playground-heading">
        <div>
          <span className="playground-kicker">PRAKTIK MANDIRI</span>
          <h4>{title}</h4>
        </div>
        <div className="playground-badges">
          <span className="anti-paste-badge" title="Salin-tempel dinonaktifkan agar siswa mengetik sendiri">
            <IconLock />
            Ketik Mandiri
          </span>
          <span className="playground-language">Python 3.12</span>
        </div>
      </div>

      <p className="playground-instructions">{instructions}</p>

      {hints.length > 0 && (
        <div className="playground-hints">
          <strong>Petunjuk pengerjaan:</strong>
          <ol>
            {hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ol>
        </div>
      )}

      {pasteWarning && (
        <div className="paste-warning-banner" role="alert">
          <div className="paste-warning-icon">
            <IconAlert />
          </div>
          <div className="paste-warning-text">{pasteWarning}</div>
          <button
            type="button"
            className="paste-warning-close"
            onClick={() => setPasteWarning(null)}
            aria-label="Tutup peringatan"
          >
            <IconClose />
          </button>
        </div>
      )}

      {/* Online Python IDE Frame */}
      <div className="playground-ide-frame">
        {/* Top IDE Toolbar */}
        <div className="playground-ide-toolbar">
          <div className="ide-toolbar-left">
            <div className="ide-file-tab active">
              <IconCode className="tab-py-icon" />
              <span className="tab-filename">main.py</span>
              <span className="tab-meta">{lineCount} baris</span>
            </div>
          </div>

          <div className="ide-toolbar-right">
            <button
              className="ide-run-btn"
              type="button"
              onClick={() => void runCode()}
              disabled={isRunning}
              title="Jalankan program Python (Run)"
            >
              <IconPlay />
              <span>
                {status === 'loading'
                  ? 'Memuat…'
                  : status === 'waiting_input'
                  ? 'Menunggu Input…'
                  : isRunning
                  ? 'Berjalan…'
                  : 'Run'}
              </span>
            </button>

            {isRunning && (
              <button
                className="ide-stop-btn"
                type="button"
                onClick={handleStop}
                title="Hentikan eksekusi kode (Stop)"
              >
                <IconClose />
                <span>Stop</span>
              </button>
            )}

            <button
              className="ide-clear-btn"
              type="button"
              onClick={handleClearTerminal}
              title="Bersihkan riwayat terminal konsol"
            >
              <IconTrash />
              <span>Clear</span>
            </button>

            <span className={`ide-status-pill status-${status}`}>
              <span className="status-indicator-dot" />
              {status === 'idle' && 'Siap'}
              {status === 'loading' && 'Memuat'}
              {status === 'running' && 'Menjalankan'}
              {status === 'waiting_input' && 'Input'}
              {status === 'finished' && 'Selesai'}
              {status === 'stopped' && 'Dihentikan'}
              {status === 'error' && 'Error'}
            </span>
          </div>
        </div>

        {/* CodeMirror Python Editor */}
        <div className="playground-editor-pane">
          <PythonCodeEditor
            value={code}
            onChange={setCode}
            placeholder="# Ketik kode program Python di sini..."
            minHeight="220px"
            onPasteBlock={triggerPasteWarning}
            ariaLabel={`Editor kode untuk ${title}`}
          />
        </div>

        {/* Integrated Terminal Console */}
        <div className="playground-terminal-pane">
          <InteractiveTerminal
            title="TERMINAL KONSOL PYTHON"
            chunks={terminalChunks}
            status={status}
            isWaitingForInput={isWaitingForInput}
            currentInputValue={currentInputValue}
            onInputChange={setCurrentInputValue}
            onSubmitInput={submitTerminalInput}
            onStop={handleStop}
            onClear={handleClearTerminal}
            terminalBodyRef={terminalBodyRef}
            activeInputRef={activeInputRef}
            welcomeMessage="🐍 Terminal Interaktif Siap Digunakan"
          />
        </div>
      </div>
    </section>
  )
}

