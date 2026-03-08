import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';
import { 
  Users, 
  TrendingUp, 
  Globe, 
  Award, 
  Heart, 
  Target,
  Zap,
  Shield,
  ArrowRight,
  X,
  MapPin,
  Cloud,
  BarChart3,
  Smartphone,
  BookOpen,
  Star,
  Quote,
  Trophy
} from 'lucide-react';

// Import Google Fonts
const GoogleFonts = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
    
    /* Custom scrollbar styles */
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #16a34a;
      border-radius: 4px;
    }
    
    /* Modal animation */
    @keyframes modalSlideUp {
      from {
        opacity: 0;
        transform: translateY(60px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .modal-slide-up {
      animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    /* Staggered fade-in animation */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .stagger-fade-in-1 { animation: fadeInUp 0.6s ease-out 0.1s both; }
    .stagger-fade-in-2 { animation: fadeInUp 0.6s ease-out 0.2s both; }
    .stagger-fade-in-3 { animation: fadeInUp 0.6s ease-out 0.3s both; }
    .stagger-fade-in-4 { animation: fadeInUp 0.6s ease-out 0.4s both; }
    .stagger-fade-in-5 { animation: fadeInUp 0.6s ease-out 0.5s both; }
    .stagger-fade-in-6 { animation: fadeInUp 0.6s ease-out 0.6s both; }
  `}</style>
);

// Learn More Modal Component
const LearnMoreModal = ({ onClose }) => {
  const handleGetStarted = () => {
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <GoogleFonts />
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50"
        style={{ 
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ 
          fontFamily: 'DM Sans, sans-serif'
        }}
      >
        <div 
          className="modal-slide-up custom-scrollbar"
          style={{
            width: '90vw',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
          }}
        >
          
          {/* SECTION 1 — HERO */}
          <div 
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #e6fffa 25%, #f0fdf4 50%, #ecfeff 75%, #f8fafc 100%)',
              padding: '48px 40px'
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
            <div className="absolute top-20 right-0 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
            <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-all duration-200 hover:rotate-90"
              style={{
                background: 'rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.2)',
                color: '#374151',
                width: '36px',
                height: '36px',
                borderRadius: '50%'
              }}
            >
              <X className="w-4 h-4 mx-auto" />
            </button>
            
            <div className="relative z-10">
              {/* Badge */}
              <div 
                className="inline-block mb-6"
                style={{
                  background: 'rgba(16,163,74,0.1)',
                  border: '1px solid rgba(16,163,74,0.2)',
                  color: '#16a34a',
                  padding: '4px 16px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                🌾 Digital Agriculture Platform
              </div>
              
              {/* Heading */}
              <h1 
                className="mb-4"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: '#1f2937',
                  fontSize: '36px',
                  fontWeight: '700',
                  lineHeight: '1.2'
                }}
              >
                Transforming Farming<br />with Intelligence
              </h1>
              
              {/* Subtext */}
              <p 
                className="mb-8"
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  maxWidth: '500px',
                  lineHeight: '1.6'
                }}
              >
                One platform for crop insights, market intelligence, government schemes and agricultural investment.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>100+</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Farmers</div>
                </div>
                <div className="text-center border-l border-gray-300">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>33</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Districts</div>
                </div>
                <div className="text-center border-l border-gray-300">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>40%</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Yield</div>
                </div>
                <div className="text-center border-l border-gray-300">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>95%</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 — WHAT IS FARMSPHERE */}
          <div className="stagger-fade-in-1" style={{ padding: '40px', background: 'white' }}>
            {/* Eyebrow */}
            <div 
              className="mb-4"
              style={{
                color: '#16a34a',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              OVERVIEW
            </div>
            
            {/* Heading */}
            <h2 
              className="mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '28px',
                color: '#0f172a',
                fontWeight: '700'
              }}
            >
              What is FarmSphere?
            </h2>
            
            {/* Content */}
            <div 
              className="pl-5"
              style={{ 
                borderLeft: '4px solid #16a34a',
                marginLeft: '24px'
              }}
            >
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#475569', marginBottom: '16px' }}>
                FarmSphere is a <strong style={{ color: '#16a34a' }}>digital agriculture ecosystem</strong> that modernizes farming by integrating real-time crop insights, state-wise production data, and government-backed financial support into a single platform.
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#475569' }}>
                Farmers can explore <strong style={{ color: '#16a34a' }}>low-supply, high-demand crops</strong> categorized into short-term, medium-term, and long-term varieties — enabling optimized planning and smarter market decisions.
              </p>
            </div>
          </div>

          {/* SECTION 3 — PROBLEMS vs SOLUTIONS */}
          <div className="stagger-fade-in-2" style={{ padding: '40px', background: '#f8fafc' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problems */}
              <div 
                className="rounded-2xl"
                style={{
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  padding: '24px'
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ fontSize: '20px' }}>❌</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Challenges</h3>
                </div>
                
                {[
                  { title: 'Fragmented Crop Demand Access', desc: 'Farmers lack centralized access to which crops are in high demand.' },
                  { title: 'Limited Region-Specific Data', desc: 'No platform provides district-level agricultural insights for Telangana.' },
                  { title: 'Missed Investment Opportunities', desc: 'Long-term agri-investments in fisheries, dairy and food processing go unnoticed.' },
                  { title: 'Complex Government Schemes', desc: 'Farmers struggle to navigate loans, subsidies and eligibility requirements.' },
                  { title: 'Supply-Demand Mismatch', desc: 'Crops are grown without understanding actual market demand and supply gaps.' },
                  { title: 'Disconnect from Market Data', desc: 'Farmers make decisions without real-time pricing and profitability insights.' }
                ].map((item, index) => (
                  <div key={index} className="pb-3 mb-3 border-b border-red-100 last:border-0">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Solutions */}
              <div 
                className="rounded-2xl"
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '24px'
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>How We Solve It</h3>
                </div>
                
                {[
                  { title: 'Smart Crop Intelligence', desc: 'Identifies low-supply high-demand crops across short, medium and long-term cycles.' },
                  { title: 'District-Level Precision', desc: 'Real-time location-based crop recommendations for all 33 districts of Telangana.' },
                  { title: 'Agri-Investment Insights', desc: 'Highlights opportunities in food processing, cold storage, dairy, fisheries and bio-energy with ROI projections.' },
                  { title: 'Government Schemes Module', desc: 'Transparent access to eligibility criteria, documentation, loan structures and repayment schedules.' },
                  { title: 'State-Wise Production Data', desc: 'Cultivated land, weather, water requirements, investment and revenue data for informed decisions.' },
                  { title: 'Role-Based Personalization', desc: 'Secure personalized access for farmers, entrepreneurs and policymakers.' }
                ].map((item, index) => (
                  <div key={index} className="pb-3 mb-3 border-b border-green-100 last:border-0">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4 — WHAT MAKES US DIFFERENT */}
          <div className="stagger-fade-in-3" style={{ padding: '40px', background: 'white' }}>
            <h2 
              className="mb-8"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '28px',
                color: '#0f172a',
                fontWeight: '700'
              }}
            >
              What Makes Us Different
            </h2>
            
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory' }}>
              {[
                { icon: '🎯', title: 'Only Platform for Telangana', desc: 'Hyper-local data covering all 33 districts with district-specific crop and weather intelligence.' },
                { icon: '🔗', title: 'End-to-End Agriculture Platform', desc: 'From crop selection to government schemes to investment opportunities — everything in one place.' },
                { icon: '🚀', title: 'Built for Every Farmer', desc: 'Simple, mobile-first design that works for farmers regardless of their technical knowledge.' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 transition-all duration-200 hover:transform hover:-translate-y-1"
                  style={{
                    width: '220px',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div 
                    className="mb-4 flex items-center justify-center"
                    style={{
                      width: '52px',
                      height: '52px',
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      borderRadius: '14px',
                      fontSize: '24px'
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#0f172a'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5 — PLATFORM CAPABILITIES */}
          <div className="stagger-fade-in-4" style={{ padding: '40px', background: '#f8fafc' }}>
            <h2 
              className="mb-8"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '28px',
                color: '#0f172a',
                fontWeight: '700'
              }}
            >
              Platform Capabilities
            </h2>
            
            <div className="space-y-3">
              {[
                { icon: '🌾', color: '#16a34a', title: 'Crop Demand Analysis', desc: 'Short, medium and long-term crop categorization based on market supply and demand data.' },
                { icon: '📊', color: '#10b981', title: 'State-Wise Production Data', desc: 'Detailed data including cultivated land, weather patterns, water requirements, investment and revenue projections.' },
                { icon: '🏭', color: '#14b8a6', title: 'Agro-Industrial Investment', desc: 'Long-term opportunities in food processing, cold storage, dairy, fisheries, organic farming and bio-energy sectors.' },
                { icon: '📋', color: '#d97706', title: 'Government Schemes Access', desc: 'Complete scheme details with eligibility, documentation requirements, loan structures and subsidy guidance.' },
                { icon: '📍', color: '#3b82f6', title: 'Location Intelligence', desc: 'GPS-based district detection for personalized recommendations specific to farmer\'s exact location.' },
                { icon: '🔐', color: '#8b5cf6', title: 'Secure Role-Based Access', desc: 'Personalized platform experience for farmers, investors and policymakers with secure authentication.' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 transition-all duration-200 hover:border-opacity-100"
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    border: '1px solid #e2e8f0',
                    borderColor: item.color + '33'
                  }}
                >
                  <div 
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: item.color + '15',
                      borderRadius: '12px',
                      fontSize: '20px'
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4" style={{ color: '#94a3b8' }} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6 — FUTURE ROADMAP */}
          <div 
            className="stagger-fade-in-5"
            style={{
              padding: '40px',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              color: 'white'
            }}
          >
            {/* Eyebrow */}
            <div 
              className="inline-block mb-4"
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#a78bfa',
                padding: '4px 16px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              COMING SOON
            </div>
            
            {/* Heading */}
            <h2 
              className="mb-8"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '28px',
                color: 'white',
                fontWeight: '700'
              }}
            >
              The Future of FarmSphere
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '🔗', title: 'Blockchain Supply Chain Tracking', desc: 'Transparent end-to-end crop tracking from farm to market using blockchain technology for verified workflows.' },
                { icon: '📜', title: 'Smart Contracts for Subsidies', desc: 'Automated subsidy distribution and supply chain management through smart contracts eliminating manual processes.' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '24px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div 
                    className="mb-4 flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      borderRadius: '12px',
                      fontSize: '24px'
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7 — BOTTOM CTA */}
          <div 
            className="stagger-fade-in-6 text-center"
            style={{
              padding: '48px 40px',
              background: 'white',
              borderTop: '1px solid #e2e8f0'
            }}
          >
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '32px',
                color: '#0f172a',
                fontWeight: '700'
              }}
            >
              Ready to Grow Smarter?
            </h2>
            
            <p 
              className="mb-8"
              style={{
                fontSize: '16px',
                color: '#64748b',
                lineHeight: '1.6'
              }}
            >
              Join FarmSphere — where every farmer<br />farms with power of data.
            </p>
            
            <button
              onClick={handleGetStarted}
              className="transition-all duration-200 hover:transform hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: 'white',
                padding: '16px 48px',
                borderRadius: '100px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(22,163,74,0.35)'
              }}
            >
              Get Started Free →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { 
      icon: Users, 
      label: t('about.stats.farmersHelped'), 
      value: '100+', 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      icon: TrendingUp, 
      label: t('about.stats.yieldIncrease'), 
      value: '40%', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: Globe, 
      label: t('about.stats.districtsCovered'), 
      value: '33', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      icon: Award, 
      label: t('about.stats.successRate'), 
      value: '95%', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: t('about.features.locationBased.title'),
      description: t('about.features.locationBased.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Cloud,
      title: t('about.features.hyperLocal.title'),
      description: t('about.features.hyperLocal.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: BarChart3,
      title: t('about.features.marketInsights.title'),
      description: t('about.features.marketInsights.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Shield,
      title: t('about.features.governmentSchemes.title'),
      description: t('about.features.governmentSchemes.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Smartphone,
      title: t('about.features.mobileOptimized.title'),
      description: t('about.features.mobileOptimized.description'),
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      icon: BookOpen,
      title: t('about.features.farmingResources.title'),
      description: t('about.features.farmingResources.description'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const testimonialsData = t('about.testimonials.testimonials');
  const testimonials = Array.isArray(testimonialsData) ? testimonialsData.map((testimonial, index) => ({
    ...testimonial,
    rating: 4,
    avatar: index === 0 ? '👨‍🌾' : index === 1 ? '👩‍🌾' : '👨‍🌾'
  })) : [
    {
      name: 'Ramesh Kumar',
      role: 'Farmer from Karimnagar',
      content: 'FarmSphere helped me choose the right crops for my region. My income increased by 45%!',
      rating: 5,
      avatar: '👨‍🌾'
    },
    {
      name: 'Sunita Devi',
      role: 'Farmer from Nalgonda',
      content: 'The weather alerts and crop suggestions have transformed my farming practice.',
      rating: 5,
      avatar: '👩‍🌾'
    },
    {
      name: 'Mohan Reddy',
      role: 'Farmer from Warangal',
      content: 'Finally, a platform that understands local farming needs. Highly recommended!',
      rating: 1,
      avatar: '👨‍🌾'
    }
  ];

  const achievements = [
    { icon: Trophy, label: 'Best AgriTech Platform 2024' },
    { icon: Target, label: '95% Success Rate' },
    { icon: Zap, label: 'Real-Time Data' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-16 overflow-hidden">
        {/* Transparent Background Image */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://i.pinimg.com/originals/a6/15/aa/a615aa158101afa812b208449e5509e8.jpg"
            alt="Agricultural Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Section - Full Width */}
          <div className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {t('about.hero.title')}
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-green-600 mb-6">
                {t('about.hero.subtitle')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
                {t('about.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button className="bg-green-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-lg">
                  {t('about.hero.getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
                <button 
                  onClick={() => setShowLearnMore(true)}
                  className="border-2 border-green-600 text-green-600 px-10 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 text-lg"
                >
                  {t('about.hero.learnMore')}
                </button>
              </div>
            </div>
          </div>

          {/* Professional Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Join Our Mission Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.cards.joinMission.title')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('about.cards.joinMission.description')}
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
                <Users className="w-4 h-4" />
                <span>{t('about.cards.joinMission.stats')}</span>
              </div>
            </div>

            {/* Growing Together Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.cards.growingTogether.title')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('about.cards.growingTogether.description')}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg">
                <TrendingUp className="w-4 h-4" />
                <span>{t('about.cards.growingTogether.badge')}</span>
              </div>
            </div>

            {/* Impact Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.cards.makingImpact.title')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('about.cards.makingImpact.description')}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg">
                <Target className="w-4 h-4" />
                <span>{t('about.cards.makingImpact.badge')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('about.stats.title')}</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('about.stats.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`${stat.bgColor} rounded-2xl p-8 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]`}>
                  <div className={`${stat.color} text-4xl font-bold mb-4`}>{stat.value}</div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('about.features.title')}</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('about.features.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className={`${feature.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('about.testimonials.title')}</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('about.testimonials.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 relative hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4 text-green-600">
                  <Quote className="w-8 h-8" />
                </div>
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">{t('about.cta.title')}</h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">{t('about.cta.description')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center transform hover:scale-[1.02] shadow-lg">
              {t('about.cta.startFreeTrial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors transform hover:scale-[1.02]">
              {t('about.cta.scheduleDemo')}
            </button>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {showLearnMore && (
        <LearnMoreModal onClose={() => setShowLearnMore(false)} />
      )}
    </div>
  );
};

// Add missing icon import
const Trophy = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
  </svg>
);

const Quote = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
  </svg>
);

export default About;
