import { useState, useRef, useEffect, useCallback } from 'react'
import {
  getPyodide,
  PYTHON_INTERACTIVE_RUNNER,
  type ExecutionStatus,
  type TerminalChunk,
} from './pythonRuntime'
import InteractiveTerminal from './InteractiveTerminal'
import PythonCodeEditor from './PythonCodeEditor'
import {
  IconArrowLeft,
  IconPlay,
  IconSave,
  IconDownload,
  IconTrash,
  IconLock,
  IconCheck,
  IconClose,
  IconCode,
} from './Icons'
import './CompilerPage.css'

type CompilerPageProps = {
  onBackHome: () => void
}

const CODE_TEMPLATES = [
  {
    name: 'Kertas Kosong (Editor Bersih)',
    code: '',
  },
  {
    name: 'Input dan Output Dinamis (Interaktif)',
    code: `# Contoh interaksi input dan output langsung di terminal
nama = input("Masukkan nama: ")
angka1 = int(input("Masukkan angka pertama: "))
angka2 = int(input("Masukkan angka kedua: "))

print("Halo,", nama)
print("Hasil penjumlahan:", angka1 + angka2)
`,
  },
  {
    name: 'Struktur Percabangan (If-Elif-Else)',
    code: `# Sistem evaluasi nilai asesmen interaktif
nama = input("Nama siswa: ")
nilai = int(input("Masukkan nilai ujian (0-100): "))

if nilai >= 85:
    predikat = "Sangat Baik (A)"
elif nilai >= 75:
    predikat = "Tuntas KKM (B)"
elif nilai >= 60:
    predikat = "Cukup (C)"
else:
    predikat = "Perlu Bimbingan Remedial (D)"

print(f"Hasil Evaluasi {nama}:")
print(f"Nilai: {nilai} -> Predikat: {predikat}")
`,
  },
  {
    name: 'Perulangan Interaktif (Kasir Koperasi)',
    code: `# Menghitung total belanja dengan input berulang
jumlah_barang = int(input("Berapa jenis barang yang dibeli? "))
total_belanja = 0

for i in range(jumlah_barang):
    nama_item = input(f"Nama barang ke-{i + 1}: ")
    harga = int(input(f"Harga {nama_item}: Rp"))
    total_belanja += harga

print("=" * 35)
print(f"Total pembayaran: Rp{total_belanja:,}")
`,
  },
  {
    name: 'Perulangan For dan Deret Angka',
    code: `# Menghitung deret bilangan genap
batas = int(input("Masukkan batas angka maksimal: "))
total = 0

print(f"Bilangan genap dari 1 sampai {batas}:")
for i in range(1, batas + 1):
    if i % 2 == 0:
        print(f" - {i}")
        total += i

print(f"Jumlah total = {total}")
`,
  },
  {
    name: 'Struktur Data List dan Iterasi',
    code: `# Mengelola inventaris lab komputer
perangkat = ["Monitor", "Keyboard", "Mouse", "Headset"]
jumlah = [24, 25, 25, 12]

print("=== INVENTARIS LAB KOMPUTER ===")
for i in range(len(perangkat)):
    print(f"{i + 1}. {perangkat[i]}: {jumlah[i]} unit")

print(f"Total item terdaftar: {sum(jumlah)} unit")
`,
  },
  {
    name: 'Fungsi Modular (def) & Input',
    code: `# Fungsi modular hitung diskon koperasi sekolah
def hitung_diskon(total_belanja):
    if total_belanja >= 100000:
        persen = 15
    elif total_belanja >= 50000:
        persen = 10
    else:
        persen = 0
    potongan = total_belanja * (persen / 100)
    bayar = total_belanja - potongan
    return persen, potongan, bayar

nama_pembeli = input("Nama pembeli: ")
belanja = int(input("Total belanja: Rp"))

p, pot, bayar = hitung_diskon(belanja)
print(f"\\nStruk Belanja Koperasi — {nama_pembeli}")
print(f"Diskon {p}%: Hemat Rp{pot:,.0f}")
print(f"Total yang harus dibayar: Rp{bayar:,.0f}")
`,
  },
]

const COMPILER_STORAGE_KEY = 'sinaupy_compiler_draft'

export default function CompilerPage({ onBackHome }: CompilerPageProps) {
  const [code, setCode] = useState(() => {
    try {
      const saved =
        localStorage.getItem(COMPILER_STORAGE_KEY) ||
        localStorage.getItem('pythonlab_compiler_draft')
      if (saved) return saved
    } catch {
      // ignore
    }
    return '' // Default kertas kosong (blank paper)
  })

  // Execution and Terminal State
  const [terminalChunks, setTerminalChunks] = useState<TerminalChunk[]>([])
  const [status, setStatus] = useState<ExecutionStatus>('idle')
  const [isWaitingForInput, setIsWaitingForInput] = useState(false)
  const [currentInputValue, setCurrentInputValue] = useState('')
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [pasteWarning, setPasteWarning] = useState<string | null>(null)

  const warningTimeoutRef = useRef<number | null>(null)
  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const activeInputRef = useRef<HTMLInputElement>(null)
  const pendingInputResolverRef = useRef<((val: string) => void) | null>(null)
  const stopRequestedRef = useRef(false)

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

  // Save code draft to local storage
  useEffect(() => {
    try {
      localStorage.setItem(COMPILER_STORAGE_KEY, code)
    } catch {
      // ignore
    }
  }, [code])

  // Paste Warning
  const triggerPasteWarning = () => {
    setPasteWarning(
      'Mode pengetikan mandiri aktif. Fitur tempel (paste) dinonaktifkan untuk melatih pemahaman sintaks dan memori otot koding.'
    )
    if (warningTimeoutRef.current) {
      window.clearTimeout(warningTimeoutRef.current)
    }
    warningTimeoutRef.current = window.setTimeout(() => {
      setPasteWarning(null)
    }, 4500)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRequestedRef.current = true
      if (pendingInputResolverRef.current) {
        pendingInputResolverRef.current('')
      }
    }
  }, [])

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

  // Handle Stop Program
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
  }, [appendTerminal])

  // Clear Terminal Output
  const handleClearTerminal = () => {
    if (status === 'running' || status === 'waiting_input') {
      handleStop()
    }
    setTerminalChunks([])
    setStatus('idle')
    setIsWaitingForInput(false)
    setCurrentInputValue('')
  }

  // Run Code with Interactive Terminal Bridge
  const runCode = async () => {
    if (status === 'running' || status === 'waiting_input') return

    stopRequestedRef.current = false
    setStatus('loading')
    setIsWaitingForInput(false)
    setCurrentInputValue('')

    setTerminalChunks([
      {
        id: `start-${Date.now()}`,
        text: '=== Memulai Program SinauPy (Python 3.12 WebAssembly) ===\n',
        type: 'system',
      },
    ])

    window.sinaupyWriteTerminal = (text: string, isStderr: boolean) => {
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
        setStatus((prev) => (prev === 'error' ? 'error' : 'finished'))
        appendTerminal('\n=== Program Selesai Dieksekusi ===\n', 'system')
      }
    } catch (runErr) {
      if (!stopRequestedRef.current) {
        setStatus('error')
        const msg = runErr instanceof Error ? runErr.message : String(runErr)
        appendTerminal(`\n[Kesalahan Sistem Pyodide]: ${msg}\n`, 'stderr')
      }
    } finally {
      setIsWaitingForInput(false)
      pendingInputResolverRef.current = null
    }
  }

  const handleSelectTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CODE_TEMPLATES.find((t) => t.name === e.target.value)
    if (selected) {
      setCode(selected.code)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'program_sinaupy.py'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClearEditor = () => {
    if (confirm('Kosongkan editor koding?')) {
      setCode('')
    }
  }

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(COMPILER_STORAGE_KEY, code)
      setSaveStatus('Draf kode berhasil disimpan di browser.')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch {
      setSaveStatus('Gagal menyimpan draf.')
    }
  }

  const lineCount = code ? code.split('\n').length : 1
  const isRunning = status === 'running' || status === 'waiting_input' || status === 'loading'

  return (
    <section className="compiler-page" aria-labelledby="compiler-title">
      {/* Top Bar with Navigation & Meta Badges */}
      <div className="compiler-top-bar">
        <a
          className="back-home-link"
          href="#beranda"
          onClick={(e) => {
            e.preventDefault()
            onBackHome()
          }}
        >
          <IconArrowLeft /> Kembali ke Beranda
        </a>

        <div className="compiler-meta-badges">
          <span className="compiler-badge-env">Python 3.12 (Pyodide WebAssembly)</span>
          <span className="anti-paste-badge">
            <IconLock /> Ketik Mandiri
          </span>
        </div>
      </div>

      {/* Main Header Banner */}
      <header className="compiler-header">
        <div className="compiler-title-group">
          <span className="section-kicker">RUANG KODING BEBAS · ONLINE PYTHON IDE</span>
          <h1 id="compiler-title">Compiler Python SinauPy</h1>
          <p className="compiler-sub">
            Lingkungan koding Python modern dengan syntax highlighting dan terminal konsol interaktif langsung di peramban.
            Tulis kodemu, jalankan program, dan masukkan jawaban fungsi <code>input()</code> langsung di baris terminal seperti pada Online Python IDE.
          </p>
        </div>
      </header>

      {/* Warning & Success Banners */}
      {pasteWarning && (
        <div className="paste-warning-banner" role="alert">
          <div className="paste-warning-icon">
            <IconClose />
          </div>
          <div className="paste-warning-text">{pasteWarning}</div>
          <button
            type="button"
            className="paste-warning-close"
            onClick={() => setPasteWarning(null)}
          >
            <IconClose />
          </button>
        </div>
      )}

      {saveStatus && (
        <div className="save-status-banner">
          <IconCheck />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Top IDE Toolbar */}
      <div className="compiler-toolbar">
        <div className="toolbar-left">
          {/* Main Run Button */}
          <button
            type="button"
            className="compiler-toolbar-run-btn"
            onClick={() => void runCode()}
            disabled={isRunning}
            title="Jalankan program Python (Run)"
          >
            <IconPlay />
            <span>
              {status === 'loading'
                ? 'Memuat Runtime…'
                : status === 'waiting_input'
                ? 'Menunggu Input…'
                : isRunning
                ? 'Sedang Berjalan…'
                : 'Run'}
            </span>
          </button>

          {/* Stop Button */}
          {isRunning && (
            <button
              type="button"
              className="compiler-toolbar-stop-btn"
              onClick={handleStop}
              title="Hentikan eksekusi kode (Stop)"
            >
              <IconClose />
              <span>Stop</span>
            </button>
          )}

          {/* Clear Terminal Button */}
          <button
            type="button"
            className="compiler-toolbar-btn"
            onClick={handleClearTerminal}
            title="Bersihkan riwayat terminal konsol"
          >
            <IconTrash />
            <span>Clear Terminal</span>
          </button>

          {/* Template Selector */}
          <div className="toolbar-template-picker">
            <label htmlFor="template-select" className="template-label">
              Template:
            </label>
            <select
              id="template-select"
              className="template-select"
              onChange={handleSelectTemplate}
              defaultValue=""
            >
              <option value="" disabled>
                Pilih contoh program...
              </option>
              {CODE_TEMPLATES.map((tmpl) => (
                <option key={tmpl.name} value={tmpl.name}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            className="tool-btn"
            onClick={handleSaveDraft}
            title="Simpan draf ke peramban"
          >
            <IconSave /> Simpan Draf
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={handleDownload}
            title="Unduh berkas program .py"
          >
            <IconDownload /> Unduh .py
          </button>
          <button
            type="button"
            className="tool-btn tool-btn-danger"
            onClick={handleClearEditor}
            title="Bersihkan isi editor kode"
          >
            <IconTrash /> Reset Editor
          </button>

          {/* Execution Status Badge */}
          <span className={`toolbar-status-badge status-${status}`}>
            <span className="status-indicator-dot" />
            {status === 'idle' && 'Siap'}
            {status === 'loading' && 'Memuat'}
            {status === 'running' && 'Menjalankan'}
            {status === 'waiting_input' && 'Menunggu Input'}
            {status === 'finished' && 'Selesai'}
            {status === 'stopped' && 'Dihentikan'}
            {status === 'error' && 'Error'}
          </span>
        </div>
      </div>

      {/* Main Workspace (Split Grid: Editor on Left, Interactive Terminal on Right) */}
      <div className="compiler-workspace">
        {/* Left: Code Editor Container */}
        <div className="compiler-editor-container">
          <div className="editor-top-bar">
            <div className="editor-tab-active">
              <IconCode className="editor-tab-icon" />
              <span className="editor-filename">main.py</span>
            </div>
            <span className="editor-stats">
              {lineCount} baris • {code.length} karakter
            </span>
          </div>

          <div className="editor-wrapper">
            <PythonCodeEditor
              value={code}
              onChange={setCode}
              placeholder="# Tulis atau ketik kode Python kamu di sini..."
              height="520px"
              minHeight="520px"
              maxHeight="520px"
              onPasteBlock={triggerPasteWarning}
              ariaLabel="Editor kode Python SinauPy"
            />
          </div>

          <div className="compiler-editor-footer">
            <span className="editor-tip">
              Bahasa: <strong>Python 3.12</strong> • UTF-8 • Tab: 4 Spasi
            </span>
            <span className="editor-mode-badge">Editor Mode: Standar IDE</span>
          </div>
        </div>

        {/* Right: Unified Interactive Terminal Console */}
        <div className="compiler-terminal-column">
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
            containerClassName="compiler-terminal-container"
          />
          <div className="compiler-terminal-footer">
            <span className="terminal-footer-info">
              Standard Streams: <strong>stdin / stdout / stderr</strong>
            </span>
            <span className="terminal-footer-engine">Pyodide WebAssembly Engine</span>
          </div>
        </div>
      </div>
    </section>
  )
}
