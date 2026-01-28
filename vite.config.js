import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // <-- this makes it reachable on your LAN
    port: 5173,      // optional, but keeps it consistent
  },
})
