import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyle from './styles.js'
import GridOverlay from './components/GridOverlay.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

const Home = lazy(() => import('./pages/Home/Home.jsx'))
const Hubs = lazy(() => import('./pages/Hubs/Hubs.jsx'))
const IndigenousStewardship = lazy(() => import('./pages/IndigenousStewardship/IndigenousStewardship.jsx'))
const Maps = lazy(() => import('./pages/Maps/Maps.jsx'))
const FAQs = lazy(() => import('./pages/FAQs/FAQs.jsx'))
const GetInvolved = lazy(() => import('./pages/GetInvolved/GetInvolved.jsx'))

const SkipLink = styled.a`
  position: absolute;
  top: -100%;
  left: 1rem;
  z-index: 10000;
  padding: 0.75rem 1.25rem;
  background: var(--color-forest);
  color: var(--color-lime);
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;

  &:focus {
    top: 1rem;
  }
`

const MainWrapper = styled.div`
  min-height: 100vh;
`

const LOADING_SCREEN_SHOWN_KEY = 'loopTrailIntroShown'

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(LOADING_SCREEN_SHOWN_KEY) === '1'
  } catch {
    return false
  }
}

function App() {
  // Only play the intro once per session; subsequent navigations/reloads in the
  // same session skip it so the page (and LCP) is not gated behind the overlay.
  const [isLoadingComplete, setIsLoadingComplete] = useState(hasSeenIntro)

  const handleLoadingComplete = () => {
    try {
      sessionStorage.setItem(LOADING_SCREEN_SHOWN_KEY, '1')
    } catch {
      // ignore (private mode / storage disabled)
    }
    setIsLoadingComplete(true)
  }

  return (
    <>
      <GlobalStyle />
      {import.meta.env.DEV && <GridOverlay />}
      {!isLoadingComplete && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      <BrowserRouter>
        <ScrollToTop />
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <Navbar />
        <MainWrapper id="main-content">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hubs" element={<Hubs />} />
              <Route path="/indigenous-stewardship" element={<IndigenousStewardship />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/get-involved" element={<GetInvolved />} />
            </Routes>
          </Suspense>
        </MainWrapper>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
