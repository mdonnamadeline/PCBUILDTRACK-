import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{ 
    host: "192.168.10.19",
    port:80,
    open: true
  },
})
