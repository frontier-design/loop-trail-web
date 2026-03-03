import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyle from './styles.js'
import GridOverlay from './components/GridOverlay.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Hubs from './pages/Hubs/Hubs.jsx'
import IndigenousStewardship from './pages/IndigenousStewardship/IndigenousStewardship.jsx'
import Maps from './pages/Maps/Maps.jsx'
import FAQs from './pages/FAQs/FAQs.jsx'
import GetInvolved from './pages/GetInvolved/GetInvolved.jsx'

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hubs" element={<Hubs />} />
            <Route path="/indigenous-stewardship" element={<IndigenousStewardship />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/get-involved" element={<GetInvolved />} />
          </Routes>
        </MainWrapper>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
