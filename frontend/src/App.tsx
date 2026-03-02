import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Crops from './pages/Crops';
import About from './pages/About';
import Contact from './pages/Contact';
import Marketplace from './pages/Marketplace';
import ExploreCrops from './pages/ExploreCrops';
import ExploreCropsTest from './pages/ExploreCropsTest';
import ExploreCropsUltraProFinal from "./pages/ExploreCropsUltraProFinal";
import ExploreSchemes from './pages/ExploreSchemes';
import EnhancedCrops from './pages/EnhancedCrops';
import StatesPage from './pages/StatesPage';
import InvestmentsPage from './pages/InvestmentsPage';
import CropsDisplay from './components/CropsDisplay';
import NotFound from './pages/NotFound';
import './App.css';


// PERFECT SCROLL TO TOP COMPONENT
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🔥 Disable browser automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 🔥 Instantly jump to top (no animation)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <ScrollToTop />

          <div className="min-h-screen bg-background flex flex-col">
            
            <Header />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/crops-data" element={<CropsDisplay />} />
                <Route path="/explore-crops" element={<ExploreCropsUltraProFinal />} />
                <Route path="/test-crops" element={<ExploreCropsTest />} />
                <Route path="/explore-crops-ultra" element={<ExploreCropsUltraProFinal />} />
                <Route path="/explore-schemes" element={<ExploreSchemes />} />
                <Route path="/enhanced-crops" element={<EnhancedCrops />} />
                <Route path="/states" element={<StatesPage />} />
                <Route path="/investments" element={<InvestmentsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />

          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;