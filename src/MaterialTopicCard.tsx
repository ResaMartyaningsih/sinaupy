import { useState, useEffect, useMemo } from 'react'
import CodePlayground from './CodePlayground'
import { materialCategories, type MaterialTopic } from './materialsData'
import { IconCopy, IconCheck, IconAlert, IconBrain, IconBook, IconCode } from './Icons'

type MaterialTopicCardProps = {
  topic: MaterialTopic
  number: string
  categoryTitle?: string
  onOpenCategoryDiscovery?: () => void
}

async function copyCode(code: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(code)
      return true
    } catch {
      // Fallback
    }
  }

  const temporaryInput = document.createElement('textarea')
  temporaryInput.value = code
  temporaryInput.setAttribute('readonly', '')
  temporaryInput.style.position = 'fixed'
  temporaryInput.style.opacity = '0'
  document.body.appendChild(temporaryInput)
  temporaryInput.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(temporaryInput)
  return copied
}

function generatePlausibleOptions(expected: string, code: string): string[] {
  const options = [expected]

  if (/^\d+$/.test(expected)) {
    const num = parseInt(expected, 10)
    options.push(String(num + 1))
    options.push(String(Math.max(0, num - 1)))
    options.push(`"${expected}"`)
  } else if (/^(True|False)$/i.test(expected)) {
    options.push(expected.toLowerCase() === 'true' ? 'False' : 'True')
    options.push('None')
    options.push('Error: SyntaxError')
  } else if (/^[a-z]+$/i.test(expected) && ['str', 'int', 'float', 'bool', 'list'].includes(expected)) {
    const types = ['str', 'int', 'float', 'bool', 'list'].filter((t) => t !== expected)
    options.push(...types.slice(0, 3))
  } else {
    if (code.includes('print(')) {
      const match = code.match(/print\((.+)\)/)
      if (match && match[1] && match[1] !== expected && !match[1].includes('"') && !match[1].includes("'")) {
        options.push(match[1])
      }
    }
    const stripped = expected.replace(/[!.,]/g, '')
    if (stripped && stripped !== expected) {
      options.push(stripped)
    }
    options.push('Program berhenti dengan Error')
    options.push('None')
  }

  const fallbackOutputs = materialCategories
    .flatMap((c) => c.topics)
    .flatMap((t) => t.examples)
    .map((e) => e.output[0])
    .filter((o) => o && o !== expected && !options.includes(o))

  const unique = Array.from(new Set([...options, ...fallbackOutputs])).slice(0, 4)

  const seed = expected.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return unique.sort((a, b) => {
    const hashA = (a.length * 31 + seed) % 17
    const hashB = (b.length * 31 + seed) % 17
    return hashA - hashB
  })
}

export default function MaterialTopicCard({
  topic,
  number,
  categoryTitle,
  onOpenCategoryDiscovery,
}: MaterialTopicCardProps) {
  const [copyStatus, setCopyStatus] = useState('')
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)

  useEffect(() => {
    setQuizAnswer(null)
  }, [topic.title, number])

  const handleCopy = async (code: string) => {
    const copied = await copyCode(code)
    setCopyStatus(copied ? 'Kode berhasil disalin' : 'Gagal menyalin kode')
    window.setTimeout(() => setCopyStatus(''), 2200)
  }

  const firstExample = topic.examples[0]
  const expectedOutput = useMemo(() => {
    if (!firstExample) return ''
    if (firstExample.inputSample) {
      return firstExample.output[firstExample.output.length - 1]
    }
    return firstExample.output[0]
  }, [firstExample])

  const quizOptions = useMemo(() => {
    return generatePlausibleOptions(expectedOutput, firstExample ? firstExample.code : '')
  }, [expectedOutput, firstExample])

  return (
    <article className="topic-card" aria-label={`Sub-Materi: ${topic.title}`}>
      {/* Top Header Strip with Crisp Badges */}
      <div className="topic-card-top">
        <div className="topic-badge-group">
          <span className="topic-number-badge">Sub-Materi #{number}</span>
          {categoryTitle && <span className="topic-cat-badge">{categoryTitle}</span>}
        </div>

        {onOpenCategoryDiscovery && (
          <button
            type="button"
            className="btn-quick-discovery"
            onClick={onOpenCategoryDiscovery}
            title="Buka Unit Aktivitas Discovery Learning untuk 1 Materi Bab ini"
          >
            <IconBrain /> Unit Inkuiri Bab Ini
          </button>
        )}
      </div>

      <h1 className="topic-title-main">{topic.title}</h1>

      {/* Tujuan Pembelajaran Box */}
      <div className="topic-learning-goal">
        <div className="goal-label-strip">
          <IconBook />
          <span>TARGET CAPAIAN PEMBELAJARAN (LEARNING GOAL)</span>
        </div>
        <p className="goal-text">{topic.goal}</p>
      </div>

      {/* Penjelasan Konsep Inti */}
      <div className="topic-explanation-box">
        <h3 className="section-label">Penjelasan Konsep</h3>
        <p className="topic-explanation">{topic.explanation}</p>
      </div>

      {/* Examples Section with Line-by-Line Annotations */}
      {topic.examples.map((example, index) => (
        <section
          className="example-box"
          key={`${number}-${index}`}
          aria-label={`Contoh kode ${index + 1}`}
        >
          <div className="example-heading">
            <span className="example-label">
              <IconCode /> {example.label ?? `CONTOH KODE PROGRAM${topic.examples.length > 1 ? ` #${index + 1}` : ''}`}
            </span>
            <button
              className="copy-code-button"
              type="button"
              onClick={() => void handleCopy(example.code)}
              title="Salin kode ke papan klip"
            >
              <IconCopy /> Salin Kode
            </button>
          </div>

          <pre className="python-code">
            <code>{example.code}</code>
          </pre>

          {example.inputSample !== undefined && (
            <div className="example-input-block">
              <span className="input-label">CONTOH MASUKAN PENGGUNA (STDIN):</span>
              <div className="input-values">
                <code>{example.inputSample}</code>
              </div>
            </div>
          )}

          <div className="example-output-block">
            <span className="output-label">TARGET KELUARAN TERMINAL (STDOUT):</span>
            <pre className="output-values">
              <code>{example.output.join('\n')}</code>
            </pre>
          </div>

          <div className="line-explanation">
            <h4>Penjelasan Baris Demi Baris:</h4>
            <ol>
              {example.lineNotes.map((note, noteIndex) => (
                <li key={`${number}-${index}-${noteIndex}`}>{note}</li>
              ))}
            </ol>
          </div>
        </section>
      ))}

      {/* CEK PEMAHAMAN: Interactive Code Tracing Prediction Quiz */}
      <section className="topic-quiz" aria-labelledby={`quiz-${number}`}>
        <div className="quiz-header">
          <div>
            <p className="quiz-kicker">EVALUASI PEMAHAMAN MANDIRI</p>
            <h3 id={`quiz-${number}`}>Kuis Prediksi Keluaran (Code Tracing)</h3>
          </div>
          <span className="quiz-tag">Uji Penalaran Logika</span>
        </div>

        {/* Clear Instructions Card */}
        <div className="quiz-instruction-box">
          <div className="instruction-title">Petunjuk Pelacakan Kode:</div>
          <ol className="instruction-steps">
            <li>Amati cuplikan baris kode di bawah ini dengan cermat.</li>
            <li>Telusuri alur eksekusi dari atas ke bawah di dalam pikiranmu tanpa menjalankan compiler.</li>
            <li>Pilih opsi jawaban A, B, C, atau D yang sesuai dengan hasil keluaran yang akan tercetak.</li>
          </ol>
        </div>

        {/* Code Snippet to Trace */}
        <div className="quiz-code-preview">
          <div className="preview-top">
            <span className="preview-label">KODE PROGRAM YANG DIANALISIS:</span>
            {firstExample?.inputSample && (
              <span className="preview-input">
                Input: <code>{firstExample.inputSample}</code>
              </span>
            )}
          </div>
          <pre className="preview-code">
            <code>{firstExample?.code}</code>
          </pre>
        </div>

        <p className="quiz-question-prompt">
          <strong>Pertanyaan Pelacakan:</strong> Manakah hasil keluaran yang akan tercetak di layar terminal jika kode di atas dijalankan?
        </p>

        {/* Multiple Choice Options */}
        <div className="quiz-options">
          {quizOptions.map((option, idx) => {
            const optionLetter = ['A', 'B', 'C', 'D'][idx]
            const isCorrect = option === expectedOutput
            const isSelected = quizAnswer === option
            let stateClass = ''
            if (isSelected) {
              stateClass = isCorrect ? ' is-correct' : ' is-incorrect'
            }
            return (
              <button
                className={`quiz-option${stateClass}`}
                key={option}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setQuizAnswer(option)}
              >
                <span className="option-letter">{optionLetter}</span>
                <code className="option-code">{option}</code>
              </button>
            )
          })}
        </div>

        {/* Detailed Feedback & Explanation */}
        {quizAnswer !== null && (
          <div
            className={`quiz-feedback-box${quizAnswer === expectedOutput ? ' is-correct' : ' is-incorrect'}`}
            aria-live="polite"
          >
            <div className="feedback-icon">
              {quizAnswer === expectedOutput ? <IconCheck /> : <IconAlert />}
            </div>
            <div className="feedback-content">
              <div className="feedback-status">
                {quizAnswer === expectedOutput ? 'Analisis Tepat! ✓' : 'Analisis Belum Tepat'}
              </div>
              <p>
                {quizAnswer === expectedOutput
                  ? `Keluaran yang dihasilkan memang: "${expectedOutput}". Penjelasan: ${firstExample?.lineNotes.join(' ')}`
                  : 'Perhatikan kembali urutan baris kode dan nilai yang dikirim ke fungsi print(). Telusuri alur program dari atas ke bawah lalu coba pilih kembali.'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Real-world Application */}
      <div className="topic-application">
        <div className="app-header">
          <IconBook />
          <h4>Penerapan dalam Dunia Nyata</h4>
        </div>
        <p>{topic.application}</p>
      </div>

      {/* Interactive Code Playground (Live Online Python Compiler) */}
      <div className="topic-playground-section">
        <CodePlayground
          title={`Praktik Mandiri: ${topic.title}`}
          instructions={topic.exercise}
          hints={[
            'Tentukan nilai atau variabel yang dibutuhkan sesuai instruksi di atas.',
            `Gunakan kaidah sintaks ${topic.title} untuk menyusun logika program.`,
            'Jalankan program pada terminal interaktif dan pastikan tidak terdapat error.',
          ]}
        />
      </div>

      {/* Exercise and Answer Key */}
      <details className="topic-exercise">
        <summary>Buka Kunci Jawaban & Pembahasan Solusi</summary>
        <div className="exercise-content">
          <p className="exercise-prompt-lead">{topic.exercise}</p>
          <h4>Kode Solusi Standar:</h4>
          <pre className="answer-code">
            <code>{topic.answerCode}</code>
          </pre>
          <h4>Pembahasan Algoritma:</h4>
          <p>{topic.answerExplanation}</p>
        </div>
      </details>

      {/* Cross-Link Banner to Whole-Chapter Discovery Learning Unit */}
      {onOpenCategoryDiscovery && (
        <div className="discovery-unit-invite-banner">
          <div className="invite-left">
            <span className="invite-kicker">SIAP UNTUK EKSPLORASI LEBIH MENDALAM?</span>
            <h4 className="invite-title">Aktivitas Discovery Learning (Unit 1 Materi Utuh)</h4>
            <p className="invite-desc">
              Terapkan seluruh konsep yang kamu pelajari dalam bab ini melalui 6 sintaks pembelajaran penemuan:
              Stimulasi fenomena, perumusan hipotesis, eksperimen mandiri, tabel observasi, pembuktian, dan penarikan kesimpulan.
            </p>
          </div>
          <button
            type="button"
            className="btn-open-unit-discovery"
            onClick={onOpenCategoryDiscovery}
          >
            <IconBrain /> Buka Unit Discovery Learning Bab Ini
          </button>
        </div>
      )}

      {copyStatus && <span className="copy-status" aria-live="polite">{copyStatus}</span>}
    </article>
  )
}
