import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';
import { X, Users, ArrowRight } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();
  
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { user, loading, logout } = useAuth();

  // Check if user profile is complete
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, farm_size, district')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          const isComplete = data.full_name && data.farm_size && data.district;
          setProfileComplete(isComplete);
        }
      } catch (err) {
        console.error('Error checking profile completion:', err);
        setProfileComplete(false);
      }
    };

    checkProfileCompletion();
  }, [user]);
  
  
  
  return (
    <>
      <header className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 shadow-lg border-b border-green-400 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://eatrevolutionindia.com/wp-content/uploads/2025/05/farmers-empowerment.jpg')`
          }}
        />
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo only */}
            <div className="flex items-center">
              {/* Hamburger button - top left of header */}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-lg text-white hover:bg-white/20 lg:hidden mr-4"
              >
                ☰
              </button>
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg">
                    <img 
                      src="https://eatrevolutionindia.com/wp-content/uploads/2025/05/farmers-empowerment.jpg"
                      alt="FarmSphere" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      fetchpriority="high"
                    />
                  </div>
                  <span className="drop-shadow-lg hidden lg:block">{t('header.logo')}</span>
                </Link>
              </div>
            </div>

            {/* Center - Navigation items only */}
            <div className="flex-1 flex justify-center">
              {user && (
                <nav className="hidden lg:flex space-x-6">
                  <Link to="/" className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-bold transition-colors">
                    {t('header.home')}
                  </Link>
                  <Link to="/about" className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-bold transition-colors">
                    {t('header.aboutUs')}
                  </Link>
                  <Link to="/services" className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center">
                    🌾 {t('header.services')}
                  </Link>
                  <Link to="/marketplace" className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center">
                    🛒 {t('header.marketplace')}
                  </Link>
                  <Link to="/contact" className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center">
                    📞 {t('header.contact')}
                  </Link>
                </nav>
              )}
            </div>
            
            {/* Right Side Tools */}
            <div className="flex items-center space-x-4">
              
              {/* Language Selector */}
              <div className="flex items-center space-x-4 mr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-white hover:text-yellow-300 transition-colors">
                    <span className="mr-1">🌐</span>
                    <span className="text-sm font-medium">{languages.find(lang => lang.code === currentLanguage)?.native || 'English'}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                      >
                        {lang.native} ({lang.name})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Auth Button */}
              {!loading && user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 hover:opacity-90 transition-all hover:scale-105"
                  >
                    <div className="relative">
                      <img 
                        src={user.user_metadata?.avatar_url || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_rp_50_assets&w=740&q=80'}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-3 border-yellow-400 shadow-lg"
                        alt="User Avatar"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center text-xs">
                        {profileComplete ? '⭐' : ''}
                      </div>
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-xs md:text-sm font-bold text-white drop-shadow-md">
                        {user.user_metadata?.full_name || 
                         user.phone || 
                         user.email || 
                         'Farmer'}
                      </div>
                      <div className="text-xs text-yellow-200 font-medium">
                        👨‍🌾 Verified Farmer
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={logout}
                    className="hidden md:block px-4 py-2 text-sm font-semibold bg-white/20 backdrop-blur-sm
                           text-white rounded-lg hover:bg-white/30 
                           transition-all duration-200 border border-white/30 hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              ) : !loading && !user ? (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3 py-2 md:px-5 md:py-2.5 bg-yellow-400 text-green-800 
                         rounded-lg font-bold hover:bg-yellow-300 
                         transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
                >
                  {t('header.signIn')}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Left side drawer overlay */}
      {menuOpen && (
        <>
          {/* Dark overlay behind drawer */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Left drawer panel */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out">
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 bg-green-600">
              <span className="text-white font-bold text-xl">
                🌾 FarmSphere
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-2xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col p-4 gap-2">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
              >
                🏠 {t('header.home')}
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
              >
                📋 {t('header.aboutUs')}
              </NavLink>

              <NavLink
                to="/services"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
              >
                🌾 {t('header.services')}
              </NavLink>

              <NavLink
                to="/marketplace"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
              >
                🛒 {t('header.marketplace')}
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
              >
                📞 {t('header.contact')}
              </NavLink>

              {user && (
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-4 rounded-xl text-lg font-medium transition-colors ${
                      isActive 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`
                  }
                >
                  👤 {t('header.profile')}
                </NavLink>
              )}
            </nav>

            {/* Logout option below navigation for mobile */}
            {user && (
              <div className="px-4 pb-4">
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full p-4 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-50 text-lg flex items-center justify-center gap-2"
                >
                  🚪 {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(user) => {
            console.log('✅ User logged in successfully:', user);
          }}
        />
      )}
    </>
  );
};

export default Header;
