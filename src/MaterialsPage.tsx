import { useState, useMemo } from 'react'
import MaterialTopicCard from './MaterialTopicCard'
import CategoryDiscoveryUnit from './CategoryDiscoveryUnit'
import { materialCategories, type MaterialTopic } from './materialsData'
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconBrain,
  IconChevronDown,
  IconChevronRight,
} from './Icons'
import './MaterialsPage.css'

type MaterialsPageProps = {
  onBackHome: () => void
}

interface FlatTopic {
  categoryIndex: number
  topicIndex: number
  categoryTitle: string
  topic: MaterialTopic
  globalNumber: number
}

export default function MaterialsPage({ onBackHome }: MaterialsPageProps) {
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

  const currentFlatIndex = allTopics.findIndex(
    (item) =>
      item.categoryIndex === selectedTopic.categoryIndex &&
      item.topicIndex === selectedTopic.topicIndex
  )

  const currentTopicItem = allTopics[currentFlatIndex] || allTopics[0]
  const currentCategory = materialCategories[selectedTopic.categoryIndex] || materialCategories[0]
  const prevTopicItem = currentFlatIndex > 0 ? allTopics[currentFlatIndex - 1] : null
  const nextTopicItem = currentFlatIndex < allTopics.length - 1 ? allTopics[currentFlatIndex + 1] : null

  const toggleCategory = (catIdx: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catIdx]: !prev[catIdx],
    }))
  }

  const handleSelectTopic = (categoryIndex: number, topicIndex: number) => {
    setSelectedTopic({ categoryIndex, topicIndex })
    setViewingDiscoveryUnit(false)
    setIsMobileSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenDiscoveryUnit = (categoryIndex: number) => {
    setSelectedTopic((prev) => ({ ...prev, categoryIndex }))
    setViewingDiscoveryUnit(true)
    setIsMobileSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="materials-layout-wrapper">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="materials-top-bar">
        <a
          className="back-home-link"
          href="#beranda"
          onClick={(event) => {
            event.preventDefault()
            onBackHome()
          }}
        >
          <IconArrowLeft /> Kembali ke Beranda
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
            <span className="sidebar-title">Katalog Materi</span>
            <span className="sidebar-counter">{allTopics.length} Topik</span>
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
                      {/* Featured Button: Whole Chapter Discovery Learning Unit */}
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
                        <span className="pill-text">Unit Discovery Learning (1 Bab)</span>
                      </button>

                      {category.topics.map((topic, topIdx) => {
                        const isSelected =
                          !viewingDiscoveryUnit &&
                          selectedTopic.categoryIndex === catIdx &&
                          selectedTopic.topicIndex === topIdx

                        // Find global number
                        const flatObj = allTopics.find(
                          (t) => t.categoryIndex === catIdx && t.topicIndex === topIdx
                        )
                        const numStr = String(flatObj?.globalNumber || 1).padStart(2, '0')

                        return (
                          <button
                            key={topic.title}
                            type="button"
                            className={`sidebar-topic-item ${isSelected ? 'is-active' : ''}`}
                            onClick={() => handleSelectTopic(catIdx, topIdx)}
                            aria-current={isSelected ? 'page' : undefined}
                          >
                            <span className="topic-num">{numStr}</span>
                            <span className="topic-name">{topic.title}</span>
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
              </span>
            </button>

            <button
              type="button"
              className={`mode-switch-btn btn-discovery-tab ${viewingDiscoveryUnit ? 'active' : ''}`}
              onClick={() => setViewingDiscoveryUnit(true)}
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
                </span>
              </nav>

              {/* Render the Topic Card */}
              <MaterialTopicCard
                key={`${currentTopicItem.categoryTitle}-${currentTopicItem.topic.title}`}
                number={String(currentTopicItem.globalNumber).padStart(2, '0')}
                topic={currentTopicItem.topic}
                categoryTitle={currentTopicItem.categoryTitle}
                onOpenCategoryDiscovery={() => setViewingDiscoveryUnit(true)}
              />

              {/* Bottom Next/Prev Pagination Footer */}
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
