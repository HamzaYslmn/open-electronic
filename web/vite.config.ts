/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages serves this project from https://<user>.github.io/open-electronic/,
 * so every asset URL needs that prefix. Change this if you fork under a
 * different repository name.
 *
 * It is set unconditionally rather than only for `build`: `vite preview` runs
 * with command === 'serve', so a conditional base makes preview serve at "/"
 * while the built HTML points at the prefix, and preview 404s on its own
 * bundle. One base everywhere means preview reproduces production exactly.
 * The dev server redirects "/" to the prefix on its own.
 */
const REPO_BASE = '/open-electronic/'

export default defineConfig({
  base: REPO_BASE,
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
