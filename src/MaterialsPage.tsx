import { useState, useMemo, useEffect, useCallback } from 'react'
import MaterialTopicCard from './MaterialTopicCard'
import CategoryDiscoveryUnit from './CategoryDiscoveryUnit'
import { materialCategories, type MaterialTopic } from './materialsData'
import {
  getCompletedTopicIds,
  saveCompletedTopicId,
} from './studentData'
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconBrain,
  IconChevronDown,
  IconChevronRight,
  IconLock,
  IconCheck,
} from './Icons'
import './MaterialsPage.css'

type MaterialsPageProps = {
  onBack?: () => void
  onBackHome?: () => void
}

interface FlatTopic {
  categoryIndex: number
  topicIndex: number
  categoryTitle: string
  topic: MaterialTopic
  globalNumber: number
}

export default function MaterialsPage({ onBack, onBackHome }: MaterialsPageProps) {
  const handleBack = () => {
    if (onBack) onBack()
    else if (onBackHome) onBackHome()
    else window.history.back()
  }

  const [selectedTopic, setSelectedTopic] = useState<{
    categoryIndex: number
    topicIndex: number
  }>({ categoryIndex: 0, topicIndex: 0 })

  const [viewingDiscoveryUnit, setViewingDiscoveryUnit] = useState<boolean>(false)

  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
  })

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(getCompletedTopicIds)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'locked' } | null>(null)

  // Listen for completed topics events across components
  useEffect(() => {
    const handleUpdate = () => {
      setCompletedTopicIds(getCompletedTopicIds())
    }
    window.addEventListener('sinaupy:topic_completed', handleUpdate)
    return () => {
      window.removeEventListener('sinaupy:topic_completed', handleUpdate)
    }
  }, [])

  // Auto-dismiss toast alert after 3.5s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Flatten all topics across categories
  const allTopics: FlatTopic[] = useMemo(() => {
    let count = 0
    return materialCategories.flatMap((category, categoryIndex) =>
      category.topics.map((t, topicIndex) => {
        count += 1
        return {
          categoryIndex,
          topicIndex,
          categoryTitle: category.title,
          topic: t,
          globalNumber: count,
        }
      })
    )
  }, [])

  // Check if a sub-materi topic is completed
  const isTopicDone = useCallback(
    (flatIdx: number) => {
      const item = allTopics[flatIdx]
      if (!item) return false
      return completedTopicIds.includes(`topic-${item.globalNumber}`)
    },
    [allTopics, completedTopicIds]
  )

  // Sequential lock logic for SUB-MATERI:
  // - First sub-materi (flatIdx === 0) is always unlocked
  // - Any subsequent sub-materi (flatIdx > 0) is unlocked ONLY if the previous sub-materi is completed
  const isTopicUnlocked = useCallback(
    (flatIdx: number) => {
      if (flatIdx <= 0) return true
      const prevTopic = allTopics[flatIdx - 1]
      if (!prevTopic) return true
      const prevId = `topic-${prevTopic.globalNumber}`
      const currentId = `topic-${allTopics[flatIdx].globalNumber}`
      return completedTopicIds.includes(prevId) || completedTopicIds.includes(currentId)
    },
    [allTopics, completedTopicIds]
  )

  const currentFlatIndex = allTopics.findIndex(
    (item) =>
      item.categoryIndex === selectedTopic.categoryIndex &&
      item.topicIndex === selectedTopic.topicIndex
  )

  // Safety fallback: if current flat index is somehow locked, redirect to highest unlocked topic
  useEffect(() => {
    if (currentFlatIndex > 0 && !isTopicUnlocked(currentFlatIndex)) {
      let highestUnlocked = 0
      for (let i = 0; i < allTopics.length; i++) {
        if (isTopicUnlocked(i)) {
          highestUnlocked = i
        } else {
          break
        }
      }
      const safe = allTopics[highestUnlocked]
      if (safe) {
        setSelectedTopic({
          categoryIndex: safe.categoryIndex,
          topicIndex: safe.topicIndex,
        })
      }
    }
  }, [currentFlatIndex, allTopics, isTopicUnlocked])

  const currentTopicItem = allTopics[currentFlatIndex] || allTopics[0]
  const currentCategory = materialCategories[selectedTopic.categoryIndex] || materialCategories[0]
  const prevTopicItem = currentFlatIndex > 0 ? allTopics[currentFlatIndex - 1] : null
  const nextTopicItem = currentFlatIndex < allTopics.length - 1 ? allTopics[currentFlatIndex + 1] : null

  const isCurrentTopicDone = isTopicDone(currentFlatIndex)
  const isNextTopicUnlocked = nextTopicItem ? isTopicUnlocked(currentFlatIndex + 1) : false

  const completedCount = completedTopicIds.filter((id) => id.startsWith('topic-')).length
  const progressPercent = allTopics.length > 0 ? Math.round((completedCount / allTopics.length) * 100) : 0

  const toggleCategory = (catIdx: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catIdx]: !prev[catIdx],
    }))
  }

  const handleSelectTopic = (categoryIndex: number, topicIndex: number) => {
    const flatIdx = allTopics.findIndex(
      (t) => t.categoryIndex === categoryIndex && t.topicIndex === topicIndex
    )
    if (flatIdx === -1) return

    const target = allTopics[flatIdx]
    const unlocked = isTopicUnlocked(flatIdx)

    if (!unlocked) {
      const prevTopic = flatIdx > 0 ? allTopics[flatIdx - 1] : null
      const prevName = prevTopic
        ? `#${String(prevTopic.globalNumber).padStart(2, '0')}: "${prevTopic.topic.title}"`
        : 'sebelumnya'
      setToastMessage({
        type: 'locked',
        text: `Materi "${target.topic.title}" masih terkunci 🔒. Selesaikan Sub-Materi ${prevName} terlebih dahulu untuk membukanya.`,
      })
      return
    }

    setSelectedTopic({ categoryIndex, topicIndex })
    setViewingDiscoveryUnit(false)
    setIsMobileSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Khusus Unit Pembelajaran Penemuan (Discovery Learning) TIDAK DIKUNCI (bisa dibuka kapan saja)
  const handleOpenDiscoveryUnit = (categoryIndex: number) => {
    setSelectedTopic((prev) => ({ ...prev, categoryIndex }))
    setViewingDiscoveryUnit(true)
    setIsMobileSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCompleteCurrentTopic = () => {
    const topicId = `topic-${currentTopicItem.globalNumber}`
    saveCompletedTopicId(topicId)
    setCompletedTopicIds((prev) => (prev.includes(topicId) ? prev : [...prev, topicId]))

    const nextFlat = allTopics[currentFlatIndex + 1]
    const nextName = nextFlat
      ? `Sub-Materi #${String(nextFlat.globalNumber).padStart(2, '0')}: "${nextFlat.topic.title}"`
      : 'Semua Materi Selesai!'

    setToastMessage({
      type: 'success',
      text: `🎉 Selamat! Sub-Materi #${String(currentTopicItem.globalNumber).padStart(2, '0')} selesai dipelajari. ${
        nextFlat ? `${nextName} kini telah terbuka!` : 'Hebat, seluruh modul materi telah tuntas kamu pelajari!'
      }`,
    })
  }

  const handleNextTopic = () => {
    if (nextTopicItem) {
      handleSelectTopic(nextTopicItem.categoryIndex, nextTopicItem.topicIndex)
    }
  }

  const handleAttemptLockedNext = () => {
    setToastMessage({
      type: 'locked',
      text: `Materi selanjutnya masih terkunci 🔒. Selesaikan Sub-Materi #${String(
        currentTopicItem.globalNumber
      ).padStart(2, '0')} terlebih dahulu dengan menekan tombol "Selesaikan Sub-Materi" di bawah.`,
    })

    const completionSection = document.querySelector('.topic-completion-card')
    if (completionSection) {
      completionSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="materials-layout-wrapper">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`materials-toast-alert ${toastMessage.type}`} role="status">
          <div className="toast-icon">
            {toastMessage.type === 'locked' ? <IconLock /> : <IconCheck />}
          </div>
          <span className="toast-text">{toastMessage.text}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Navigation Bar */}
      <div className="materials-top-bar">
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

        {/* Mobile Sidebar Toggle Button */}
        <button
          type="button"
          className="mobile-sidebar-toggle"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-expanded={isMobileSidebarOpen}
        >
          <IconBook />
          <span>
            {viewingDiscoveryUnit
              ? `Discovery Unit: ${currentCategory.title}`
              : `Daftar Materi (${currentTopicItem.globalNumber}/${allTopics.length})`}
          </span>
          {isMobileSidebarOpen ? <IconChevronDown /> : <IconChevronRight />}
        </button>
      </div>

      <div className="materials-body-grid">
        {/* Left Column: Learning Sidebar */}
        <aside className={`materials-sidebar ${isMobileSidebarOpen ? 'is-open-mobile' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-header-top">
              <span className="sidebar-title">Katalog Materi</span>
              <span className="sidebar-counter">
                {completedCount}/{allTopics.length} Selesai
              </span>
            </div>
            {/* Progress Bar Indicator */}
            <div
              className="sidebar-progress-track"
              title={`Progres Materi: ${completedCount} dari ${allTopics.length} (${progressPercent}%)`}
            >
              <div
                className="sidebar-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Navigasi Materi Python">
            {materialCategories.map((category, catIdx) => {
              const isExpanded = expandedCategories[catIdx] ?? true
              const hasActiveTopic = selectedTopic.categoryIndex === catIdx

              return (
                <div key={category.title} className="sidebar-category-group">
                  <button
                    type="button"
                    className={`sidebar-category-btn ${hasActiveTopic ? 'has-active' : ''}`}
                    onClick={() => toggleCategory(catIdx)}
                    aria-expanded={isExpanded}
                  >
                    <span className="cat-name">{category.title}</span>
                    <span className="cat-chevron" aria-hidden="true">
                      {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="sidebar-topic-list">
                      {/* Featured Button: Whole Chapter Discovery Learning Unit (SELALU TERBUKA) */}
                      <button
                        type="button"
                        className={`sidebar-discovery-pill ${
                          selectedTopic.categoryIndex === catIdx && viewingDiscoveryUnit
                            ? 'is-active'
                            : ''
                        }`}
                        onClick={() => handleOpenDiscoveryUnit(catIdx)}
                        title={`Buka Unit Discovery Learning untuk 1 Materi: ${category.title}`}
                      >
                        <IconBrain className="pill-brain-icon" />
                        <span className="pill-text">Unit Discovery (1 Bab)</span>
                      </button>

                      {category.topics.map((topic, topIdx) => {
                        const isSelected =
                          !viewingDiscoveryUnit &&
                          selectedTopic.categoryIndex === catIdx &&
                          selectedTopic.topicIndex === topIdx

                        const flatIdx = allTopics.findIndex(
                          (t) => t.categoryIndex === catIdx && t.topicIndex === topIdx
                        )
                        const flatObj = allTopics[flatIdx]
                        const numStr = String(flatObj?.globalNumber || 1).padStart(2, '0')
                        const isDone = isTopicDone(flatIdx)
                        const isUnlocked = isTopicUnlocked(flatIdx)
                        const isLocked = !isUnlocked

                        return (
                          <button
                            key={topic.title}
                            type="button"
                            className={`sidebar-topic-item ${isSelected ? 'is-active' : ''} ${
                              isDone ? 'is-completed' : ''
                            } ${isLocked ? 'is-locked' : ''}`}
                            onClick={() => handleSelectTopic(catIdx, topIdx)}
                            aria-current={isSelected ? 'page' : undefined}
                            title={
                              isLocked
                                ? `Terkunci 🔒 — Selesaikan sub-materi sebelumnya terlebih dahulu untuk membuka`
                                : isDone
                                ? `✓ Selesai dipelajari: ${topic.title}`
                                : topic.title
                            }
                          >
                            <span className="topic-num">{numStr}</span>
                            <span className="topic-name">{topic.title}</span>
                            {isDone ? (
                              <span className="topic-done-badge" title="Tuntas dipelajari">✓</span>
                            ) : isLocked ? (
                              <span className="topic-lock-icon" title="Terkunci"><IconLock /></span>
                            ) : null}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Right Column: Content Reading Area */}
        <main className="materials-content-main">
          {/* Top Switcher Banner: Sub-Materi vs Discovery Learning Unit */}
          <div className="materials-mode-switcher-bar">
            <button
              type="button"
              className={`mode-switch-btn ${!viewingDiscoveryUnit ? 'active' : ''}`}
              onClick={() => setViewingDiscoveryUnit(false)}
            >
              <IconBook />
              <span>
                Sub-Materi ({String(currentTopicItem.globalNumber).padStart(2, '0')}: {currentTopicItem.topic.title})
                {isCurrentTopicDone && ' ✓'}
              </span>
            </button>

            {/* Tombol Tab Unit Discovery Learning (SELALU TERBUKA) */}
            <button
              type="button"
              className={`mode-switch-btn btn-discovery-tab ${viewingDiscoveryUnit ? 'active' : ''}`}
              onClick={() => handleOpenDiscoveryUnit(selectedTopic.categoryIndex)}
              title={`Buka Unit Discovery Learning: ${currentCategory.title}`}
            >
              <IconBrain />
              <span>Unit Discovery Learning ({currentCategory.title})</span>
            </button>
          </div>

          {viewingDiscoveryUnit ? (
            <CategoryDiscoveryUnit
              categoryTitle={currentCategory.title}
              onBackToTopics={() => setViewingDiscoveryUnit(false)}
            />
          ) : (
            <>
              {/* Breadcrumb Path */}
              <nav className="content-breadcrumbs" aria-label="Lokasi materi">
                <span>Materi Python</span>
                <span className="bc-sep">/</span>
                <span>{currentTopicItem.categoryTitle}</span>
                <span className="bc-sep">/</span>
                <span className="bc-current">
                  {String(currentTopicItem.globalNumber).padStart(2, '0')}. {currentTopicItem.topic.title}
                  {isCurrentTopicDone && ' (✓ Selesai)'}
                </span>
              </nav>

              {/* Render the Topic Card with Completion Tracking */}
              <MaterialTopicCard
                key={`${currentTopicItem.categoryTitle}-${currentTopicItem.topic.title}`}
                number={String(currentTopicItem.globalNumber).padStart(2, '0')}
                topic={currentTopicItem.topic}
                categoryTitle={currentTopicItem.categoryTitle}
                isCompleted={isCurrentTopicDone}
                hasNextTopic={Boolean(nextTopicItem)}
                onCompleteTopic={handleCompleteCurrentTopic}
                onNextTopic={handleNextTopic}
                onOpenCategoryDiscovery={() => handleOpenDiscoveryUnit(selectedTopic.categoryIndex)}
              />

              {/* Bottom Next/Prev Pagination Footer with Locking Enforcement */}
              <div className="topic-navigation-footer">
                {prevTopicItem ? (
                  <button
                    type="button"
                    className="topic-nav-btn nav-prev"
                    onClick={() =>
                      handleSelectTopic(prevTopicItem.categoryIndex, prevTopicItem.topicIndex)
                    }
                  >
                    <IconArrowLeft />
                    <div className="nav-btn-text">
                      <span className="nav-sub">Sebelumnya</span>
                      <span className="nav-title">
                        {String(prevTopicItem.globalNumber).padStart(2, '0')}. {prevTopicItem.topic.title}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {nextTopicItem ? (
                  isNextTopicUnlocked ? (
                    <button
                      type="button"
                      className="topic-nav-btn nav-next"
                      onClick={() =>
                        handleSelectTopic(nextTopicItem.categoryIndex, nextTopicItem.topicIndex)
                      }
                    >
                      <div className="nav-btn-text">
                        <span className="nav-sub">Selanjutnya</span>
                        <span className="nav-title">
                          {String(nextTopicItem.globalNumber).padStart(2, '0')}. {nextTopicItem.topic.title}
                        </span>
                      </div>
                      <IconArrowRight />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="topic-nav-btn nav-next is-locked"
                      onClick={handleAttemptLockedNext}
                      title="Materi selanjutnya terkunci 🔒. Selesaikan sub-materi ini terlebih dahulu!"
                    >
                      <div className="nav-btn-text">
                        <span className="nav-sub">Materi Selanjutnya (Terkunci)</span>
                        <span className="nav-title">
                          🔒 Selesaikan Sub-Materi Ini Dahulu
                        </span>
                      </div>
                      <IconLock />
                    </button>
                  )
                ) : (
                  <div />
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
