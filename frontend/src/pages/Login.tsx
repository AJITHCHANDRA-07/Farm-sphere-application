import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';

// Add custom styles for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInSlideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-slide-down {
    animation: fadeInSlideDown 0.8s ease-out;
  }
`;
document.head.appendChild(styleSheet);

const Login = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🎯 AUTO-DETECT DISTRICT (reuse from Profile.tsx)
  const detectDistrict = async () => {
    return new Promise<string>((resolve) => {
      if (!navigator.geolocation) {
        resolve('Hyderabad');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const rawDistrict = data.address?.state_district || 'Hyderabad';
            
            // 🎯 EXACT SAME DISTRICT MAP
            const DISTRICT_MAP: { [key: string]: string } = {
              'hyderabad': 'Hyderabad',
              'rangareddy': 'Rangareddy',
              'medchal': 'Medchal',
              'siddipet': 'Siddipet',
              'sangareddy': 'Sangareddy',
              'vikarabad': 'Vikarabad',
              'medak': 'Medak',
              'nizamabad': 'Nizamabad',
              'kamareddy': 'Kamareddy',
              'karimnagar': 'Karimnagar',
              'peddapalli': 'Peddapalli',
              'jagitial': 'Jagitial',
              'rajanna': 'Rajanna',
              'warangal': 'Warangal',
              'hanamkonda': 'Hanamkonda',
              'jangaon': 'Jangaon',
              'mahabubabad': 'Mahabubabad',
              'khammam': 'Khammam',
              'bhadradri': 'Bhadradri',
              'mahabubnagar': 'Mahabubnagar',
              'nagarkurnool': 'Nagarkurnool',
              'wanaparthy': 'Wanaparthy',
              'narayanpet': 'Narayanpet',
              'jogulamba': 'Jogulamba',
              'gadwal': 'Gadwal',
              'nalgonda': 'Nalgonda',
              'yadadri': 'Yadadri',
              'suryapet': 'Suryapet',
              'mulugu': 'Mulugu',
              'jayashankar': 'Jayashankar',
              'bhoopalpally': 'Bhoopalpally',
              'asifabad': 'Asifabad',
              'mancherial': 'Mancherial',
              'kumurambheem': 'Kumurambheem'
            };

            const key = rawDistrict.toLowerCase().trim();
            const matchedDistrict = DISTRICT_MAP[key] || rawDistrict || 'Hyderabad';
            resolve(matchedDistrict);
          } catch (error) {
            console.error('District detection failed:', error);
            resolve('Hyderabad');
          }
        },
        () => resolve('Hyderabad'),
        { timeout: 10000 }
      );
    });
  };

  // 🎯 AUTO-CREATE PROFILE AFTER LOGIN
  const createProfile = async (user: any) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Auto-detect district
        const district = await detectDistrict();
        
        // 🎯 AUTO-CREATE PROFILE FROM GOOGLE DATA
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || 'Farmer',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          phone: user.phone || null,
          district: district,
          state: 'Telangana',
          farm_size: null
        };

        const { error } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (error) {
          console.error('Profile creation error:', error);
        } else {
          console.log('✅ Profile auto-created for:', user.user_metadata?.full_name);
        }
      }
    } catch (error) {
      console.error('Auto-profile creation failed:', error);
    }
  };

  // ================================================================
  // ✅ REAL GOOGLE LOGIN — One tap, shows browser saved accounts
  // ================================================================
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/',
          queryParams: {
            prompt: 'select_account',
          },
          scopes: 'email profile'
        },
      });
      if (error) throw error;
      // Automatically redirects to Google account picker
    } catch (err: any) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // ✅ REAL PHONE OTP
  // ================================================================
  const sendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      console.log('🔍 Login: Sending OTP to:', formattedPhone);
      console.log('📱 Phone length:', phone.length);
      console.log('🌐 Formatted phone:', formattedPhone);
      
      const { data, error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      
      console.log('📲 Login: Supabase response:', { data, error });
      console.log('📊 Response details:', {
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.status
      });
      
      if (error) {
        console.error('❌ Login: Supabase error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Login: OTP sent successfully!');
      console.log('📱 Check your phone for SMS from Supabase');
      setStep(2);
    } catch (err: any) {
      console.error('❌ Login: OTP send error:', err);
      console.error('❌ Error stack:', err.stack);
      setError(err.message || 'Failed to send OTP. Check Supabase phone auth settings.');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      console.log('🔍 Login: Verifying OTP:', { phone: formattedPhone, otp, type: 'sms' });
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });
      
      console.log('📲 Login: OTP verification response:', { data, error });
      
      if (error) {
        console.error('❌ Login: OTP verification error:', error);
        throw error;
      }
      
      console.log('✅ Login: OTP verified successfully!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('❌ Login: OTP verification error:', err);
      setError('Invalid OTP. Please check the SMS and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* Welcome Quote Banner */}
        <div 
          className="bg-gradient-to-r from-[#14532d] to-[#166534] rounded-2xl p-6 mb-6 text-center animate-fade-in-slide-down"
          style={{
            animation: 'fadeInSlideDown 0.8s ease-out',
          }}
        >
          <div className="text-2xl mb-3">🌾</div>
          <div 
            className="text-white italic text-[15px] leading-[1.8] whitespace-pre-line"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {t('login.loginQuote')}
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to FarmSphere</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* ✅ REAL GOOGLE BUTTON */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Opening Google...' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          <span>or use mobile number</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Phone OTP */}
        {step === 1 ? (
          <div className="space-y-4">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:border-green-500">
              <span className="bg-gray-50 px-4 py-3 text-gray-600 font-medium border-r border-gray-300">+91</span>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-4 py-3 outline-none text-base"
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-500">OTP sent to +91{phone}</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-green-500 text-center text-xl tracking-widest"
            />
            <button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              onClick={() => { setStep(1); setOtp(''); setError(''); }}
              className="w-full text-sm text-green-600 hover:text-green-700"
            >
              ← Change number / Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
