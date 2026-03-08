import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  User,
  Building,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Users,
  Headphones
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';

const Contact = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Clear success/error messages after 2 minutes
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 120000); // 2 minutes in milliseconds

      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => {
        setSubmitError(false);
      }, 120000); // 2 minutes in milliseconds

      return () => clearTimeout(timer);
    }
  }, [submitError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`FarmSphere Contact: ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}`
      );
      
      window.location.href = `mailto:farmsphere@gmail.com?subject=${subject}&body=${body}`;
      
      // Show success message after a delay
      setTimeout(() => {
        setSubmitSuccess(true);
        setSubmitting(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      labelKey: 'contact.emailLabel',
      value: 'farmsphere@gmail.com',
      action: 'mailto:farmsphere@gmail.com',
      actionKey: 'contact.sendEmail'
    },
    {
      icon: Phone,
      labelKey: 'contact.phoneLabel',
      value: '+91-91234-56789',
      action: 'tel:+919123456789',
      actionKey: 'contact.callNow'
    },
    {
      icon: MapPin,
      labelKey: 'contact.headOfficeLabel',
      value: 'Hyderabad, Telangana, India',
      action: 'https://maps.google.com/?q=Hyderabad,Telangana,India',
      actionKey: 'contact.getDirections'
    },
    {
      icon: Clock,
      labelKey: 'contact.businessHoursLabel',
      value: 'Mon-Fri: 9:00 AM - 6:00 PM',
      action: null,
      actionKey: null
    }
  ];

  const services = [
    {
      icon: Users,
      titleKey: 'contact.farmerSupport',
      descKey: 'contact.farmerSupportDesc'
    },
    {
      icon: Building,
      titleKey: 'contact.businessPartnerships',
      descKey: 'contact.businessPartnershipsDesc'
    },
    {
      icon: Globe,
      titleKey: 'contact.globalReach',
      descKey: 'contact.globalReachDesc'
    },
    {
      icon: Shield,
      titleKey: 'contact.trustedPlatform',
      descKey: 'contact.trustedPlatformDesc'
    }
  ];

  const testimonials = [
    {
      nameKey: 'contact.testimonial1Name',
      roleKey: 'contact.testimonial1Role',
      contentKey: 'contact.testimonial1Content',
      rating: 5
    },
    {
      nameKey: 'contact.testimonial2Name',
      roleKey: 'contact.testimonial2Role',
      contentKey: 'contact.testimonial2Content',
      rating: 5
    },
    {
      nameKey: 'contact.testimonial3Name',
      roleKey: 'contact.testimonial3Role',
      contentKey: 'contact.testimonial3Content',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section - Professional Background */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      }}>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Professional Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full text-gray-200 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              {t('contact.trustedPlatform')}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t('contact.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              {t('contact.subtitle')}
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
              <div className="flex items-center px-6 py-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-full">
                <Headphones className="w-6 h-6 mr-3 text-gray-400" />
                <span className="text-gray-200 font-medium">{t('contact.support247')}</span>
              </div>
              <div className="flex items-center px-6 py-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-full">
                <Users className="w-6 h-6 mr-3 text-gray-400" />
                <span className="text-gray-200 font-medium">{t('contact.trusted')}</span>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-gray-400 text-sm">Happy Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">99%</div>
                <div className="text-gray-400 text-sm">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">5★</div>
                <div className="text-gray-400 text-sm">Service Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mr-4">
                    <info.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t(info.labelKey)}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{info.value}</p>
                {info.action && (
                  <a
                    href={info.action}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
                  >
                    {t(info.actionKey)}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('contact.getInTouch')}</h2>
                <p className="text-gray-600 mb-8">
                  {t('contact.formDescription')}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        {t('contact.yourName')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={t('contact.namePlaceholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        {t('contact.emailAddress')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={t('contact.emailPlaceholder')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      {t('contact.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('contact.phonePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      {t('contact.subject')} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      {t('contact.message')} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t('contact.messagePlaceholder')}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? t('contact.sending') : t('contact.sendMessage')}
                  </button>
                </form>
                
                {submitSuccess && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#16a34a',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginTop: '16px'
                  }}>
                    {t('contact.successMessage')}
                  </div>
                )}

                {submitError && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#dc2626',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginTop: '16px'
                  }}>
                    {t('contact.errorMessage')}
                  </div>
                )}
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('contact.howWeCanHelp')}</h2>
              <div className="space-y-6">
                {services.map((service, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                        <service.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(service.titleKey)}</h3>
                        <p className="text-gray-600">{t(service.descKey)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Social Media */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('contact.followUs')}</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.whatUsersSay')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact.usersSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 mb-4 italic">"{t(testimonial.contentKey)}"</p>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 w-10 h-10 flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t(testimonial.nameKey)}</h4>
                    <p className="text-sm text-gray-600">{t(testimonial.roleKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.faq')}</h2>
            <p className="text-lg text-gray-600">
              {t('contact.faqSubtitle')}
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('contact.faq1Question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq1Answer')}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('contact.faq2Question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq2Answer')}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('contact.faq3Question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq3Answer')}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('contact.faq4Question')}
              </h3>
              <p className="text-gray-600">
                {t('contact.faq4Answer')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
