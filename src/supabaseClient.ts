import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

// Interface representing the database row in public.student_scores
export interface DbStudentScore {
  id?: string
  user_id: string
  student_name: string
  student_class: string
  group_name?: string | null
  activity_id: string
  activity_name: string
  activity_type: 'individu' | 'kelompok' | 'hots'
  level: number
  score: number
  max_score: number
  completed_at: string
  created_at?: string
  updated_at?: string
}

// Retrieve environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.trim() !== '' &&
    !supabaseUrl.includes('placeholder') &&
    supabaseAnonKey &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseAnonKey.includes('placeholder')
  )
}

// Initialize Supabase Client if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export interface AuthResponse {
  user: User | null
  error: string | null
}

/**
 * Register a new student account using email and password
 */
export async function signUpStudent(
  email: string,
  pass: string,
  fullName: string,
  className: string
): Promise<AuthResponse> {
  if (!supabase) {
    return { user: null, error: 'Database Supabase belum dikonfigurasi pada environment (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
          class_name: className,
        },
      },
    })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan saat mendaftar.'
    return { user: null, error: message }
  }
}

/**
 * Sign in existing student account
 */
export async function signInStudent(email: string, pass: string): Promise<AuthResponse> {
  if (!supabase) {
    return { user: null, error: 'Database Supabase belum dikonfigurasi.' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan saat masuk.'
    return { user: null, error: message }
  }
}

/**
 * Sign out current student
 */
export async function signOutStudent(): Promise<{ error: string | null }> {
  if (!supabase) return { error: null }
  try {
    const { error } = await supabase.auth.signOut()
    return { error: error ? error.message : null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal keluar sesi.'
    return { error: message }
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentAuthUser(): Promise<User | null> {
  if (!supabase) return null
  try {
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch {
    return null
  }
}

/**
 * Fetch all scores for the authenticated student from Supabase
 */
export async function fetchScoresFromCloud(): Promise<{
  scores: DbStudentScore[]
  error: string | null
}> {
  if (!supabase) {
    return { scores: [], error: 'Supabase belum dikonfigurasi.' }
  }

  try {
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.user) {
      return { scores: [], error: 'Siswa belum terautentikasi di cloud.' }
    }

    // Query will automatically apply RLS where user_id = auth.uid()
    const { data, error } = await supabase
      .from('student_scores')
      .select('*')
      .order('completed_at', { ascending: false })

    if (error) {
      return { scores: [], error: error.message }
    }

    return { scores: (data as DbStudentScore[]) || [], error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat nilai dari cloud database.'
    return { scores: [], error: message }
  }
}

/**
 * Upsert score to Supabase database.
 * Prevents duplicates via unique constraint on (user_id, activity_id).
 */
export async function saveScoreToCloud(scoreData: Omit<DbStudentScore, 'user_id'>): Promise<{
  success: boolean
  error: string | null
}> {
  if (!supabase) {
    return { success: false, error: 'Database cloud belum terhubung.' }
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      return { success: false, error: 'Sesi akun siswa belum aktif.' }
    }

    const payload: DbStudentScore = {
      ...scoreData,
      user_id: userData.user.id,
      updated_at: new Date().toISOString(),
    }

    // Use upsert on conflict (user_id, activity_id)
    const { error } = await supabase
      .from('student_scores')
      .upsert(payload, {
        onConflict: 'user_id,activity_id',
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Koneksi database gagal saat menyimpan nilai.'
    return { success: false, error: message }
  }
}

