import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';

const DISTRICT_MAP = {
  'ranga reddy': 'Rangareddy',
  'rangareddy': 'Rangareddy',
  'hyderabad': 'Hyderabad',
  'medchal malkajgiri': 'Medchal-Malkajgiri',
  'nalgonda': 'Nalgonda',
  'karimnagar': 'Karimnagar',
  'warangal': 'Warangal',
  'nizamabad': 'Nizamabad',
  'khammam': 'Khammam',
  'adilabad': 'Adilabad',
  'jagtial': 'Jagtial',
  'jangaon': 'Jangaon',
  'jayashankar bhupalpally': 'Jayashankar Bhupalpally',
  'jogulamba gadwal': 'Jogulamba Gadwal',
  'kamareddy': 'Kamareddy',
  'mahabubabad': 'Mahabubabad',
  'mahabubnagar': 'Mahabubnagar',
  'mancherial': 'Mancherial',
  'medak': 'Medak',
  'mulugu': 'Mulugu',
  'nagarkurnool': 'Nagarkurnool',
  'narayanpet': 'Narayanpet',
  'nirmal': 'Nirmal',
  'peddapalli': 'Peddapalli',
  'rajanna sircilla': 'Rajanna Sircilla',
  'sangareddy': 'Sangareddy',
  'siddipet': 'Siddipet',
  'suryapet': 'Suryapet',
  'vikarabad': 'Vikarabad',
  'wanaparthy': 'Wanaparthy',
  'bhadradri kothagudem': 'Bhadradri Kothagudem',
  'hanamkonda': 'Hanamkonda',
  'yadadri bhuvanagiri': 'Yadadri Bhuvanagiri',
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [district, setDistrict] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // STEP 1 — FETCH PROFILE FROM SUPABASE
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setName(data.full_name || '');
        setFarmSize(data.farm_size || '');
        setDistrict(data.district || '');
      }
    };
    
    if (user) fetchProfile();
  }, [user]);

  // STEP 2 — AUTO DETECT LOCATION
  useEffect(() => {
    if (!user) {
      setLocationLoading(false);
      return;
    }

    // Skip location detection if district is already set from profile
    if (district && district !== 'Hyderabad' && district !== 'Location unavailable') {
      console.log('📍 District already set:', district);
      setLocationLoading(false);
      return;
    }

    setLocationLoading(true);

    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      setDistrict('Hyderabad');
      setLocationLoading(false);
      return;
    }
    
    console.log('🌐 Browser supports geolocation:', navigator.geolocation);
    console.log('🔍 Current protocol:', window.location.protocol);

    const timeoutId = setTimeout(() => {
      console.log('⏰ Geolocation timeout - using fallback');
      setDistrict('Hyderabad');
      setLocationLoading(false);
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        console.log('📍 GPS coordinates received:', { latitude, longitude });

        try {
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
        
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en&result_type=administrative_area_level_2` 
          );
        
          const data = await response.json();
          console.log('Google Maps response:', data);
        
          if (data.status === 'OK' && data.results.length > 0) {
            const components = data.results[0].address_components;
          
            // Find district
            const districtComp = components.find(c =>
              c.types.includes('administrative_area_level_2')
            );
          
            const rawDistrict = districtComp?.long_name || '';
            console.log('Raw district from Google:', rawDistrict);
          
            // Clean district name
            const cleaned = rawDistrict
              .replace(' District', '')
              .replace(' district', '')
              .trim();
          
            console.log('Cleaned district:', cleaned);
          
            // Match with DISTRICT_MAP
            const matched = DISTRICT_MAP[cleaned] ||
                            DISTRICT_MAP[rawDistrict] ||
                            null;
          
            if (matched) {
              setDistrict(matched);
              console.log('✅ District matched:', matched);
            } else {
              // Try partial match
              const allKeys = Object.keys(DISTRICT_MAP);
              const partial = allKeys.find(k =>
                cleaned.toLowerCase().includes(k.toLowerCase()) ||
                  k.toLowerCase().includes(cleaned.toLowerCase())
              );
            
              if (partial) {
                setDistrict(DISTRICT_MAP[partial]);
                console.log('✅ Partial match:', DISTRICT_MAP[partial]);
              } else {
                console.log('❌ No district match found for:', cleaned);
              }
            }
          }
        } catch (error) {
          console.error('Google Maps API error:', error);
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        clearTimeout(timeoutId);
        console.error('❌ Geolocation error:', err.message);
        console.log('🔄 Using fallback district: Hyderabad');
        setDistrict('Hyderabad');
        setLocationLoading(false);
      },
      { 
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 7000, // Reduced timeout
        maximumAge: 300000 // 5 minutes cache for better performance
      }
    );
  }, [user, district]);

  // STEP 3 — CONTACT AUTO DETECT FROM LOGIN
  const contact = user?.phone || user?.email || '';
  const contactLabel = user?.phone ? 
    `📞 ${t('profile.contact.mobile')}` : `📧 ${t('profile.contact.email')}`;

  // STEP 4 — SAVE TO SUPABASE FUNCTION
  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          farm_size: farmSize,
          district: district,
          contact: contact,
        });

      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // Auto save farm size when changed
  const handleFarmSizeChange = async (size: string) => {
    setFarmSize(size);
    try {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          farm_size: size,
          district: district,
          contact: contact,
        });
    } catch (err) {
      console.error('Auto save failed:', err);
    }
  };

  // Format member since date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{t('profile.header.defaultName')}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src="https://eatrevolutionindia.com/wp-content/uploads/2025/05/farmers-empowerment.jpg"
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {name || t('profile.header.defaultName')}
                  </h2>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm text-white flex items-center gap-1">
                    ✅ {t('profile.header.verifiedFarmer')}
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{t('profile.memberSince.title')}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.created_at ? formatDate(user.created_at) : t('profile.memberSince.unknown')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{t('profile.location.title')}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {locationLoading ? t('profile.location.detecting') : district}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-500">{contactLabel}</span>
                  <span className="text-sm font-medium text-gray-900">{contact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.name.title')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('profile.name.placeholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.farmSize.title')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'small', label: t('profile.farmSize.options.small') },
                      { key: 'medium', label: t('profile.farmSize.options.medium') },
                      { key: 'large', label: t('profile.farmSize.options.large') },
                      { key: 'xlarge', label: t('profile.farmSize.options.xlarge') }
                    ].map((size) => (
                      <button
                        key={size.key}
                        onClick={() => handleFarmSizeChange(size.label)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          farmSize === size.label
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account Actions
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold text-base hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:shadow-none border border-green-500/20"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('profile.actions.saving')}
                    </span>
                  ) : saveSuccess ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('profile.actions.saved')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t('profile.actions.saveProfile')}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-50 to-red-100 text-red-600 py-3 px-6 rounded-lg font-semibold text-base hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] border-2 border-red-200/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('profile.actions.logout')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
