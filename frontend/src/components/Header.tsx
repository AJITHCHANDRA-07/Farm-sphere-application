import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';
import { weatherService, WeatherData } from '../services/weatherService';
import { Bell, X, Check, AlertCircle, TrendingUp, Users, Calendar, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Market Price Update',
      message: 'Paddy prices increased by 5% in Karimnagar market',
      time: '2 hours ago',
      read: false,
      icon: TrendingUp
    },
    {
      id: 2,
      type: 'info',
      title: 'New Scheme Available',
      message: 'Government subsidy for organic farming now available',
      time: '5 hours ago',
      read: false,
      icon: Calendar
    },
    {
      id: 3,
      type: 'alert',
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in Warangal district tomorrow',
      time: '1 day ago',
      read: true,
      icon: AlertCircle
    }
  ]);
  const [notificationCount, setNotificationCount] = useState(2);
  
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Notification functions
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    updateNotificationCount();
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setNotificationCount(0);
  };

  const updateNotificationCount = () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    setNotificationCount(unreadCount);
  };

  const addNewNotification = (type: string, title: string, message: string) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      time: 'Just now',
      read: false,
      icon: type === 'success' ? TrendingUp : type === 'alert' ? AlertCircle : Calendar
    };
    setNotifications(prev => [newNotification, ...prev]);
    updateNotificationCount();
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new notification every 30 seconds for demo
      if (Math.random() > 0.7) {
        const randomNotifications = [
          {
            type: 'success',
            title: 'Market Update',
            message: 'Cotton prices trending up in Adilabad market'
          },
          {
            type: 'info',
            title: 'New Feature',
            message: 'Crop disease detection now available in your area'
          },
          {
            type: 'alert',
            title: 'Weather Warning',
            message: 'Temperature drop expected in Medak district'
          },
          {
            type: 'success',
            title: 'Price Alert',
            message: 'Turmeric prices increased by 8% in Nizamabad'
          },
          {
            type: 'info',
            title: 'Scheme Update',
            message: 'New agricultural loan scheme announced for farmers'
          },
          {
            type: 'alert',
            title: 'Pest Alert',
            message: 'Bollworm attack reported in Khammam district'
          }
        ];
        
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNewNotification(randomNotif.type, randomNotif.title, randomNotif.message);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Check Google sign-in status when auth modal opens
  useEffect(() => {
    if (isAuthOpen) {
      checkGoogleSignInStatus();
    }
  }, [isAuthOpen]);

  const checkGoogleSignInStatus = async () => {
    try {
      // Simulate checking Google sign-in status
      await new Promise(resolve => setTimeout(resolve, 500));
      // For demo purposes, randomly return true to simulate signed-in user
      const isSignedIn = Math.random() > 0.5;
      
      if (isSignedIn) {
        const userData = {
          name: 'Farmer User',
          email: 'farmer@gmail.com',
          avatar: 'https://lh3.googleusercontent.com/a/default-user',
          id: 'google-user-id'
        };
        setGoogleUser(userData);
        setIsGoogleSignedIn(true);
      }
    } catch (error) {
      console.log('Google sign-in check failed:', error);
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && !(event.target as Element).closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Fetch weather data on component mount
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError(null);
        console.log('🌤️ Starting weather fetch...');
        
        const weatherData = await weatherService.getCurrentWeather();
        console.log('✅ Weather data received:', weatherData);
        
        setWeather(weatherData);
      } catch (error) {
        console.error('❌ Error fetching weather:', error);
        console.error('❌ Full error details:', error.message);
        
        // Set user-friendly error message
        if (error.message.includes('location access denied')) {
          setWeatherError('Location access denied. Please enable location in browser.');
        } else if (error.message.includes('timeout')) {
          setWeatherError('Location request timed out. Please try again.');
        } else {
          setWeatherError('Weather unavailable - please enable location access');
        }
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      // Simulate OTP sending
      console.log('OTP sent to:', mobileNumber);
      setIsOtpSent(true);
      setShowOtpField(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      // Handle auth logic here
      const action = isLoginMode ? 'Login' : 'Signup';
      console.log(`${action} successful with mobile:`, mobileNumber, 'and OTP:', otp);
      setIsAuthOpen(false);
      setMobileNumber('');
      setOtp('');
      setShowOtpField(false);
      setIsOtpSent(false);
      setIsLoginMode(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleAuthLoading(true);
    try {
      // If user is already signed in, use existing data
      let userData = googleUser;
      
      if (!userData) {
        // Handle Google auth logic here
        const action = isLoginMode ? 'Login' : 'Signup';
        console.log(`Google ${action} clicked`);
        
        // Simulate Google OAuth flow
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock Google user data
        userData = {
          id: 'google-user-id',
          name: 'Google User',
          email: 'user@gmail.com',
          avatar: 'https://lh3.googleusercontent.com/a/default-user'
        };
      }
      
      // Store user in localStorage (simulate successful auth)
      localStorage.setItem('token', 'google-jwt-token');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Close modal and redirect
      setIsAuthOpen(false);
      setIsLoginMode(false);
      
      // Navigate to home page after successful auth
      window.location.href = '/';
    } catch (error) {
      console.error('Google auth failed:', error);
    } finally {
      setIsGoogleAuthLoading(false);
    }
  };

  const handleQuickGoogleAuth = async () => {
    if (googleUser) {
      setIsGoogleAuthLoading(true);
      try {
        // Direct auth with existing Google user data
        localStorage.setItem('token', 'google-jwt-token');
        localStorage.setItem('user', JSON.stringify(googleUser));
        
        // Close modal and redirect
        setIsAuthOpen(false);
        setIsLoginMode(false);
        
        // Navigate to home page after successful auth
        window.location.href = '/';
      } catch (error) {
        console.error('Quick Google auth failed:', error);
      } finally {
        setIsGoogleAuthLoading(false);
      }
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b">
<div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-green-600">
                {t('header.logo')}
              </Link>
            </div>

            {/* Navigation - Centered */}
            <nav className="hidden md:flex space-x-8 mx-auto ml-60">
              <Link to="/" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                {t('header.home')}
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                {t('header.aboutUs')}
              </Link>
              
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <span className="mr-1">🌾</span>
                  {t('header.services')}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{t('header.farmingAdvisory')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('header.weatherCropUpdates')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('header.marketPrices')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('header.subsidiesSchemes')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('header.loansInsurance')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/marketplace" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <span className="mr-1">🛒</span>
                {t('header.marketplace')}
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <span className="mr-1">📞</span>
                {t('header.contact')}
              </Link>
            </nav>

            {/* Right Side Tools */}
            <div className="flex items-center space-x-4">
              {/* Language, Weather, and Notification Group */}
              <div className="flex items-center space-x-4 mr-6">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-green-600">
                    <span className="mr-1">🌐</span>
                    <span className="text-sm">{languages.find(lang => lang.code === currentLanguage)?.native || 'English'}</span>
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

                {/* Weather Widget */}
                <div className="hidden lg:flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  {weatherLoading ? (
                    <>
                      <span className="mr-1 animate-spin">�️</span>
                      <span>Loading...</span>
                    </>
                  ) : weatherError ? (
                    <>
                      <span className="mr-1">❌</span>
                      <span>{weatherError}</span>
                    </>
                  ) : weather ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{weatherService.getWeatherEmoji(weather.condition)}</span>
                      <span className="font-medium">{weather.temperature}°C</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600 capitalize text-xs">{weather.condition}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600 text-xs">{weather.location}</span>
                    </div>
                  ) : (
                    <>
                      <span className="mr-1">🌦️</span>
                      <span>Weather</span>
                    </>
                  )}
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <div className="flex items-center space-x-2">
                            {notificationCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-green-600 hover:text-green-700 font-medium"
                              >
                                Mark all as read
                              </button>
                            )}
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start">
                                <div className={`p-2 rounded-full mr-3 ${
                                  notification.type === 'success' ? 'bg-green-100' :
                                  notification.type === 'alert' ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                  <notification.icon className={`w-4 h-4 ${
                                    notification.type === 'success' ? 'text-green-600' :
                                    notification.type === 'alert' ? 'text-red-600' : 'text-blue-600'
                                  }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm font-medium text-gray-900 ${
                                      !notification.read ? 'font-semibold' : ''
                                    }`}>
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-gray-200">
                        <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Auth Button - Styled login/signup button */}
              <button 
                onClick={() => {
                  setIsAuthOpen(true);
                  setIsLoginMode(false);
                }}
                className="button-submit mr-8" 
                style={{
                  margin: '0',
                  backgroundColor: '#151717',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '10px',
                  height: '40px',
                  padding: '0 20px',
                  cursor: 'pointer'
                }}
              >
                {t('header.signIn')}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  About Us
                </Link>
                <div className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  🌾 Services
                </div>
                <Link to="/marketplace" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  🛒 Marketplace
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  📞 Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {isLoginMode ? 'Login to FarmSphere' : 'Join FarmSphere'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isLoginMode ? 'Welcome back! Sign in to continue' : 'Make it simple with mobile number or Google'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Google One Tap - If user is already signed in */}
            {isGoogleSignedIn && googleUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-3">
                  <img 
                    src={googleUser.avatar} 
                    alt={googleUser.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{googleUser.name}</p>
                    <p className="text-sm text-gray-600">{googleUser.email}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleQuickGoogleAuth}
                  disabled={isGoogleAuthLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  style={{
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  {isGoogleAuthLoading ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isLoginMode ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Continue as {googleUser.name}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Using your Google account for FarmSphere
                </p>
              </div>
            )}

            {/* Standard Google Auth - If user not signed in */}
            {(!isGoogleSignedIn || !googleUser) && (
              <Button 
                onClick={handleGoogleAuth}
                disabled={isGoogleAuthLoading}
                variant="outline" 
                className="w-full flex items-center justify-center gap-3"
                style={{
                  backgroundColor: '#4285F4',
                  color: 'white',
                  border: 'none',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {isGoogleAuthLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLoginMode ? 'Signing in...' : 'Signing up...'}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isLoginMode ? 'Login with Google' : 'Sign up with Google'}
                  </>
                )}
              </Button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or {isLoginMode ? 'login' : 'sign up'} with mobile</span>
              </div>
            </div>

            {/* Mobile Signup Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex space-x-2">
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    className="flex-1"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    disabled={isOtpSent}
                  />
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={mobileNumber.length !== 10 || isOtpSent}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Send OTP
                  </Button>
                </div>
              </div>

              {showOtpField && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full"
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                style={{
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
                disabled={showOtpField && otp.length !== 6}
              >
                {showOtpField ? (isLoginMode ? 'Login' : 'Sign up') : (isLoginMode ? 'Send OTP to Login' : 'Send OTP to Sign up')}
              </Button>
            </form>

            {/* Login option for existing users */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                <button 
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    console.log(`Switched to ${isLoginMode ? 'signup' : 'login'} mode`);
                  }}
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  {isLoginMode ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
