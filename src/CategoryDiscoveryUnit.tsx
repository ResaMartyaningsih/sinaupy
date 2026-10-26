import { useState, useEffect } from 'react'
import CodePlayground from './CodePlayground'
import { getDiscoveryForCategory } from './discoveryLearningData'
import {
  getDiscoveryData,
  saveDiscoveryData,
  type DiscoveryNoteData,
} from './studentData'
import {
  IconBrain,
  IconCheck,
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconSave,
  IconCopy,
  IconBook,
  IconCode,
} from './Icons'

type CategoryDiscoveryUnitProps = {
  categoryTitle: string
  onBackToTopics: () => void
}

const STAGES = [
  { id: 1, label: 'Stimulasi', desc: 'Pengamatan Fenomena' },
  { id: 2, label: 'Identifikasi Masalah', desc: 'Perumusan Hipotesis' },
  { id: 3, label: 'Eksperimen Mandiri', desc: 'Pengumpulan Data' },
  { id: 4, label: 'Pengolahan Data', desc: 'Tabel & Analisis Pola' },
  { id: 5, label: 'Pembuktian', desc: 'Verifikasi & Kaidah' },
  { id: 6, label: 'Kesimpulan & Transfer', desc: 'Kaidah & Far Transfer' },
]

export default function CategoryDiscoveryUnit({
  categoryTitle,
  onBackToTopics,
}: CategoryDiscoveryUnitProps) {
  const discovery = getDiscoveryForCategory(categoryTitle)
  const categoryKey = `cat-${categoryTitle.replace(/[^a-zA-Z0-9]/g, '_')}`

  // Persistent student discovery notes
  const [persistedData, setPersistedData] = useState<DiscoveryNoteData>(() =>
    getDiscoveryData(categoryKey)
  )

  const [activeStage, setActiveStage] = useState<number>(() => persistedData.activeStage || 1)
  const [completedStages, setCompletedStages] = useState<number[]>(
    () => persistedData.completedStages || []
  )
  const [viewMode, setViewMode] = useState<'guided' | 'all'>('guided')

  const [prediction, setPrediction] = useState<string>(persistedData.prediction || '')
  const [observationNotes, setObservationNotes] = useState<Record<number, string>>(
    persistedData.observationNotes || {}
  )
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number | null>(null)
  const [conclusion, setConclusion] = useState<string>(persistedData.conclusion || '')
  const [reflection1, setReflection1] = useState<string>(persistedData.reflection1 || '')
  const [reflection2, setReflection2] = useState<string>(persistedData.reflection2 || '')
  const [reflection3, setReflection3] = useState<string>(persistedData.reflection3 || '')

  const [saveToast, setSaveToast] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<string>('')

  // Sync when category changes
  useEffect(() => {
    const data = getDiscoveryData(categoryKey)
    setPersistedData(data)
    setActiveStage(data.activeStage || 1)
    setCompletedStages(data.completedStages || [])
    setPrediction(data.prediction || '')
    setObservationNotes(data.observationNotes || {})
    setConclusion(data.conclusion || '')
    setReflection1(data.reflection1 || '')
    setReflection2(data.reflection2 || '')
    setReflection3(data.reflection3 || '')
    setSelectedQuizIdx(null)
  }, [categoryKey])

  const showToast = (msg: string) => {
    setSaveToast(msg)
    setTimeout(() => setSaveToast(null), 3000)
  }

  const markStageComplete = (stageNum: number) => {
    if (!completedStages.includes(stageNum)) {
      const updated = [...completedStages, stageNum]
      setCompletedStages(updated)
      saveDiscoveryData(categoryKey, { completedStages: updated })
    }
  }

  const goToStage = (targetStage: number) => {
    setActiveStage(targetStage)
    saveDiscoveryData(categoryKey, { activeStage: targetStage })
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  const handleSavePrediction = () => {
    saveDiscoveryData(categoryKey, { prediction })
    markStageComplete(2)
    showToast('Hipotesis awalmu berhasil dicatat! Lanjutkan ke Eksperimen.')
    goToStage(3)
  }

  const handleObservationChange = (idx: number, val: string) => {
    const updated = { ...observationNotes, [idx]: val }
    setObservationNotes(updated)
    saveDiscoveryData(categoryKey, { observationNotes: updated })
    markStageComplete(4)
  }

  const handleSaveFinalReflection = () => {
    saveDiscoveryData(categoryKey, {
      conclusion,
      reflection1,
      reflection2,
      reflection3,
    })
    markStageComplete(6)
    showToast('Kesimpulan & portofolio refleksi bab berhasil disimpan!')
  }

  const handleCopyCode = async (codeStr: string) => {
    try {
      await navigator.clipboard.writeText(codeStr)
      setCopyStatus('Kode berhasil disalin!')
      setTimeout(() => setCopyStatus(''), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="category-discovery-wrapper" id="category-discovery">
      {/* Top Banner & Breadcrumb Back Navigation */}
      <div className="discovery-unit-header-card">
        <div className="unit-header-top">
          <div className="unit-badge-wrap">
            <span className="unit-pedagogy-badge">
              <IconBrain /> UNIT PEMBELAJARAN PENEMUAN (DISCOVERY LEARNING)
            </span>
            <span className="unit-scope-badge">1 MATERI UTUH</span>
          </div>

          <button
            type="button"
            className="btn-back-to-subtopics"
            onClick={onBackToTopics}
            title="Kembali ke daftar sub-materi"
          >
            <IconArrowLeft /> Kembali ke Sub-Materi
          </button>
        </div>

        <h1 className="unit-main-title">Aktivitas Inkuiri: {categoryTitle}</h1>
        <p className="unit-subtitle">
          Sintesiskan seluruh konsep dalam bab ini melalui 6 sintaks pembelajaran penemuan. Amati fenomena kode komprehensif, ajukan hipotesis, lakukan eksperimen terarah pada compiler, analisis pola data observasi, buktikan kebenaran kaidah resmi Python, dan rumuskan kesimpulanmu sendiri.
        </p>

        {/* Stepper Navigation Tracker */}
        <nav className="discovery-stepper-container" aria-label="Alur 6 Sintaks Penemuan Bab">
          <div className="stepper-header-row">
            <span className="stepper-kicker">6 SINTAKS PEMBELAJARAN PENEMUAN</span>
            <div className="stepper-mode-controls">
              <button
                type="button"
                className={`stepper-mode-btn ${viewMode === 'guided' ? 'active' : ''}`}
                onClick={() => setViewMode('guided')}
              >
                Mode Bertahap (Guided)
              </button>
              <button
                type="button"
                className={`stepper-mode-btn ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => setViewMode('all')}
              >
                Tampilkan Semua Tahap
              </button>
            </div>
          </div>

          <div className="stepper-stages-grid">
            {STAGES.map((st) => {
              const isCurrent = activeStage === st.id && viewMode === 'guided'
              const isDone = completedStages.includes(st.id)

              return (
                <button
                  key={st.id}
                  type="button"
                  className={`stage-step-btn ${isCurrent ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                  onClick={() => {
                    setActiveStage(st.id)
                    if (viewMode === 'all') setViewMode('guided')
                  }}
                  title={`Buka Tahap ${st.id}: ${st.label}`}
                >
                  <div className="step-num-pill">
                    {isDone && !isCurrent ? <IconCheck /> : `0${st.id}`}
                  </div>
                  <div className="step-info-col">
                    <span className="step-title-text">{st.label}</span>
                    <span className="step-desc-text">{st.desc}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {saveToast && (
        <div className="unit-save-toast-banner" role="status">
          <IconCheck />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ====================================================================
          SINTAKS 1: STIMULATION (PEMBERIAN RANGSANGAN)
          ==================================================================== */}
      {(viewMode === 'all' || activeStage === 1) && (
        <section className="discovery-stage-card stage-card-1" id="stage-1">
          <div className="stage-card-badge">
            <span className="badge-num">TAHAP 01</span>
            <span className="badge-name">STIMULATION (PEMBERIAN RANGSANGAN)</span>
          </div>

          <h2 className="stage-card-heading">Pengamatan Fenomena Kode Materi</h2>
          <p className="stage-card-intro">{discovery.stimulationContext}</p>

          {/* Stimulus Code Box */}
          <div className="stimulus-code-card">
            <div className="stimulus-top-bar">
              <span className="stimulus-tag">
                <IconCode /> FENOMENA KODE PYTHON UNTUK DIAMATI
              </span>
              <button
                type="button"
                className="btn-copy-code"
                onClick={() => handleCopyCode(discovery.stimulationCode)}
              >
                <IconCopy /> Salin
              </button>
            </div>
            <pre className="stimulus-pre-code">
              <code>{discovery.stimulationCode}</code>
            </pre>
          </div>

          {/* Spark Questions Box */}
          <div className="spark-questions-box">
            <h4 className="spark-title">Pertanyaan Pemantik Rasa Ingin Tahu:</h4>
            <ul className="spark-list">
              {discovery.stimulationQuestions.map((q, idx) => (
                <li key={idx}>
                  <strong>Pertanyaan #{idx + 1}:</strong> {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="stage-card-footer">
            <button
              type="button"
              className="btn-stage-advance"
              onClick={() => {
                markStageComplete(1)
                goToStage(2)
              }}
            >
              <span>Lanjut ke Tahap 2: Identifikasi Masalah & Prediksi</span>
              <IconArrowRight />
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          SINTAKS 2: PROBLEM STATEMENT (IDENTIFIKASI MASALAH)
          ==================================================================== */}
      {(viewMode === 'all' || activeStage === 2) && (
        <section className="discovery-stage-card stage-card-2" id="stage-2">
          <div className="stage-card-badge">
            <span className="badge-num">TAHAP 02</span>
            <span className="badge-name">PROBLEM STATEMENT (IDENTIFIKASI MASALAH)</span>
          </div>

          <h2 className="stage-card-heading">Fokus Masalah & Perumusan Hipotesis Awal</h2>

          <div className="inquiry-highlight-card">
            <span className="inquiry-kicker">FOKUS PERTANYAAN INKUIRI:</span>
            <p className="inquiry-statement-text">{discovery.problemStatement}</p>
          </div>

          <div className="hypothesis-input-card">
            <label htmlFor="cat-hypothesis-input" className="hypo-label">
              {discovery.predictionPrompt}
            </label>
            <textarea
              id="cat-hypothesis-input"
              className="hypo-textarea"
              placeholder="Tuliskan analisismu di sini: Menurut hipotesis awal saya, aturan kerja yang mendasari materi ini adalah..."
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              rows={4}
            />
            <div className="hypo-note-strip">
              <span>💡 Catatan Inkuiri: Formulasi dugaan awalmu melatih penalaran ilmiah sebelum dibuktikan dengan data compiler.</span>
            </div>
          </div>

          <div className="stage-card-footer space-between">
            <button
              type="button"
              className="btn-stage-back"
              onClick={() => goToStage(1)}
            >
              <IconArrowLeft /> <span>Kembali ke Stimulasi</span>
            </button>
            <button
              type="button"
              className="btn-stage-advance"
              onClick={handleSavePrediction}
            >
              <span>Simpan Hipotesis & Masuk ke Eksperimen (Tahap 3)</span>
              <IconArrowRight />
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          SINTAKS 3: DATA COLLECTION (PENGUMPULAN DATA / EKSPERIMEN TERARAH)
          ==================================================================== */}
      {(viewMode === 'all' || activeStage === 3) && (
        <section className="discovery-stage-card stage-card-3" id="stage-3">
          <div className="stage-card-badge">
            <span className="badge-num">TAHAP 03</span>
            <span className="badge-name">DATA COLLECTION (PENGUMPULAN DATA EKSPERIMEN)</span>
          </div>

          <h2 className="stage-card-heading">Uji Coba Kode Terarah di Online Python Compiler</h2>
          <p className="stage-card-intro">{discovery.experimentGuide}</p>

          <div className="trials-steps-container">
            <h4 className="trials-heading">Panduan 3 Langkah Percobaan Terarah:</h4>
            <div className="trials-cards-grid">
              {discovery.trials.map((tr) => (
                <div key={tr.step} className="single-trial-card">
                  <span className="trial-badge">Percobaan #{tr.step}</span>
                  <h5 className="trial-card-title">{tr.title}</h5>
                  <p className="trial-card-action">{tr.action}</p>
                  <pre className="trial-card-code">
                    <code>{tr.codeToTry}</code>
                  </pre>
                  {tr.inputIfAny && (
                    <div className="trial-input-tag">
                      Input uji coba: <code>{tr.inputIfAny}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Online Compiler Playground */}
          <div className="discovery-compiler-frame">
            <CodePlayground
              title={`Compiler Eksperimen: ${categoryTitle}`}
              instructions="Ketik kode percobaan di atas pada editor dan jalankan menggunakan tombol Run. Amati setiap teks dan data keluaran terminal untuk dianalisis pada Tahap 4."
              hints={[
                'Ketik baris kode secara mandiri tanpa menggunakan salin-tempel untuk melatih memori otot sintaks.',
                'Gunakan tombol Run untuk menguji jalannya program di terminal interaktif.',
                'Perhatikan baik-baik jenis keluaran atau pesan error yang muncul.',
              ]}
              initialCode=""
            />
          </div>

          <div className="stage-card-footer space-between">
            <button
              type="button"
              className="btn-stage-back"
              onClick={() => goToStage(2)}
            >
              <IconArrowLeft /> <span>Kembali ke Hipotesis</span>
            </button>
            <button
              type="button"
              className="btn-stage-advance"
              onClick={() => {
                markStageComplete(3)
                goToStage(4)
              }}
            >
              <span>Lanjut ke Tahap 4: Pengolahan & Analisis Data</span>
              <IconArrowRight />
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          SINTAKS 4: DATA PROCESSING (PENGOLAHAN DATA & ANALISIS POLA)
          ==================================================================== */}
      {(viewMode === 'all' || activeStage === 4) && (
        <section className="discovery-stage-card stage-card-4" id="stage-4">
          <div className="stage-card-badge">
            <span className="badge-num">TAHAP 04</span>
            <span className="badge-name">DATA PROCESSING (PENGOLAHAN DATA & ANALISIS POLA)</span>
          </div>

          <h2 className="stage-card-heading">Tabel Komparasi Observasi & Penalaran Kritis</h2>
          <p className="stage-card-intro">
            Bandingkan fakta hasil percobaan yang kamu amati di compiler. Temukan hubungan sebab-akibat antara perubahan baris kode dan respon terminal.
          </p>

          <div className="obs-table-wrapper">
            <table className="category-obs-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Uji</th>
                  <th style={{ width: '28%' }}>Variasi Kode / Input</th>
                  <th style={{ width: '32%' }}>Keluaran Aktual Terminal</th>
                  <th>Analisis & Penjelasan Pola Siswa</th>
                </tr>
              </thead>
              <tbody>
                {discovery.observationTable.map((row, idx) => (
                  <tr key={idx}>
                    <td className="col-num">#{row.trialNumber}</td>
                    <td className="col-variation">
                      <code>{row.codeVariation}</code>
                    </td>
                    <td className="col-result">
                      <pre className="terminal-result-pre"><code>{row.observedResult}</code></pre>
                    </td>
                    <td className="col-input">
                      <textarea
                        className="obs-textarea-input"
                        placeholder={`Tuliskan mengapa hasil #${row.trialNumber} demikian...`}
                        value={observationNotes[idx] || ''}
                        onChange={(e) => handleObservationChange(idx, e.target.value)}
                        rows={2}
                      />
                      <span className="obs-hint-text">Fokus analisis: {row.analysisPrompt}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="critical-reasoning-card">
            <h4 className="reasoning-heading">Pertanyaan Penalaran Kritis:</h4>
            <ol className="reasoning-items-list">
              {discovery.reasoningQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ol>

            {prediction && (
              <div className="prediction-reflection-callout">
                <span className="callout-kicker">KILAS BALIK HIPOTESIS AWALMU (TAHAP 2):</span>
                <p className="callout-quote">"{prediction}"</p>
                <span className="callout-question">
                  👉 Apakah data observasi di atas membuktikan atau mengoreksi dugaan awalmu?
                </span>
              </div>
            )}
          </div>

          <div className="stage-card-footer space-between">
            <button
              type="button"
              className="btn-stage-back"
              onClick={() => goToStage(3)}
            >
              <IconArrowLeft /> <span>Kembali ke Eksperimen</span>
            </button>
            <button
              type="button"
              className="btn-stage-advance"
              onClick={() => {
                markStageComplete(4)
                goToStage(5)
              }}
            >
              <span>Lanjut ke Tahap 5: Pembuktian & Verifikasi Konsep</span>
              <IconArrowRight />
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          SINTAKS 5: VERIFICATION (PEMBUKTIAN & PENJELASAN RESMI)
          ==================================================================== */}
      {(viewMode === 'all' || activeStage === 5) && (
        <section className="discovery-stage-card stage-card-5" id="stage-5">
          <div className="stage-card-badge">
            <span className="badge-num">TAHAP 05</span>
            <span className="badge-name">VERIFICATION (PEMBUKTIAN & VERIFIKASI ILMIAH)</span>
          </div>

          <h2 className="stage-card-heading">Uji Konfirmasi & Kaidah Resmi Bahasa Python</h2>
          <p className="stage-card-intro">
            Validasi apakah pola yang kamu temukan berlaku secara universal dengan menyelesaikan kuis verifikasi berikut.
          </p>

          <div className="verification-quiz-panel">
            <div className="quiz-panel-header">
              <span className="quiz-panel-tag">KUIS KONFIRMASI PEMAHAMAN BAB</span>
              <h4 className="quiz-question-title">{discovery.verificationQuiz.question}</h4>
            </div>

            <pre className="quiz-code-box">
              <code>{discovery.verificationQuiz.codeSnippet}</code>
            </pre>

            <div className="quiz-options-grid">
              {discovery.verificationQuiz.options.map((opt, idx) => {
                const isSelected = selectedQuizIdx === idx
                let optClass = ''
                if (isSelected) {
                  optClass = opt.isCorrect ? ' opt-correct' : ' opt-incorrect'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`quiz-choice-btn ${optClass}`}
                    onClick={() => setSelectedQuizIdx(idx)}
                  >
                    <span className="choice-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                    <span className="choice-text">{opt.text}</span>
                    {isSelected && (
                      <span className="choice-indicator">
                        {opt.isCorrect ? 'Benar ✓' : 'Belum Tepat ✗'}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {selectedQuizIdx !== null && (
              <div
                className={`quiz-feedback-box ${
                  discovery.verificationQuiz.options[selectedQuizIdx].isCorrect
                    ? 'feedback-success'
                    : 'feedback-error'
                }`}
              >
                <div className="feedback-icon-wrap">
                  {discovery.verificationQuiz.options[selectedQuizIdx].isCorrect ? (
                    <IconCheck />
                  ) : (
                    <IconAlert />
                  )}
                </div>
                <div className="feedback-text-wrap">
                  <strong>
                    {discovery.verificationQuiz.options[selectedQuizIdx].isCorrect
                      ? 'Verifikasi Berhasil! Konsep Terbukti Benar.'
                      : 'Evaluasi Pemikiranmu Kembali.'}
                  </strong>
                  <p>{discovery.verificationQuiz.options[selectedQuizIdx].feedback}</p>
                </div>
              </div>
            )}
          </div>

          {/* Authoritative Verified Concept Explanation Unlocked */}
          <div className="verified-concept-banner">
            <div className="verified-title-strip">
              <IconBook />
              <h4>Penjelasan Konsep Terverifikasi (Kaidah Resmi Python)</h4>
            </div>
            <p className="verified-explanation-body">{discovery.verifiedExplanation}</p>

            <div className="common-pitfalls-card">
              <strong>⚠️ Kesalahan Umum Pemula (Common Pitfalls) pada Bab Ini:</strong>
              <ul>
                {discovery.commonPitfalls.map((pf, pIdx) => (
                  <li key={pIdx}>{pf}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="stage-card-footer space-between">
            <button
              type="button"
              className="btn-stage-back"
              onClick={() => goToStage(4)}
            >
              <IconArrowLeft /> <span>Kembali ke Pengolahan Data</span>
            </button>
            <button
              type="button"
              className="btn-stage-advance"
              onClick={() => {
                markStageComplete(5)
                goToStage(6)
              }}
            >
              <span>Lanjut ke Tahap 6: Kesimpulan & Tantangan Transfer</span>
              <IconArrowRight />
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          SINTAKS 6: GENERALIZATION (KESIMPULAN, TRANSFER, & REFLEKSI)
          ==================================================================== */}
      {(viewMode === 'all' || activeStage === 6) && (
        <section className="discovery-stage-card stage-card-6" id="stage-6">
          <div className="stage-card-badge">
            <span className="badge-num">TAHAP 06</span>
            <span className="badge-name">GENERALIZATION (MENARIK KESIMPULAN & TRANSFER)</span>
          </div>

          <h2 className="stage-card-heading">Rumuskan Aturan Umum, Tantangan Baru, & Refleksi</h2>

          <div className="conclusion-form-panel">
            <label htmlFor="cat-conclusion-input" className="conclusion-input-label">
              ✍️ Tuliskan Rumusan Kaidah Umum yang Kamu Temukan dalam Kalimatmu Sendiri:
            </label>
            <textarea
              id="cat-conclusion-input"
              className="conclusion-input-textarea"
              placeholder="Berdasarkan seluruh rangkaian percobaan dan pembuktian, aturan kerja yang mendasari materi ini adalah..."
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows={3}
            />

            <div className="golden-rule-frame">
              <span className="golden-kicker">PRINSIP EMAS PYTHON</span>
              <p className="golden-statement">{discovery.goldenRule}</p>
            </div>
          </div>

          {/* Far Transfer Challenge */}
          <div className="transfer-task-panel">
            <div className="transfer-panel-top">
              <span className="transfer-tag">TANTANGAN TRANSFER KONSEP BARU</span>
              <h4 className="transfer-title">{discovery.transferChallenge.title}</h4>
            </div>
            <p className="transfer-story">{discovery.transferChallenge.scenario}</p>
            <div className="transfer-instruction-box">
              <strong>Tugas Pemrograman:</strong>
              <p>{discovery.transferChallenge.task}</p>
              <span className="transfer-tip">💡 Petunjuk Awal: {discovery.transferChallenge.starterHint}</span>
            </div>
          </div>

          {/* Metacognitive Reflection Stack */}
          <div className="metacognitive-stack-card">
            <div className="meta-card-head">
              <IconBrain />
              <h4>Refleksi Metakognitif Pembelajaran Bab Ini</h4>
            </div>
            <p className="meta-card-sub">
              Refleksi membantu otakmu memetakan strategi belajar yang efektif dan mengidentifikasi bagian yang masih memerlukan latihan.
            </p>

            <div className="meta-inputs-grid">
              <div className="meta-input-item">
                <label>1. Konsep atau pemahaman penting apa yang berhasil kamu temukan hari ini?</label>
                <input
                  type="text"
                  placeholder="Tuliskan pemahaman utamamu..."
                  value={reflection1}
                  onChange={(e) => setReflection1(e.target.value)}
                />
              </div>

              <div className="meta-input-item">
                <label>2. Percobaan atau langkah mana yang paling membantumu menemukan konsep tersebut?</label>
                <input
                  type="text"
                  placeholder="Tuliskan langkah yang paling berkesan..."
                  value={reflection2}
                  onChange={(e) => setReflection2(e.target.value)}
                />
              </div>

              <div className="meta-input-item">
                <label>3. Kendala atau kesalahan sintaks apa yang sempat kamu alami dan bagaimana mengatasinya?</label>
                <input
                  type="text"
                  placeholder="Tuliskan kendala dan solusimu..."
                  value={reflection3}
                  onChange={(e) => setReflection3(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-save-final-discovery"
              onClick={handleSaveFinalReflection}
            >
              <IconSave />
              <span>Simpan Kesimpulan & Portofolio Refleksi Bab</span>
            </button>
          </div>

          <div className="stage-card-footer space-between">
            <button
              type="button"
              className="btn-stage-back"
              onClick={() => goToStage(5)}
            >
              <IconArrowLeft /> <span>Kembali ke Pembuktian</span>
            </button>
            <div className="unit-completed-badge">
              <IconCheck /> Unit Discovery Learning Selesai
            </div>
          </div>
        </section>
      )}

      {copyStatus && <span className="copy-status-bubble" aria-live="polite">{copyStatus}</span>}
    </div>
  )
}
