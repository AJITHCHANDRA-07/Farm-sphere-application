import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Crops from './pages/Crops';
import About from './pages/About';
import Contact from './pages/Contact';
import Marketplace from './pages/Marketplace';
import ExploreCrops from './pages/ExploreCrops';
import ExploreCropsTest from './pages/ExploreCropsTest';
import ExploreCropsUltraProFinal from "./pages/ExploreCropsFinal";
import ExploreSchemes from './pages/ExploreSchemes';
import Services from './pages/Services';
import EnhancedCrops from './pages/EnhancedCrops';
import StatesPage from './pages/StatesPage';
import InvestmentsPage from './pages/InvestmentsPage';
import CropsDisplay from './components/CropsDisplay';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

// PWA SERVICE WORKER REGISTRATION
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ PWA: Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 PWA: New Service Worker found');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 PWA: Service Worker updated');
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ PWA: Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('⚠️ PWA: Service Workers not supported');
  }
};

// PWA INSTALL PROMPT HANDLER
const handleInstallPrompt = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('📱 PWA: Install prompt ready');
    
    // Show install button if it exists
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'block';
    }
  });

  // Handle install button click
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
          if (choice.outcome === 'accepted') {
            console.log('✅ PWA: App installed successfully!');
            // Hide install button
            installBtn.style.display = 'none';
          } else {
            console.log('❌ PWA: App installation dismissed');
          }
        });
        deferredPrompt = null;
      }
    });
  }
};

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
  // Initialize PWA features
  useEffect(() => {
    registerServiceWorker();
    handleInstallPrompt();
  }, []);

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

          {/* PWA Install Button */}
          <button 
            id="pwa-install-btn"
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors z-50 hidden"
            style={{ display: 'none' }}
          >
            📱 Install FarmSphere
          </button>

          <div className="min-h-screen bg-background flex flex-col">
            
            <Header />

            <main className="flex-1">
              <Routes>
                {/* Public Routes - No Protection Needed */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/about" element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                } />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/marketplace" element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                } />
                <Route path="/crops" element={
                  <ProtectedRoute>
                    <Crops />
                  </ProtectedRoute>
                } />
                <Route path="/crops-data" element={
                  <ProtectedRoute>
                    <CropsDisplay />
                  </ProtectedRoute>
                } />
                <Route path="/explore-crops" element={
                  <ProtectedRoute>
                    <ExploreCropsUltraProFinal />
                  </ProtectedRoute>
                } />
                <Route path="/test-crops" element={
                  <ProtectedRoute>
                    <ExploreCropsTest />
                  </ProtectedRoute>
                } />
                <Route path="/explore-crops-ultra" element={
                  <ProtectedRoute>
                    <ExploreCropsUltraProFinal />
                  </ProtectedRoute>
                } />
                <Route path="/explore-schemes" element={
                  <ProtectedRoute>
                    <ExploreSchemes />
                  </ProtectedRoute>
                } />
                <Route path="/enhanced-crops" element={
                  <ProtectedRoute>
                    <EnhancedCrops />
                  </ProtectedRoute>
                } />
                <Route path="/states" element={
                  <ProtectedRoute>
                    <StatesPage />
                  </ProtectedRoute>
                } />
                <Route path="/investments" element={
                  <ProtectedRoute>
                    <InvestmentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/services" element={
                  <ProtectedRoute>
                    <Services />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* 404 Page */}
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