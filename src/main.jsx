import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { prefetchRoute } from './api/prefetchCache.js'

// Start the CMS fetch for the current route immediately, in parallel with React
// bootstrapping, so content isn't gated behind bundle parse + mount.
prefetchRoute(window.location.pathname)

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)
