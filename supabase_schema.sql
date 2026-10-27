-- ==============================================================================
-- SINAUPY - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- File ini dieksekusi sekali di Supabase Dashboard -> SQL Editor
-- untuk mengaktifkan tabel penyimpanan nilai terpusat dan proteksi data per siswa.
-- ==============================================================================

-- 1. Buat Tabel student_scores
CREATE TABLE IF NOT EXISTS public.student_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_class TEXT NOT NULL,
    group_name TEXT,
    activity_id TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('individu', 'kelompok', 'hots', 'praktik')),
    level INTEGER NOT NULL DEFAULT 1,
    score NUMERIC NOT NULL DEFAULT 0,
    max_score NUMERIC NOT NULL DEFAULT 100,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Mencegah duplikasi data nilai untuk aktivitas yang sama oleh siswa yang sama
    CONSTRAINT student_scores_user_activity_unique UNIQUE (user_id, activity_id)
);

-- 2. Buat Index untuk Performa Query
CREATE INDEX IF NOT EXISTS idx_student_scores_user_id ON public.student_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_student_scores_class ON public.student_scores(student_class);
CREATE INDEX IF NOT EXISTS idx_student_scores_activity ON public.student_scores(activity_type);

-- 3. Aktifkan Row Level Security (RLS)
-- Keamanan mutlak: Tidak ada yang bisa mengakses baris tabel tanpa policy yang sah
ALTER TABLE public.student_scores ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan Keamanan RLS (Row Level Security Policies)
-- A. Siswa HANYA dapat membaca nilai miliknya sendiri
CREATE POLICY "Siswa hanya dapat melihat nilai miliknya"
    ON public.student_scores
    FOR SELECT
    USING (auth.uid() = user_id);

-- B. Siswa HANYA dapat menyimpan nilai dengan ID akunnya sendiri
CREATE POLICY "Siswa hanya dapat menambahkan nilai miliknya"
    ON public.student_scores
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- C. Siswa HANYA dapat memperbarui nilai miliknya sendiri (saat skor lebih tinggi)
CREATE POLICY "Siswa hanya dapat memperbarui nilai miliknya"
    ON public.student_scores
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- D. Siswa HANYA dapat menghapus nilai miliknya sendiri (misal saat reset)
CREATE POLICY "Siswa hanya dapat menghapus nilai miliknya"
    ON public.student_scores
    FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Berikan Izin Akses Tabel ke Role Terautentikasi (authenticated)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_scores TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ==============================================================================
-- SELESAI: Skema database dan RLS siap digunakan oleh aplikasi SinauPy.
-- ==============================================================================

