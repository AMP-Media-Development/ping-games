import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Docs from './pages/Docs.jsx'
import Marketplace from './pages/Marketplace.jsx'
import Support from './pages/Support.jsx'

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      <Footer />
    </HashRouter>
  )
}
