import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// viteSingleFile: hasil build jadi satu file index.html (bisa dibuka dengan klik dua kali)
export default defineConfig({ base: './', plugins: [vue(), viteSingleFile()] })
