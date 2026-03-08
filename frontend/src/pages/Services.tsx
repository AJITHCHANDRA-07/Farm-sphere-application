import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';
import { useAuth } from '../contexts/AuthContext';

const Services = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    farmers: 0,
    districts: 0,
    yield: 0,
    satisfaction: 0
  });

  // Animate stats on page load
  useEffect(() => {
    const targetStats = {
      farmers: 100,
      districts: 33,
      yield: 40,
      satisfaction: 95
    };

    const duration = 2000;
    const steps = 60;
    const increment = {
      farmers: targetStats.farmers / steps,
      districts: targetStats.districts / steps,
      yield: targetStats.yield / steps,
      satisfaction: targetStats.satisfaction / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedStats({
        farmers: Math.min(Math.floor(increment.farmers * currentStep), targetStats.farmers),
        districts: Math.min(Math.floor(increment.districts * currentStep), targetStats.districts),
        yield: Math.min(Math.floor(increment.yield * currentStep), targetStats.yield),
        satisfaction: Math.min(Math.floor(increment.satisfaction * currentStep), targetStats.satisfaction)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/explore-crops');
    } else {
      navigate('/login');
    }
  };

  const services = [
    {
      icon: "🌾",
      title: t('services.cropIntelligence.title'),
      description: t('services.cropIntelligence.description')
    },
    {
      icon: "📍",
      title: t('services.locationInsights.title'),
      description: t('services.locationInsights.description')
    },
    {
      icon: "📋",
      title: t('services.governmentSchemes.title'),
      description: t('services.governmentSchemes.description')
    },
    {
      icon: "🏪",
      title: t('services.agriculturalMarketplace.title'),
      description: t('services.agriculturalMarketplace.description')
    },
    {
      icon: "📊",
      title: t('services.marketIntelligence.title'),
      description: t('services.marketIntelligence.description')
    },
    {
      icon: "🏭",
      title: t('services.agroInvestment.title'),
      description: t('services.agroInvestment.description')
    }
  ];

  const steps = [
    {
      icon: "📍",
      title: t('services.howItWorks.step1.title'),
      description: t('services.howItWorks.step1.description')
    },
    {
      icon: "🌾",
      title: t('services.howItWorks.step2.title'),
      description: t('services.howItWorks.step2.description')
    },
    {
      icon: "📋",
      title: t('services.howItWorks.step3.title'),
      description: t('services.howItWorks.step3.description')
    },
    {
      icon: "📈",
      title: t('services.howItWorks.step4.title'),
      description: t('services.howItWorks.step4.description')
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
          
          :root {
            --primary: #16a34a;
            --primary-dark: #14532d;
            --text-dark: #0f172a;
            --text-mid: #475569;
            --border: #e2e8f0;
            --white: #ffffff;
            --light-bg: #f8fafc;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .service-card {
            animation: fadeUp 0.6s ease-out forwards;
            opacity: 0;
          }

          .font-playfair {
            font-family: 'Playfair Display', serif;
          }

          .font-dm {
            font-family: 'DM Sans', sans-serif;
          }
        `}
      </style>

      {/* HERO SECTION */}
      <section className="relative" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        padding: '80px 32px',
        textAlign: 'center'
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="inline-block mb-6 px-5 py-2 rounded-full text-sm font-medium" style={{
            background: 'rgba(22,163,74,0.15)',
            border: '1px solid rgba(22,163,74,0.3)',
            color: '#4ade80'
          }}>
            🌾 {t('services.hero.badge')}
          </div>
          
          <h1 className="font-playfair font-bold mb-6" style={{
            color: 'white',
            fontSize: 'clamp(32px, 5vw, 52px)',
            lineHeight: '1.2'
          }}>
            {t('services.hero.title')}
          </h1>
          
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '18px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {t('services.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* SERVICE CARDS SECTION */}
      <section style={{
        background: 'white',
        padding: '80px 32px'
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-green-600 text-xs font-bold tracking-wider uppercase mb-4">
              {t('services.servicesSection.eyebrow')}
            </div>
            <h2 className="font-playfair font-bold text-4xl" style={{ color: '#0f172a' }}>
              {t('services.servicesSection.heading')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  animationDelay: `${index * 80}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(22,163,74,0.12)';
                  e.currentTarget.style.borderColor = '#86efac';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  fontSize: '28px'
                }}>
                  {service.icon}
                </div>
                
                <h3 className="font-dm font-bold text-xl mb-3" style={{ color: '#0f172a' }}>
                  {service.title}
                </h3>
                
                <p className="font-dm text-sm leading-relaxed" style={{ color: '#64748b' }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        padding: '80px 32px'
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair font-bold text-4xl mb-4" style={{ color: '#0f172a' }}>
              {t('services.howItWorks.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector lines for desktop */}
            <div className="hidden md:block absolute top-9 left-0 right-0 h-0.5 bg-green-200 z-0" style={{ top: '36px' }}></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-18 h-18 rounded-full flex items-center justify-center text-3xl bg-white border-2 border-green-600 shadow-lg" style={{
                    width: '72px',
                    height: '72px',
                    border: '2px solid #16a34a',
                    boxShadow: '0 4px 16px rgba(22,163,74,0.15)'
                  }}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold" style={{
                    width: '24px',
                    height: '24px',
                    background: '#16a34a'
                  }}>
                    {index + 1}
                  </div>
                </div>
                
                <h4 className="font-dm font-bold text-base mb-2" style={{ color: '#0f172a' }}>
                  {step.title}
                </h4>
                
                <p className="font-dm text-xs" style={{ color: '#64748b' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #14532d, #15803d)',
        padding: '60px 32px'
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center border-r border-white/10 last:border-r-0">
              <div className="font-playfair font-bold text-5xl mb-2" style={{ color: '#4ade80' }}>
                {animatedStats.farmers}+
              </div>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('services.stats.farmersHelped')}
              </div>
            </div>
            
            <div className="text-center border-r border-white/10 last:border-r-0">
              <div className="font-playfair font-bold text-5xl mb-2" style={{ color: '#4ade80' }}>
                {animatedStats.districts}
              </div>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('services.stats.districtsCovered')}
              </div>
            </div>
            
            <div className="text-center border-r border-white/10 last:border-r-0">
              <div className="font-playfair font-bold text-5xl mb-2" style={{ color: '#4ade80' }}>
                {animatedStats.yield}%
              </div>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('services.stats.yieldIncrease')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="font-playfair font-bold text-5xl mb-2" style={{ color: '#4ade80' }}>
                {animatedStats.satisfaction}%
              </div>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('services.stats.satisfaction')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section style={{
        background: 'white',
        padding: '80px 32px',
        textAlign: 'center'
      }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair font-bold text-5xl mb-4" style={{ color: '#0f172a' }}>
            {t('services.cta.title')}
          </h2>
          
          <p className="font-dm text-base mb-8" style={{ color: '#64748b' }}>
            {t('services.cta.subtitle')}
          </p>
          
          <button
            onClick={handleGetStarted}
            className="font-dm font-semibold text-base px-14 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              boxShadow: '0 8px 24px rgba(22,163,74,0.35)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(22,163,74,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,0.35)';
            }}
          >
            {t('services.cta.button')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;
