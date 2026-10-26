import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Mendengarkan semua interface jaringan (0.0.0.0) agar bisa diakses dari HP
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
