import {
  isSupabaseConfigured,
  saveScoreToCloud,
  fetchScoresFromCloud,
  getCurrentAuthUser,
} from './supabaseClient'

export interface StudentProfile {
  name: string
  className: string
  groupName?: string
  groupMembers?: string
  email?: string
  authId?: string
  isCloudAccount?: boolean
}

export interface GroupData {
  groupName: string
  members: string[]
  isSaved: boolean
}

export interface ChallengeScore {
  challengeId: string
  title: string
  category: 'individu' | 'kelompok' | 'hots' | 'praktik'
  level: number
  score: number
  maxScore: number
  completedAt: string
  cloudSyncStatus?: 'synced' | 'local_only' | 'error'
  cloudErrorMsg?: string
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
    const sessionRaw = sessionStorage.getItem(PROFILE_KEY)
    if (sessionRaw) {
      return JSON.parse(sessionRaw) as StudentProfile
    }
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
    isCloudAccount: false,
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

export function clearStudentProfile(): void {
  try {
    sessionStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem(PROFILE_KEY)
    sessionStorage.removeItem('sinaupy_session_initialized')
    window.dispatchEvent(new Event('sinaupy:profile_updated'))
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

/**
 * Save a challenge score.
 * Updates local storage immediately, then persists to Supabase cloud if authenticated.
 * Returns exact status so caller can show accurate success/error feedback.
 */
export async function saveChallengeScore(
  scoreEntry: Omit<ChallengeScore, 'completedAt' | 'cloudSyncStatus' | 'cloudErrorMsg'>
): Promise<{
  success: boolean
  cloudStatus: 'synced' | 'local_only' | 'error'
  message: string
}> {
  const profile = getStudentProfile()
  const scores = getChallengeScores()
  const now = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  let cloudStatus: 'synced' | 'local_only' | 'error' = 'local_only'
  let cloudErrorMsg: string | null = null

  // If Supabase is configured and student has an active session
  if (isSupabaseConfigured()) {
    try {
      const authUser = await getCurrentAuthUser()
      if (authUser) {
        const cloudRes = await saveScoreToCloud({
          student_name: profile.name || 'Siswa',
          student_class: profile.className || 'X-1',
          group_name: profile.groupName || null,
          activity_id: scoreEntry.challengeId,
          activity_name: scoreEntry.title,
          activity_type: scoreEntry.category,
          level: scoreEntry.level,
          score: scoreEntry.score,
          max_score: scoreEntry.maxScore,
          completed_at: new Date().toISOString(),
        })

        if (cloudRes.success) {
          cloudStatus = 'synced'
        } else {
          cloudStatus = 'error'
          cloudErrorMsg = cloudRes.error
        }
      }
    } catch (err: unknown) {
      cloudStatus = 'error'
      cloudErrorMsg = err instanceof Error ? err.message : 'Kesalahan jaringan Supabase'
    }
  }

  const newEntry: ChallengeScore = {
    ...scoreEntry,
    completedAt: now,
    cloudSyncStatus: cloudStatus,
    cloudErrorMsg: cloudErrorMsg || undefined,
  }

  // Deduplicate / Upsert into local storage
  const existingIndex = scores.findIndex((s) => s.challengeId === scoreEntry.challengeId)
  if (existingIndex >= 0) {
    if (scoreEntry.score >= scores[existingIndex].score) {
      scores[existingIndex] = newEntry
    }
  } else {
    scores.push(newEntry)
  }

  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores))
    window.dispatchEvent(new Event('sinaupy:scores_updated'))
    window.dispatchEvent(new Event('pythonlab:scores_updated'))
  } catch {
    // ignore
  }

  if (cloudStatus === 'synced') {
    return {
      success: true,
      cloudStatus: 'synced',
      message: `Nilai ${scoreEntry.score} poin berhasil disimpan dan tersinkronisasi ke cloud database Supabase.`,
    }
  } else if (cloudStatus === 'error') {
    return {
      success: false,
      cloudStatus: 'error',
      message: `Nilai tersimpan di perangkat lokal, namun gagal tersinkron ke database cloud: ${cloudErrorMsg}`,
    }
  } else {
    return {
      success: true,
      cloudStatus: 'local_only',
      message: `Nilai ${scoreEntry.score} poin berhasil disimpan di perangkat lokal (Mode Akun Tamu).`,
    }
  }
}

/**
 * Synchronize scores with Supabase cloud database.
 * Merges cloud records with local records.
 */
export async function syncScoresWithCloud(): Promise<{
  scores: ChallengeScore[]
  cloudSynced: boolean
  error?: string
}> {
  if (!isSupabaseConfigured()) {
    return { scores: getChallengeScores(), cloudSynced: false }
  }

  const authUser = await getCurrentAuthUser()
  if (!authUser) {
    return { scores: getChallengeScores(), cloudSynced: false }
  }

  const { scores: cloudScores, error } = await fetchScoresFromCloud()
  if (error) {
    return { scores: getChallengeScores(), cloudSynced: false, error }
  }

  const profile = getStudentProfile()
  const localScores = getChallengeScores()
  const mergedMap = new Map<string, ChallengeScore>()

  // Load existing cloud scores into map
  for (const cs of cloudScores) {
    mergedMap.set(cs.activity_id, {
      challengeId: cs.activity_id,
      title: cs.activity_name,
      category: cs.activity_type,
      level: cs.level,
      score: Number(cs.score),
      maxScore: Number(cs.max_score),
      completedAt: new Date(cs.completed_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      cloudSyncStatus: 'synced',
    })
  }

  // Compare with local scores: if local has a higher score or an un-uploaded score, push to cloud
  for (const ls of localScores) {
    const existing = mergedMap.get(ls.challengeId)
    if (!existing || ls.score > existing.score) {
      mergedMap.set(ls.challengeId, {
        ...ls,
        cloudSyncStatus: 'synced',
      })

      // Push to Supabase cloud
      await saveScoreToCloud({
        student_name: profile.name || 'Siswa',
        student_class: profile.className || 'X-1',
        group_name: profile.groupName || null,
        activity_id: ls.challengeId,
        activity_name: ls.title,
        activity_type: ls.category,
        level: ls.level,
        score: ls.score,
        max_score: ls.maxScore,
        completed_at: new Date().toISOString(),
      })
    }
  }

  const finalScores = Array.from(mergedMap.values())
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(finalScores))
    window.dispatchEvent(new Event('sinaupy:scores_updated'))
  } catch {
    // ignore
  }

  return { scores: finalScores, cloudSynced: true }
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
