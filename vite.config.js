import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Import 'path' dari Node.js

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // 2. Tambahkan konfigurasi 'resolve'
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})