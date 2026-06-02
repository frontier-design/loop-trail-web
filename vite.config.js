import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Don't eagerly <link rel="modulepreload"> the heavy map library on first load.
    // It's only needed by the lazy-loaded map (below the fold), so let it load on demand.
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !dep.includes('vendor-maplibre')),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/react/')) return 'vendor-react'
          if (id.includes('node_modules/react-router')) return 'vendor-react'
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/maplibre-gl')) return 'vendor-maplibre'
          if (id.includes('node_modules/styled-components')) return 'vendor-styled'
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
})
