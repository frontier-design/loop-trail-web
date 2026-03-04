import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyle from './styles.js'
import GridOverlay from './components/GridOverlay.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

const Home = lazy(() => import('./pages/Home/Home.jsx'))
const Hubs = lazy(() => import('./pages/Hubs/Hubs.jsx'))
const IndigenousStewardship = lazy(() => import('./pages/IndigenousStewardship/IndigenousStewardship.jsx'))
const Maps = lazy(() => import('./pages/Maps/Maps.jsx'))
const FAQs = lazy(() => import('./pages/FAQs/FAQs.jsx'))
const GetInvolved = lazy(() => import('./pages/GetInvolved/GetInvolved.jsx'))

const MainWrapper = styled.div`
  min-height: 100vh;
`

function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)


  return (
    <>
      <GlobalStyle />
      {import.meta.env.DEV && <GridOverlay />}
      {!isLoadingComplete && (
        <LoadingScreen onComplete={() => setIsLoadingComplete(true)} />
      )}
      <BrowserRouter>
        <Navbar />
        <MainWrapper>
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
