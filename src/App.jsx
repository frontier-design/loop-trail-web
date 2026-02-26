import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalStyle from './styles.js'
import GridOverlay from './components/GridOverlay.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Hubs from './pages/Hubs/Hubs.jsx'
import IndigenousStewardship from './pages/IndigenousStewardship/IndigenousStewardship.jsx'
import Maps from './pages/Maps/Maps.jsx'
import FAQs from './pages/FAQs/FAQs.jsx'
import GetInvolved from './pages/GetInvolved/GetInvolved.jsx'

function App() {
  return (
    <>
      <GlobalStyle />
      {import.meta.env.DEV && <GridOverlay />}
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hubs" element={<Hubs />} />
          <Route path="/indigenous-stewardship" element={<IndigenousStewardship />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/get-involved" element={<GetInvolved />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
