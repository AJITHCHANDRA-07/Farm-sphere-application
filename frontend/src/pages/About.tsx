import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Globe, 
  Award, 
  Heart, 
  Target,
  Zap,
  Shield,
  BookOpen,
  Smartphone,
  Cloud,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Leaf,
  Droplets,
  Sun
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { 
      icon: Users, 
      label: 'Farmers Helped', 
      value: '100+', 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      icon: TrendingUp, 
      label: 'Yield Increase', 
      value: '40%', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: Globe, 
      label: 'Districts Covered', 
      value: '33', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      icon: Award, 
      label: 'Success Rate', 
      value: '95%', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Intelligence',
      description: 'Get crop recommendations tailored to your specific district and weather conditions.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Cloud,
      title: 'Real-Time Weather Data',
      description: 'Access accurate weather information to make informed farming decisions.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: BarChart3,
      title: 'Market Insights',
      description: 'Stay updated with market prices and demand trends for optimal profitability.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Shield,
      title: 'Government Schemes',
      description: 'Discover and apply for relevant agricultural schemes and subsidies.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Access all features seamlessly on your smartphone or tablet.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      icon: BookOpen,
      title: 'Farming Resources',
      description: 'Learn best practices and modern farming techniques.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const testimonials = [
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
      rating: 5,
      avatar: '👨‍🌾'
    }
  ];

  const achievements = [
    { icon: Trophy, label: 'Best AgriTech Platform 2024' },
    { icon: Star, label: '100+ Happy Farmers' },
    { icon: Target, label: '95% Success Rate' },
    { icon: Zap, label: 'Real-Time Data' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Farmers with
              <span className="text-yellow-300"> Smart Agriculture</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              FarmSphere is revolutionizing agriculture in Telangana with data-driven insights, 
              real-time weather information, and personalized crop recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors transform hover:scale-105">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Leaf className="w-20 h-20 text-white" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Droplets className="w-20 h-20 text-white" />
        </div>
        <div className="absolute top-1/2 right-20 opacity-20">
          <Sun className="w-16 h-16 text-white" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Making a Real Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of farmers who have transformed their agricultural practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`${stat.bgColor} rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${stat.color} mx-auto mb-4`}>
                  <stat.icon className="w-12 h-12" />
                </div>
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FarmSphere?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the features that make FarmSphere the preferred choice for modern farmers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${feature.bgColor} ${feature.color} rounded-lg p-3 inline-flex mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Farmers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from farmers who have benefited from FarmSphere
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-6 relative hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.content}"
                </p>
                <div className="absolute top-4 right-4 text-green-600">
                  <Quote className="w-8 h-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of farmers using FarmSphere to increase productivity 
              and maximize profits through data-driven agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center transform hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors transform hover:scale-105">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
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
