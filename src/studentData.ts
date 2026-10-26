export interface StudentProfile {
  name: string
  className: string
  groupName?: string
  groupMembers?: string
}

export interface GroupData {
  groupName: string
  members: string[]
  isSaved: boolean
}

export interface ChallengeScore {
  challengeId: string
  title: string
  category: 'individu' | 'kelompok' | 'hots'
  level: number
  score: number
  maxScore: number
  completedAt: string
}

export interface DiscoveryNoteData {
  prediction: string
  observationNotes: Record<number, string>
  conclusion: string
  reflection1: string
  reflection2: string
  reflection3: string
  activeStage: number
  completedStages: number[]
}

const PROFILE_KEY = 'sinaupy_student_profile'
const SCORES_KEY = 'sinaupy_challenge_scores'
const GROUP_KEY = 'sinaupy_group_data'
const DISCOVERY_KEY = 'sinaupy_discovery_data'
const LEGACY_PROFILE_KEY = 'pythonlab_student_profile'
const LEGACY_SCORES_KEY = 'pythonlab_challenge_scores'

export function getStudentProfile(): StudentProfile {
  try {
    // Check sessionStorage first as per prompt requirement
    const sessionRaw = sessionStorage.getItem(PROFILE_KEY)
    if (sessionRaw) {
      return JSON.parse(sessionRaw) as StudentProfile
    }
    // Fallback to localStorage
    const localRaw = localStorage.getItem(PROFILE_KEY) || localStorage.getItem(LEGACY_PROFILE_KEY)
    if (localRaw) {
      const parsed = JSON.parse(localRaw) as StudentProfile
      sessionStorage.setItem(PROFILE_KEY, localRaw)
      return parsed
    }
  } catch {
    // ignore
  }
  return {
    name: '',
    className: '',
    groupName: '',
    groupMembers: '',
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    const serialized = JSON.stringify(profile)
    sessionStorage.setItem(PROFILE_KEY, serialized)
    localStorage.setItem(PROFILE_KEY, serialized)
    window.dispatchEvent(new Event('sinaupy:profile_updated'))
    window.dispatchEvent(new Event('pythonlab:profile_updated'))
  } catch {
    // ignore
  }
}

export function getGroupData(activeStudentName?: string): GroupData {
  const defaultMember = activeStudentName && activeStudentName.trim() ? activeStudentName.trim() : 'Siswa'
  try {
    const raw = sessionStorage.getItem(GROUP_KEY) || localStorage.getItem(GROUP_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as GroupData
      // Ensure active student is the first member and at least 3 members exist
      if (!parsed.members || parsed.members.length === 0) {
        parsed.members = [defaultMember, '', '']
      } else {
        parsed.members[0] = defaultMember
        while (parsed.members.length < 3) {
          parsed.members.push('')
        }
      }
      return parsed
    }
  } catch {
    // ignore
  }
  return {
    groupName: '',
    members: [defaultMember, '', ''],
    isSaved: false,
  }
}

export function saveGroupData(groupData: GroupData): void {
  try {
    const serialized = JSON.stringify(groupData)
    sessionStorage.setItem(GROUP_KEY, serialized)
    localStorage.setItem(GROUP_KEY, serialized)
    window.dispatchEvent(new Event('sinaupy:group_updated'))
  } catch {
    // ignore
  }
}


export function getChallengeScores(): ChallengeScore[] {
  try {
    const raw = localStorage.getItem(SCORES_KEY) || localStorage.getItem(LEGACY_SCORES_KEY)
    if (raw) {
      return JSON.parse(raw) as ChallengeScore[]
    }
  } catch {
    // ignore
  }
  return []
}

export function saveChallengeScore(scoreEntry: Omit<ChallengeScore, 'completedAt'>): void {
  try {
    const scores = getChallengeScores()
    const now = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const existingIndex = scores.findIndex((s) => s.challengeId === scoreEntry.challengeId)
    if (existingIndex >= 0) {
      if (scoreEntry.score >= scores[existingIndex].score) {
        scores[existingIndex] = {
          ...scoreEntry,
          completedAt: now,
        }
      }
    } else {
      scores.push({
        ...scoreEntry,
        completedAt: now,
      })
    }

    localStorage.setItem(SCORES_KEY, JSON.stringify(scores))
    window.dispatchEvent(new Event('sinaupy:scores_updated'))
    window.dispatchEvent(new Event('pythonlab:scores_updated'))
  } catch {
    // ignore
  }
}

export function resetAllScores(): void {
  try {
    localStorage.removeItem(SCORES_KEY)
    localStorage.removeItem(LEGACY_SCORES_KEY)
    window.dispatchEvent(new Event('sinaupy:scores_updated'))
    window.dispatchEvent(new Event('pythonlab:scores_updated'))
  } catch {
    // ignore
  }
}

export function calculateTotalScore(scores: ChallengeScore[]): number {
  return scores.reduce((total, item) => total + item.score, 0)
}

export function getDiscoveryData(topicKey: string): DiscoveryNoteData {
  try {
    const raw = localStorage.getItem(DISCOVERY_KEY)
    if (raw) {
      const all = JSON.parse(raw) as Record<string, DiscoveryNoteData>
      if (all[topicKey]) {
        return all[topicKey]
      }
    }
  } catch {
    // ignore
  }
  return {
    prediction: '',
    observationNotes: {},
    conclusion: '',
    reflection1: '',
    reflection2: '',
    reflection3: '',
    activeStage: 1,
    completedStages: [],
  }
}

export function saveDiscoveryData(topicKey: string, partial: Partial<DiscoveryNoteData>): void {
  try {
    const raw = localStorage.getItem(DISCOVERY_KEY)
    const all = raw ? (JSON.parse(raw) as Record<string, DiscoveryNoteData>) : {}
    const existing = all[topicKey] || {
      prediction: '',
      observationNotes: {},
      conclusion: '',
      reflection1: '',
      reflection2: '',
      reflection3: '',
      activeStage: 1,
      completedStages: [],
    }
    all[topicKey] = {
      ...existing,
      ...partial,
    }
    localStorage.setItem(DISCOVERY_KEY, JSON.stringify(all))
    window.dispatchEvent(new Event('sinaupy:discovery_updated'))
  } catch {
    // ignore
  }
}


