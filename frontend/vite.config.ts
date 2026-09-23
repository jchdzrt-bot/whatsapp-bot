import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose the BACKEND_URL env var (frontend/.env) to the app via
  // import.meta.env. Vite only exposes VITE_* vars by default, so the
  // prefix list is extended rather than replaced.
  envPrefix: ["VITE_", "BACKEND_"],
})
