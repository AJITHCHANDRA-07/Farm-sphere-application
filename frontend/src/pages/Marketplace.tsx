import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  Search,
  TrendingUp,
  Users,
  Building,
  Filter,
  ArrowRight,
  Globe,
  Award,
  Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';

// Import Google Fonts
const GoogleFonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
    
    :root {
      --primary: #16a34a;
      --primary-dark: #14532d;
      --primary-light: #f0fdf4;
      --text-dark: #0f172a;
      --text-mid: #475569;
      --border: #e2e8f0;
    }
    
    * {
      font-family: 'DM Sans', sans-serif;
    }
    
    /* Hero section animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .float-animation {
      animation: float 6s ease-in-out infinite;
    }
    
    .fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }
    
    /* Custom scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #6366f1;
      border-radius: 3px;
    }
  `}</style>
);

const Marketplace = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // All 33 Telangana districts with their markets
  const telanganaMarkets = {
    'Hyderabad': [
      {
        name: 'Monda Market',
        description: 'Largest wholesale vegetable market in Hyderabad',
        location: 'Secunderabad, Hyderabad',
        mapsLink: 'https://maps.google.com/?q=Monda+Market+Secunderabad+Hyderabad',
        famousFor: 'Vegetables, Fruits, Flowers',
        timings: '4:00 AM - 10:00 PM',
        contact: '+91-40-27801234',
        rating: 4.5,
        specialties: ['Fresh Vegetables', 'Seasonal Fruits', 'Flowers'],
        dailyVolume: '500+ tons',
        established: '1965',
        marketType: 'Wholesale'
      },
      {
        name: 'Bowenpally Market',
        description: 'Popular wholesale and retail market',
        location: 'Bowenpally, Hyderabad',
        mapsLink: 'https://maps.google.com/?q=Bowenpally+Market+Hyderabad',
        famousFor: 'Vegetables, Grains, Daily Essentials',
        timings: '5:00 AM - 11:00 PM',
        contact: '+91-40-27884567',
        rating: 4.3,
        specialties: ['Vegetables', 'Grains', 'Pulses'],
        dailyVolume: '300+ tons',
        established: '1972',
        marketType: 'Mixed'
      },
      {
        name: 'L.B. Nagar Market',
        description: 'Major retail and wholesale market in south Hyderabad',
        location: 'L.B. Nagar, Hyderabad',
        mapsLink: 'https://maps.google.com/?q=LB+Nagar+Market+Hyderabad',
        famousFor: 'Vegetables, Fruits, Pulses',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-40-24041234',
        rating: 4.2,
        specialties: ['Vegetables', 'Fruits', 'Pulses'],
        dailyVolume: '200+ tons',
        established: '1980',
        marketType: 'Retail'
      },
      {
        name: 'Gaddiannaram Market',
        description: 'Wholesale fruit and vegetable market',
        location: 'Gaddiannaram, Hyderabad',
        mapsLink: 'https://maps.google.com/?q=Gaddiannaram+Fruit+Market+Hyderabad',
        famousFor: 'Fruits, Vegetables',
        timings: '4:00 AM - 10:00 PM',
        contact: '+91-40-24151234',
        rating: 4.3,
        specialties: ['Wholesale Fruits', 'Vegetables'],
        dailyVolume: '350+ tons',
        established: '1975',
        marketType: 'Wholesale'
      },
      {
        name: 'Malakpet Market',
        description: 'Traditional market in old city area',
        location: 'Malakpet, Hyderabad',
        mapsLink: 'https://maps.google.com/?q=Malakpet+Market+Hyderabad',
        famousFor: 'Vegetables, Grains, Spices',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-40-24441234',
        rating: 4.1,
        specialties: ['Spices', 'Grains', 'Vegetables'],
        dailyVolume: '150+ tons',
        established: '1960',
        marketType: 'Traditional'
      }
    ],
    'Rangareddy': [
      {
        name: 'Shadnagar Market',
        description: 'Major agricultural hub connecting rural farmers',
        location: 'Shadnagar, Rangareddy',
        mapsLink: 'https://maps.google.com/?q=Shadnagar+Market+Rangareddy+Telangana',
        famousFor: 'Grains, Vegetables, Cotton',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8522-234567',
        rating: 4.4,
        specialties: ['Paddy', 'Cotton', 'Vegetables'],
        dailyVolume: '200+ tons',
        established: '1958',
        marketType: 'Agricultural'
      },
      {
        name: 'Vikarabad Market',
        description: 'Traditional market for quality agricultural produce',
        location: 'Vikarabad, Rangareddy',
        mapsLink: 'https://maps.google.com/?q=Vikarabad+Market+Telangana',
        famousFor: 'Mangoes, Vegetables, Grains',
        timings: '6:00 AM - 8:00 PM',
        contact: '+91-8415-234567',
        rating: 4.3,
        specialties: ['Mangoes', 'Vegetables', 'Paddy'],
        dailyVolume: '180+ tons',
        established: '1960',
        marketType: 'Traditional'
      },
      {
        name: 'Tandur Market',
        description: 'Agricultural market known for paddy and cotton',
        location: 'Tandur, Rangareddy',
        mapsLink: 'https://maps.google.com/?q=Tandur+Market+Rangareddy+Telangana',
        famousFor: 'Paddy, Cotton, Vegetables',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8413-234567',
        rating: 4.2,
        specialties: ['Paddy', 'Cotton', 'Vegetables'],
        dailyVolume: '160+ tons',
        established: '1965',
        marketType: 'Agricultural'
      }
    ],
    'Medchal-Malkajgiri': [
      {
        name: 'Medchal Market',
        description: 'Major wholesale market serving northern Hyderabad',
        location: 'Medchal, Medchal Malkajgiri',
        mapsLink: 'https://maps.google.com/?q=Medchal+Market+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:30 AM - 10:00 PM',
        contact: '+91-8455-234567',
        rating: 4.4,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '250+ tons',
        established: '1960',
        marketType: 'Wholesale'
      },
      {
        name: 'Kompally Market',
        description: 'Growing market in north Hyderabad corridor',
        location: 'Kompally, Medchal Malkajgiri',
        mapsLink: 'https://maps.google.com/?q=Kompally+Market+Hyderabad',
        famousFor: 'Vegetables, Dairy, Fruits',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8418-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Dairy', 'Fruits'],
        dailyVolume: '180+ tons',
        established: '1985',
        marketType: 'Mixed'
      }
    ],
    'Warangal': [
      {
        name: 'Warangal Main Market',
        description: 'Largest wholesale and retail market in Warangal',
        location: 'Warangal Urban',
        mapsLink: 'https://maps.google.com/?q=Warangal+Main+Market+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:00 AM - 11:00 PM',
        contact: '+91-870-234567',
        rating: 4.5,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '280+ tons',
        established: '1955',
        marketType: 'Wholesale'
      },
      {
        name: 'Hanamkonda Market',
        description: 'Major market in twin city Hanamkonda',
        location: 'Hanamkonda, Warangal',
        mapsLink: 'https://maps.google.com/?q=Hanamkonda+Market+Warangal+Telangana',
        famousFor: 'Vegetables, Cotton, Grains',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-870-345678',
        rating: 4.3,
        specialties: ['Vegetables', 'Cotton', 'Grains'],
        dailyVolume: '200+ tons',
        established: '1960',
        marketType: 'Wholesale'
      },
      {
        name: 'Parkal Market',
        description: 'Agricultural market for northern Warangal',
        location: 'Parkal, Warangal',
        mapsLink: 'https://maps.google.com/?q=Parkal+Market+Warangal+Telangana',
        famousFor: 'Paddy, Vegetables, Cotton',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-870-456789',
        rating: 4.1,
        specialties: ['Paddy', 'Vegetables', 'Cotton'],
        dailyVolume: '140+ tons',
        established: '1968',
        marketType: 'Agricultural'
      }
    ],
    'Nalgonda': [
      {
        name: 'Nalgonda Main Market',
        description: 'Primary wholesale and retail market',
        location: 'Nalgonda Urban',
        mapsLink: 'https://maps.google.com/?q=Nalgonda+Main+Market+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:30 AM - 10:30 PM',
        contact: '+91-8682-234567',
        rating: 4.4,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '220+ tons',
        established: '1962',
        marketType: 'Wholesale'
      },
      {
        name: 'Miryalaguda Market',
        description: 'Major market in eastern Nalgonda',
        location: 'Miryalaguda, Nalgonda',
        mapsLink: 'https://maps.google.com/?q=Miryalaguda+Market+Nalgonda+Telangana',
        famousFor: 'Sugarcane, Vegetables, Grains',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8683-234567',
        rating: 4.2,
        specialties: ['Sugarcane', 'Vegetables', 'Grains'],
        dailyVolume: '170+ tons',
        established: '1965',
        marketType: 'Agricultural'
      },
      {
        name: 'Suryapet Market',
        description: 'Strategic market for eastern Nalgonda',
        location: 'Suryapet, Nalgonda',
        mapsLink: 'https://maps.google.com/?q=Suryapet+Market+Telangana',
        famousFor: 'Mixed Agricultural Produce',
        timings: '4:30 AM - 10:00 PM',
        contact: '+91-8684-234567',
        rating: 4.4,
        specialties: ['Mixed Produce', 'Regional Trade'],
        dailyVolume: '150+ tons',
        established: '1965',
        marketType: 'Strategic'
      }
    ],
    'Karimnagar': [
      {
        name: 'Karimnagar Main Market',
        description: 'Largest wholesale and retail market',
        location: 'Karimnagar Urban',
        mapsLink: 'https://maps.google.com/?q=Karimnagar+Main+Market+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:00 AM - 11:00 PM',
        contact: '+91-878-234567',
        rating: 4.5,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '260+ tons',
        established: '1968',
        marketType: 'Wholesale'
      },
      {
        name: 'Huzurabad Market',
        description: 'Cotton and agricultural market',
        location: 'Huzurabad, Karimnagar',
        mapsLink: 'https://maps.google.com/?q=Huzurabad+Market+Karimnagar+Telangana',
        famousFor: 'Cotton, Vegetables, Grains',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-878-345678',
        rating: 4.2,
        specialties: ['Cotton', 'Vegetables', 'Grains'],
        dailyVolume: '160+ tons',
        established: '1970',
        marketType: 'Agricultural'
      },
      {
        name: 'Jagtial Market',
        description: 'Cotton belt agricultural hub',
        location: 'Jagtial, Karimnagar',
        mapsLink: 'https://maps.google.com/?q=Jagtial+Market+Karimnagar+Telangana',
        famousFor: 'Cotton, Vegetables, Grains',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-878-456789',
        rating: 4.3,
        specialties: ['Cotton Trading', 'Vegetables', 'Grains'],
        dailyVolume: '200+ tons',
        established: '1968',
        marketType: 'Cotton Belt'
      }
    ],
    'Khammam': [
      {
        name: 'Khammam Main Market',
        description: 'Primary wholesale and retail market',
        location: 'Khammam Urban',
        mapsLink: 'https://maps.google.com/?q=Khammam+Main+Market+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:30 AM - 10:30 PM',
        contact: '+91-8742-234567',
        rating: 4.4,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '240+ tons',
        established: '1965',
        marketType: 'Wholesale'
      },
      {
        name: 'Kothagudem Market',
        description: 'Coal belt agricultural market',
        location: 'Kothagudem, Khammam',
        mapsLink: 'https://maps.google.com/?q=Kothagudem+Market+Khammam+Telangana',
        famousFor: 'Mixed Economy Agriculture',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8744-234567',
        rating: 4.1,
        specialties: ['Mixed Economy', 'Agricultural Produce'],
        dailyVolume: '150+ tons',
        established: '1968',
        marketType: 'Mixed'
      },
      {
        name: 'Yellandu Market',
        description: 'Tribal area agricultural market',
        location: 'Yellandu, Khammam',
        mapsLink: 'https://maps.google.com/?q=Yellandu+Market+Khammam+Telangana',
        famousFor: 'Forest Products, Vegetables',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8746-234567',
        rating: 4.0,
        specialties: ['Forest Products', 'Tribal Produce'],
        dailyVolume: '100+ tons',
        established: '1962',
        marketType: 'Tribal'
      }
    ],
    'Nizamabad': [
      {
        name: 'Nizamabad Main Market',
        description: 'Major agricultural hub for northern Telangana',
        location: 'Nizamabad Urban',
        mapsLink: 'https://maps.google.com/?q=Nizamabad+Main+Market+Telangana',
        famousFor: 'Rice, Vegetables, Fruits',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-8462-234567',
        rating: 4.3,
        specialties: ['Rice Trading', 'Vegetables', 'Fruits'],
        dailyVolume: '230+ tons',
        established: '1958',
        marketType: 'Wholesale'
      },
      {
        name: 'Armoor Market',
        description: 'Turmeric and agricultural market',
        location: 'Armoor, Nizamabad',
        mapsLink: 'https://maps.google.com/?q=Armoor+Market+Nizamabad+Telangana',
        famousFor: 'Turmeric, Vegetables, Grains',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8463-234567',
        rating: 4.2,
        specialties: ['Turmeric', 'Vegetables', 'Grains'],
        dailyVolume: '160+ tons',
        established: '1965',
        marketType: 'Agricultural'
      },
      {
        name: 'Bodhan Market',
        description: 'Sugar and agricultural market',
        location: 'Bodhan, Nizamabad',
        mapsLink: 'https://maps.google.com/?q=Bodhan+Market+Nizamabad+Telangana',
        famousFor: 'Sugarcane, Rice, Vegetables',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8464-234567',
        rating: 4.1,
        specialties: ['Sugarcane', 'Rice', 'Vegetables'],
        dailyVolume: '140+ tons',
        established: '1970',
        marketType: 'Agricultural'
      }
    ],
    'Adilabad': [
      {
        name: 'Adilabad Main Market',
        description: 'Tribal area agricultural market',
        location: 'Adilabad Urban',
        mapsLink: 'https://maps.google.com/?q=Adilabad+Main+Market+Telangana',
        famousFor: 'Forest Products, Vegetables',
        timings: '6:00 AM - 9:00 PM',
        contact: '+91-8732-234567',
        rating: 4.0,
        specialties: ['Forest Products', 'Tribal Produce', 'Vegetables'],
        dailyVolume: '150+ tons',
        established: '1960',
        marketType: 'Tribal'
      },
      {
        name: 'Mancherial Market',
        description: 'Coal belt agricultural market',
        location: 'Mancherial, Adilabad',
        mapsLink: 'https://maps.google.com/?q=Mancherial+Market+Adilabad+Telangana',
        famousFor: 'Vegetables, Grains, Industrial Supply',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8736-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Industrial Supply'],
        dailyVolume: '130+ tons',
        established: '1970',
        marketType: 'Industrial'
      },
      {
        name: 'Nirmal Market',
        description: 'Wood craft and agricultural market',
        location: 'Nirmal, Adilabad',
        mapsLink: 'https://maps.google.com/?q=Nirmal+Market+Adilabad+Telangana',
        famousFor: 'Crafts, Agricultural Products',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8734-234567',
        rating: 4.1,
        specialties: ['Craft Products', 'Agricultural Produce'],
        dailyVolume: '110+ tons',
        established: '1972',
        marketType: 'Craft'
      }
    ],
    'Mahabubnagar': [
      {
        name: 'Mahabubnagar Main Market',
        description: 'Agricultural hub for southern Telangana',
        location: 'Mahabubnagar Urban',
        mapsLink: 'https://maps.google.com/?q=Mahabubnagar+Main+Market+Telangana',
        famousFor: 'Vegetables, Grains, Pulses',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8542-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Grains', 'Pulses'],
        dailyVolume: '190+ tons',
        established: '1962',
        marketType: 'Agricultural'
      },
      {
        name: 'Jadcherla Market',
        description: 'Highway market connecting south Telangana',
        location: 'Jadcherla, Mahabubnagar',
        mapsLink: 'https://maps.google.com/?q=Jadcherla+Market+Mahabubnagar+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8544-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '130+ tons',
        established: '1975',
        marketType: 'Highway'
      },
      {
        name: 'Wanaparthy Market',
        description: 'Agricultural hub for southern Telangana',
        location: 'Wanaparthy, Mahabubnagar',
        mapsLink: 'https://maps.google.com/?q=Wanaparthy+Market+Mahabubnagar+Telangana',
        famousFor: 'Vegetables, Grains, Dairy',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8543-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Dairy'],
        dailyVolume: '140+ tons',
        established: '1972',
        marketType: 'Agricultural'
      }
    ],
    'Sangareddy': [
      {
        name: 'Sangareddy Main Market',
        description: 'Growing market near Hyderabad',
        location: 'Sangareddy Urban',
        mapsLink: 'https://maps.google.com/?q=Sangareddy+Main+Market+Telangana',
        famousFor: 'Vegetables, Fruits, Dairy',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8455-345678',
        rating: 4.3,
        specialties: ['Vegetables', 'Fruits', 'Dairy Products'],
        dailyVolume: '210+ tons',
        established: '1970',
        marketType: 'Mixed'
      },
      {
        name: 'Zaheerabad Market',
        description: 'Border market with Maharashtra',
        location: 'Zaheerabad, Sangareddy',
        mapsLink: 'https://maps.google.com/?q=Zaheerabad+Market+Sangareddy+Telangana',
        famousFor: 'Vegetables, Grains, Fruits',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8456-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Grains', 'Fruits'],
        dailyVolume: '150+ tons',
        established: '1968',
        marketType: 'Border'
      }
    ],
    'Siddipet': [
      {
        name: 'Siddipet Main Market',
        description: 'Strategic agricultural market',
        location: 'Siddipet Urban',
        mapsLink: 'https://maps.google.com/?q=Siddipet+Main+Market+Telangana',
        famousFor: 'Vegetables, Grains, Flowers',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8457-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Grains', 'Flowers'],
        dailyVolume: '170+ tons',
        established: '1965',
        marketType: 'Agricultural'
      },
      {
        name: 'Gajwel Market',
        description: 'Constituency market near CM residence',
        location: 'Gajwel, Siddipet',
        mapsLink: 'https://maps.google.com/?q=Gajwel+Market+Siddipet+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8458-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '120+ tons',
        established: '1972',
        marketType: 'Agricultural'
      }
    ],
    'Kamareddy': [
      {
        name: 'Kamareddy Main Market',
        description: 'Border district agricultural market',
        location: 'Kamareddy Urban',
        mapsLink: 'https://maps.google.com/?q=Kamareddy+Main+Market+Telangana',
        famousFor: 'Vegetables, Grains, Fruits',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8468-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Fruits'],
        dailyVolume: '160+ tons',
        established: '1960',
        marketType: 'Border'
      },
      {
        name: 'Banswada Market',
        description: 'Turmeric and agricultural market',
        location: 'Banswada, Kamareddy',
        mapsLink: 'https://maps.google.com/?q=Banswada+Market+Kamareddy+Telangana',
        famousFor: 'Turmeric, Vegetables, Grains',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8469-234567',
        rating: 4.0,
        specialties: ['Turmeric', 'Vegetables', 'Grains'],
        dailyVolume: '110+ tons',
        established: '1965',
        marketType: 'Agricultural'
      }
    ],
    'Jagtial': [
      {
        name: 'Jagtial Main Market',
        description: 'Cotton belt agricultural hub',
        location: 'Jagtial Urban',
        mapsLink: 'https://maps.google.com/?q=Jagtial+Main+Market+Telangana',
        famousFor: 'Cotton, Vegetables, Grains',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-8724-234567',
        rating: 4.3,
        specialties: ['Cotton Trading', 'Vegetables', 'Grains'],
        dailyVolume: '200+ tons',
        established: '1968',
        marketType: 'Cotton Belt'
      },
      {
        name: 'Koratla Market',
        description: 'Agricultural market in northern Jagtial',
        location: 'Koratla, Jagtial',
        mapsLink: 'https://maps.google.com/?q=Koratla+Market+Jagtial+Telangana',
        famousFor: 'Cotton, Vegetables, Paddy',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8725-234567',
        rating: 4.1,
        specialties: ['Cotton', 'Vegetables', 'Paddy'],
        dailyVolume: '130+ tons',
        established: '1970',
        marketType: 'Agricultural'
      }
    ],
    'Mancherial': [
      {
        name: 'Mancherial Main Market',
        description: 'Coal belt agricultural market',
        location: 'Mancherial Urban',
        mapsLink: 'https://maps.google.com/?q=Mancherial+Main+Market+Telangana',
        famousFor: 'Vegetables, Grains, Industrial Supply',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8736-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Industrial Supply'],
        dailyVolume: '180+ tons',
        established: '1970',
        marketType: 'Industrial'
      },
      {
        name: 'Bellampalli Market',
        description: 'Coal town agricultural market',
        location: 'Bellampalli, Mancherial',
        mapsLink: 'https://maps.google.com/?q=Bellampalli+Market+Mancherial+Telangana',
        famousFor: 'Vegetables, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8737-234567',
        rating: 4.0,
        specialties: ['Vegetables', 'Grains'],
        dailyVolume: '120+ tons',
        established: '1972',
        marketType: 'Mixed'
      }
    ],
    'Peddapalli': [
      {
        name: 'Peddapalli Main Market',
        description: 'Coal and agricultural mixed economy',
        location: 'Peddapalli Urban',
        mapsLink: 'https://maps.google.com/?q=Peddapalli+Main+Market+Telangana',
        famousFor: 'Mixed Agricultural Products',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8728-234567',
        rating: 4.1,
        specialties: ['Mixed Economy', 'Agricultural Produce'],
        dailyVolume: '170+ tons',
        established: '1972',
        marketType: 'Mixed'
      },
      {
        name: 'Ramagundam Market',
        description: 'Industrial city agricultural market',
        location: 'Ramagundam, Peddapalli',
        mapsLink: 'https://maps.google.com/?q=Ramagundam+Market+Peddapalli+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8728-345678',
        rating: 4.2,
        specialties: ['Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '160+ tons',
        established: '1968',
        marketType: 'Industrial'
      }
    ],
    'Jayashankar Bhupalpally': [
      {
        name: 'Bhupalpally Main Market',
        description: 'Agricultural market in forest belt',
        location: 'Bhupalpally, Jayashankar',
        mapsLink: 'https://maps.google.com/?q=Bhupalpally+Market+Jayashankar+Telangana',
        famousFor: 'Mixed Economy Produce',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8716-234567',
        rating: 4.1,
        specialties: ['Mixed Economy', 'Agricultural Produce'],
        dailyVolume: '150+ tons',
        established: '1965',
        marketType: 'Mixed'
      },
      {
        name: 'Mulugu Market',
        description: 'Forest and tribal produce market',
        location: 'Mulugu, Jayashankar',
        mapsLink: 'https://maps.google.com/?q=Mulugu+Market+Jayashankar+Telangana',
        famousFor: 'Forest Products, Tribal Produce',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8716-345678',
        rating: 4.0,
        specialties: ['Forest Products', 'Tribal Produce'],
        dailyVolume: '90+ tons',
        established: '1960',
        marketType: 'Forest'
      }
    ],
    'Yadadri Bhuvanagiri': [
      {
        name: 'Bhongir Main Market',
        description: 'Growing market near Hyderabad',
        location: 'Bhongir, Yadadri Bhuvanagiri',
        mapsLink: 'https://maps.google.com/?q=Bhongir+Market+Yadadri+Bhuvanagiri+Telangana',
        famousFor: 'Proximity Market, Fresh Produce',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8682-567890',
        rating: 4.2,
        specialties: ['Proximity Trade', 'Fresh Vegetables'],
        dailyVolume: '160+ tons',
        established: '1970',
        marketType: 'Proximity'
      },
      {
        name: 'Yadagirigutta Market',
        description: 'Pilgrimage town market with high footfall',
        location: 'Yadagirigutta, Yadadri Bhuvanagiri',
        mapsLink: 'https://maps.google.com/?q=Yadagirigutta+Market+Yadadri+Telangana',
        famousFor: 'Flowers, Vegetables, Fruits',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-8682-678901',
        rating: 4.3,
        specialties: ['Flowers', 'Vegetables', 'Fruits'],
        dailyVolume: '130+ tons',
        established: '1975',
        marketType: 'Pilgrimage'
      }
    ],
    'Jangaon': [
      {
        name: 'Jangaon Main Market',
        description: 'Important market for northern Warangal',
        location: 'Jangaon Urban',
        mapsLink: 'https://maps.google.com/?q=Jangaon+Main+Market+Telangana',
        famousFor: 'Regional Produce, Farm Products',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8713-234567',
        rating: 4.3,
        specialties: ['Regional Produce', 'Farm Products'],
        dailyVolume: '130+ tons',
        established: '1965',
        marketType: 'Regional'
      },
      {
        name: 'Palakurthi Market',
        description: 'Agricultural market in Jangaon district',
        location: 'Palakurthi, Jangaon',
        mapsLink: 'https://maps.google.com/?q=Palakurthi+Market+Jangaon+Telangana',
        famousFor: 'Paddy, Vegetables, Cotton',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8713-345678',
        rating: 4.0,
        specialties: ['Paddy', 'Vegetables', 'Cotton'],
        dailyVolume: '90+ tons',
        established: '1972',
        marketType: 'Agricultural'
      }
    ],
    'Kumuram Bheem Asifabad': [
      {
        name: 'Asifabad Main Market',
        description: 'Tribal area agricultural market',
        location: 'Asifabad, Kumuram Bheem',
        mapsLink: 'https://maps.google.com/?q=Asifabad+Market+Kumuram+Bheem+Telangana',
        famousFor: 'Tribal Produce, Forest Products',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8733-234567',
        rating: 4.0,
        specialties: ['Tribal Produce', 'Forest Products'],
        dailyVolume: '100+ tons',
        established: '1960',
        marketType: 'Tribal'
      },
      {
        name: 'Sirpur Market',
        description: 'Paper mill town agricultural market',
        location: 'Sirpur, Kumuram Bheem',
        mapsLink: 'https://maps.google.com/?q=Sirpur+Market+Kumuram+Bheem+Telangana',
        famousFor: 'Vegetables, Forest Products',
        timings: '6:00 AM - 8:00 PM',
        contact: '+91-8733-345678',
        rating: 3.9,
        specialties: ['Vegetables', 'Forest Products'],
        dailyVolume: '70+ tons',
        established: '1965',
        marketType: 'Industrial'
      }
    ],
    'Mahabubabad': [
      {
        name: 'Mahabubabad Main Market',
        description: 'Strategic market for western Warangal',
        location: 'Mahabubabad Urban',
        mapsLink: 'https://maps.google.com/?q=Mahabubabad+Main+Market+Telangana',
        famousFor: 'Mixed Agricultural Products',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8719-234567',
        rating: 4.2,
        specialties: ['Mixed Produce', 'Regional Trade'],
        dailyVolume: '140+ tons',
        established: '1970',
        marketType: 'Strategic'
      },
      {
        name: 'Dornakal Market',
        description: 'Agricultural market near railway junction',
        location: 'Dornakal, Mahabubabad',
        mapsLink: 'https://maps.google.com/?q=Dornakal+Market+Mahabubabad+Telangana',
        famousFor: 'Paddy, Vegetables, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8719-345678',
        rating: 4.0,
        specialties: ['Paddy', 'Vegetables', 'Grains'],
        dailyVolume: '100+ tons',
        established: '1968',
        marketType: 'Agricultural'
      }
    ],
    'Narayanpet': [
      {
        name: 'Narayanpet Main Market',
        description: 'Traditional agricultural market',
        location: 'Narayanpet Urban',
        mapsLink: 'https://maps.google.com/?q=Narayanpet+Main+Market+Telangana',
        famousFor: 'Traditional Farm Produce, Local Vegetables',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8548-234567',
        rating: 4.0,
        specialties: ['Traditional Produce', 'Local Vegetables'],
        dailyVolume: '90+ tons',
        established: '1958',
        marketType: 'Traditional'
      },
      {
        name: 'Makthal Market',
        description: 'Border market with Karnataka',
        location: 'Makthal, Narayanpet',
        mapsLink: 'https://maps.google.com/?q=Makthal+Market+Narayanpet+Telangana',
        famousFor: 'Vegetables, Grains, Border Trade',
        timings: '6:00 AM - 8:00 PM',
        contact: '+91-8549-234567',
        rating: 3.9,
        specialties: ['Vegetables', 'Grains', 'Border Trade'],
        dailyVolume: '70+ tons',
        established: '1965',
        marketType: 'Border'
      }
    ],
    'Nagarkurnool': [
      {
        name: 'Nagarkurnool Main Market',
        description: 'Agricultural hub for southern Telangana',
        location: 'Nagarkurnool Urban',
        mapsLink: 'https://maps.google.com/?q=Nagarkurnool+Main+Market+Telangana',
        famousFor: 'Vegetables, Grains, Fruits',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8518-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Grains', 'Fruits'],
        dailyVolume: '150+ tons',
        established: '1962',
        marketType: 'Agricultural'
      },
      {
        name: 'Achampet Market',
        description: 'Forest area agricultural market',
        location: 'Achampet, Nagarkurnool',
        mapsLink: 'https://maps.google.com/?q=Achampet+Market+Nagarkurnool+Telangana',
        famousFor: 'Forest Products, Vegetables',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8519-234567',
        rating: 4.0,
        specialties: ['Forest Products', 'Vegetables'],
        dailyVolume: '90+ tons',
        established: '1968',
        marketType: 'Forest'
      }
    ],
    'Medak': [
      {
        name: 'Medak Main Market',
        description: 'Traditional agricultural market',
        location: 'Medak Urban',
        mapsLink: 'https://maps.google.com/?q=Medak+Main+Market+Telangana',
        famousFor: 'Vegetables, Grains, Dairy',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8452-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Dairy Products'],
        dailyVolume: '140+ tons',
        established: '1960',
        marketType: 'Traditional'
      },
      {
        name: 'Toopran Market',
        description: 'Agricultural market near Hyderabad',
        location: 'Toopran, Medak',
        mapsLink: 'https://maps.google.com/?q=Toopran+Market+Medak+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8453-234567',
        rating: 4.0,
        specialties: ['Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '100+ tons',
        established: '1968',
        marketType: 'Agricultural'
      }
    ],
    'Rajanna Sircilla': [
      {
        name: 'Sircilla Main Market',
        description: 'Textile town agricultural market',
        location: 'Sircilla Urban',
        mapsLink: 'https://maps.google.com/?q=Sircilla+Main+Market+Rajanna+Sircilla+Telangana',
        famousFor: 'Mixed Economy Produce',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8723-234567',
        rating: 4.2,
        specialties: ['Mixed Economy', 'Vegetables', 'Grains'],
        dailyVolume: '120+ tons',
        established: '1968',
        marketType: 'Textile'
      },
      {
        name: 'Vemulawada Market',
        description: 'Pilgrimage town market',
        location: 'Vemulawada, Rajanna Sircilla',
        mapsLink: 'https://maps.google.com/?q=Vemulawada+Market+Rajanna+Sircilla+Telangana',
        famousFor: 'Flowers, Vegetables, Fruits',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8723-345678',
        rating: 4.3,
        specialties: ['Flowers', 'Vegetables', 'Fruits'],
        dailyVolume: '100+ tons',
        established: '1972',
        marketType: 'Pilgrimage'
      }
    ],
    'Vikarabad': [
      {
        name: 'Vikarabad Main Market',
        description: 'Traditional market for quality produce',
        location: 'Vikarabad Urban',
        mapsLink: 'https://maps.google.com/?q=Vikarabad+Main+Market+Telangana',
        famousFor: 'Mangoes, Vegetables, Grains',
        timings: '6:00 AM - 8:00 PM',
        contact: '+91-8415-234567',
        rating: 4.3,
        specialties: ['Mangoes', 'Vegetables', 'Paddy'],
        dailyVolume: '170+ tons',
        established: '1960',
        marketType: 'Traditional'
      },
      {
        name: 'Tandur Market',
        description: 'Agricultural market in southern Vikarabad',
        location: 'Tandur, Vikarabad',
        mapsLink: 'https://maps.google.com/?q=Tandur+Market+Vikarabad+Telangana',
        famousFor: 'Cotton, Vegetables, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8416-234567',
        rating: 4.1,
        specialties: ['Cotton', 'Vegetables', 'Grains'],
        dailyVolume: '120+ tons',
        established: '1968',
        marketType: 'Agricultural'
      }
    ],
    'Jogulamba Gadwal': [
      {
        name: 'Gadwal Main Market',
        description: 'Border market with Karnataka',
        location: 'Gadwal, Jogulamba Gadwal',
        mapsLink: 'https://maps.google.com/?q=Gadwal+Main+Market+Jogulamba+Gadwal+Telangana',
        famousFor: 'Border Trade, Vegetables',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8546-234567',
        rating: 4.1,
        specialties: ['Border Trade', 'Vegetables', 'Grains'],
        dailyVolume: '130+ tons',
        established: '1962',
        marketType: 'Border'
      },
      {
        name: 'Alampur Market',
        description: 'Pilgrimage town agricultural market',
        location: 'Alampur, Jogulamba Gadwal',
        mapsLink: 'https://maps.google.com/?q=Alampur+Market+Jogulamba+Gadwal+Telangana',
        famousFor: 'Flowers, Vegetables, Fruits',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8547-234567',
        rating: 4.0,
        specialties: ['Flowers', 'Vegetables', 'Fruits'],
        dailyVolume: '90+ tons',
        established: '1970',
        marketType: 'Pilgrimage'
      }
    ],
    'Wanaparthy': [
      {
        name: 'Wanaparthy Main Market',
        description: 'Agricultural hub for southern Telangana',
        location: 'Wanaparthy Urban',
        mapsLink: 'https://maps.google.com/?q=Wanaparthy+Main+Market+Telangana',
        famousFor: 'Vegetables, Grains, Dairy',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8543-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Dairy'],
        dailyVolume: '140+ tons',
        established: '1972',
        marketType: 'Agricultural'
      },
      {
        name: 'Atmakur Market',
        description: 'Agricultural market in Wanaparthy',
        location: 'Atmakur, Wanaparthy',
        mapsLink: 'https://maps.google.com/?q=Atmakur+Market+Wanaparthy+Telangana',
        famousFor: 'Vegetables, Grains',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8544-234567',
        rating: 4.0,
        specialties: ['Vegetables', 'Grains'],
        dailyVolume: '90+ tons',
        established: '1975',
        marketType: 'Agricultural'
      }
    ],
    'Bhadradri Kothagudem': [
      {
        name: 'Kothagudem Main Market',
        description: 'Coal belt agricultural market',
        location: 'Kothagudem Urban',
        mapsLink: 'https://maps.google.com/?q=Kothagudem+Main+Market+Bhadradri+Telangana',
        famousFor: 'Mixed Economy Agriculture',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8744-234567',
        rating: 4.1,
        specialties: ['Mixed Economy', 'Agricultural Produce'],
        dailyVolume: '150+ tons',
        established: '1968',
        marketType: 'Coal Belt'
      },
      {
        name: 'Bhadrachalam Market',
        description: 'Pilgrimage and tribal town market',
        location: 'Bhadrachalam, Bhadradri Kothagudem',
        mapsLink: 'https://maps.google.com/?q=Bhadrachalam+Market+Bhadradri+Kothagudem+Telangana',
        famousFor: 'Tribal Produce, Forest Products, Flowers',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8745-234567',
        rating: 4.2,
        specialties: ['Tribal Produce', 'Forest Products', 'Flowers'],
        dailyVolume: '120+ tons',
        established: '1965',
        marketType: 'Pilgrimage'
      },
      {
        name: 'Palvancha Market',
        description: 'Coal town market near Kothagudem',
        location: 'Palvancha, Bhadradri Kothagudem',
        mapsLink: 'https://maps.google.com/?q=Palvancha+Market+Bhadradri+Kothagudem+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8744-345678',
        rating: 4.0,
        specialties: ['Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '100+ tons',
        established: '1972',
        marketType: 'Industrial'
      }
    ],
    'Hanamkonda': [
      {
        name: 'Hanamkonda Main Market',
        description: 'Strategic market in Warangal urban area',
        location: 'Hanamkonda, Warangal Urban',
        mapsLink: 'https://maps.google.com/?q=Hanamkonda+Main+Market+Warangal+Telangana',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-870-345678',
        rating: 4.3,
        specialties: ['Vegetables', 'Fruits', 'Grains'],
        dailyVolume: '160+ tons',
        established: '1965',
        marketType: 'Strategic'
      },
      {
        name: 'Kazipet Market',
        description: 'Railway junction market in Hanamkonda',
        location: 'Kazipet, Hanamkonda',
        mapsLink: 'https://maps.google.com/?q=Kazipet+Market+Hanamkonda+Warangal+Telangana',
        famousFor: 'Vegetables, Grains, Mixed Produce',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-870-456789',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Mixed Produce'],
        dailyVolume: '120+ tons',
        established: '1968',
        marketType: 'Railway'
      }
    ],
    'Nirmal': [
      {
        name: 'Nirmal Main Market',
        description: 'Wood craft and agricultural market',
        location: 'Nirmal Urban',
        mapsLink: 'https://maps.google.com/?q=Nirmal+Main+Market+Telangana',
        famousFor: 'Crafts, Agricultural Products',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8734-234567',
        rating: 4.1,
        specialties: ['Craft Products', 'Agricultural Produce'],
        dailyVolume: '110+ tons',
        established: '1972',
        marketType: 'Craft'
      },
      {
        name: 'Bhainsa Market',
        description: 'Border town market with Maharashtra',
        location: 'Bhainsa, Nirmal',
        mapsLink: 'https://maps.google.com/?q=Bhainsa+Market+Nirmal+Telangana',
        famousFor: 'Cotton, Vegetables, Grains',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8734-345678',
        rating: 4.0,
        specialties: ['Cotton', 'Vegetables', 'Grains'],
        dailyVolume: '90+ tons',
        established: '1968',
        marketType: 'Border'
      }
    ],
    'Mulugu': [
      {
        name: 'Mulugu Main Market',
        description: 'Forest and agricultural products market',
        location: 'Mulugu Urban',
        mapsLink: 'https://maps.google.com/?q=Mulugu+Main+Market+Telangana',
        famousFor: 'Forest Products, Tribal Produce',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8716-789012',
        rating: 4.0,
        specialties: ['Forest Products', 'Tribal Produce'],
        dailyVolume: '120+ tons',
        established: '1960',
        marketType: 'Forest'
      },
      {
        name: 'Venkatapuram Market',
        description: 'Tribal area forest produce market',
        location: 'Venkatapuram, Mulugu',
        mapsLink: 'https://maps.google.com/?q=Venkatapuram+Market+Mulugu+Telangana',
        famousFor: 'Forest Products, Tribal Produce',
        timings: '6:00 AM - 8:00 PM',
        contact: '+91-8716-890123',
        rating: 3.9,
        specialties: ['Forest Products', 'Tribal Produce'],
        dailyVolume: '70+ tons',
        established: '1965',
        marketType: 'Tribal'
      }
    ],
    'Suryapet': [
      {
        name: 'Suryapet Main Market',
        description: 'Strategic market for eastern Nalgonda',
        location: 'Suryapet Urban',
        mapsLink: 'https://maps.google.com/?q=Suryapet+Main+Market+Telangana',
        famousFor: 'Mixed Agricultural Produce',
        timings: '4:30 AM - 10:00 PM',
        contact: '+91-8684-234567',
        rating: 4.4,
        specialties: ['Mixed Produce', 'Regional Trade'],
        dailyVolume: '150+ tons',
        established: '1965',
        marketType: 'Strategic'
      },
      {
        name: 'Kodad Market',
        description: 'Agricultural market in eastern Suryapet',
        location: 'Kodad, Suryapet',
        mapsLink: 'https://maps.google.com/?q=Kodad+Market+Suryapet+Telangana',
        famousFor: 'Paddy, Vegetables, Grains',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8684-345678',
        rating: 4.2,
        specialties: ['Paddy', 'Vegetables', 'Grains'],
        dailyVolume: '120+ tons',
        established: '1968',
        marketType: 'Agricultural'
      }
    ]
  };

  const districts = Object.keys(telanganaMarkets);
  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'flowers'];

  // Helper function to convert district name to translation key
  const getDistrictKey = (district) => {
    const keyMap = {
      'Hyderabad': 'hyderabad',
      'Rangareddy': 'rangareddy',
      'Medchal-Malkajgiri': 'medchalMalkajgiri',
      'Warangal': 'warangal',
      'Nalgonda': 'nalgonda',
      'Karimnagar': 'karimnagar',
      'Khammam': 'khammam',
      'Nizamabad': 'nizamabad',
      'Adilabad': 'adilabad',
      'Mahabubnagar': 'mahabubnagar',
      'Sangareddy': 'sangareddy',
      'Siddipet': 'siddipet',
      'Kamareddy': 'kamareddy',
      'Jagtial': 'jagtial',
      'Mancherial': 'mancherial',
      'Peddapalli': 'peddapalli',
      'Jayashankar Bhupalpally': 'jayashankarBhupalpally',
      'Yadadri Bhuvanagiri': 'yadadriBhuvanagiri',
      'Jangaon': 'jangaon',
      'Kumuram Bheem Asifabad': 'kumuramBheemAsifabad',
      'Mahabubabad': 'mahabubabad',
      'Narayanpet': 'narayanpet',
      'Nagarkurnool': 'nagarkurnool',
      'Medak': 'medak',
      'Rajanna Sircilla': 'rajannaSircilla',
      'Vikarabad': 'vikarabad',
      'Jogulamba Gadwal': 'jogulambaGadwal',
      'Wanaparthy': 'wanaparthy',
      'Bhadradri Kothagudem': 'bhadradriKothagudem',
      'Hanamkonda': 'hanamkonda',
      'Nirmal': 'nirmal',
      'Mulugu': 'mulugu',
      'Suryapet': 'suryapet'
    };
    return keyMap[district] || district.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const handleGetDirections = (market) => {
    window.open(market.mapsLink, '_blank');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
        style={{ color: '#f59e0b' }}
      />
    ));
  };

  const handleDistrictClick = (district) => {
    setSelectedDistrict(selectedDistrict === district ? null : district);
  };

  const filteredDistricts = districts.filter(district => 
    district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    telanganaMarkets[district].some(market => 
      market.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredMarkets = selectedDistrict && telanganaMarkets[selectedDistrict] 
    ? telanganaMarkets[selectedDistrict].filter(market => 
        selectedCategory === 'all' || market.specialties.some(specialty => 
          specialty.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      )
    : [];

  return (
    <>
      <GoogleFonts />
      <div className="min-h-screen" style={{ background: '#f0fdf4' }}>
        {/* Hero Section - Professional Design */}
        <section className="relative overflow-hidden text-white" style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
          padding: '48px 32px',
          borderRadius: '0 0 28px 28px'
        }}>
          {/* Background Image Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://t3.ftcdn.net/jpg/10/18/41/42/360_F_1018414204_slajqwEJK41TZ9N7c9V55N8jgu0jnNJB.jpg')`,
              opacity: '0.7'
            }}
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              {/* Floating elements */}
              <div className="absolute top-10 left-10 float-animation">
                <div className="w-20 h-20 rounded-full backdrop-blur-sm" style={{ background: 'rgba(74,222,128,0.08)' }}></div>
              </div>
              <div className="absolute top-20 right-20 float-animation" style={{ animationDelay: '2s' }}>
                <div className="w-16 h-16 rounded-full backdrop-blur-sm" style={{ background: 'rgba(74,222,128,0.08)' }}></div>
              </div>
              <div className="absolute bottom-10 left-1/4 float-animation" style={{ animationDelay: '4s' }}>
                <div className="w-24 h-24 rounded-full backdrop-blur-sm" style={{ background: 'rgba(74,222,128,0.08)' }}></div>
              </div>
              
              <div className="fade-in-up">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl backdrop-blur-sm mb-6" style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#f59e0b'
                }}>
                  <Building className="w-10 h-10" />
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ 
                  fontFamily: 'Playfair Display', 
                  color: '#f59e0b',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}>
                  {t('marketplace.hero.title')}
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed" style={{ 
                  color: '#fbbf24',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'inline-block',
                  fontWeight: '600'
                }}>
                  {t('marketplace.hero.subtitle')}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
                  <div className="text-center" style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '14px',
                    padding: '16px'
                  }}>
                    <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <div className="text-4xl font-bold mb-2" style={{ 
                      color: 'black',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>{t('marketplace.stats.marketsCount')}</div>
                    <div className="text-sm" style={{ 
                      color: 'black',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      fontWeight: 'bold'
                    }}>{t('marketplace.stats.markets')}</div>
                  </div>
                  </div>
                  <div className="text-center" style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '14px',
                    padding: '16px'
                  }}>
                    <div className="text-4xl font-bold mb-2" style={{ 
                      color: 'black',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>{t('marketplace.stats.districtsCount')}</div>
                    <div className="text-sm" style={{ 
                      color: 'black',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      fontWeight: 'bold'
                    }}>{t('marketplace.stats.districts')}</div>
                  </div>
                  <div className="text-center" style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '14px',
                    padding: '16px'
                  }}>
                    <div className="text-4xl font-bold mb-2" style={{ 
                      color: 'black',
                      textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>{t('marketplace.stats.supportCount')}</div>
                    <div className="text-sm" style={{ 
                      color: 'black',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                    
                    }}>{t('marketplace.stats.support')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Search and Filters */}
        <section className="py-12" style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          margin: '0 16px'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Bar */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('marketplace.search.placeholder')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent text-lg appearance-none cursor-pointer"
                >
                  <option value="all">{t('marketplace.categories.all')}</option>
                  <option value="vegetables">{t('marketplace.categories.vegetables')}</option>
                  <option value="fruits">{t('marketplace.categories.fruits')}</option>
                  <option value="grains">{t('marketplace.categories.grains')}</option>
                  <option value="dairy">{t('marketplace.categories.dairy')}</option>
                  <option value="flowers">{t('marketplace.categories.flowers')}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* District Selection */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display' }}>
                {t('marketplace.explore.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('marketplace.explore.subtitle')}
              </p>
            </div>
            
            {filteredDistricts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600 text-lg">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDistricts.map((district) => {
                  const markets = telanganaMarkets[district];
                  const isSelected = selectedDistrict === district;
                  
                  return (
                    <button
                      key={district}
                      onClick={() => handleDistrictClick(district)}
                      className="group relative p-6 transition-all duration-200"
                      style={{
                        borderRadius: '16px',
                        border: '1.5px solid #e2e8f0',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#16a34a';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDistrict !== district) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                        }
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{
                          background: isSelected ? '#16a34a' : '#f3f4f6',
                          color: isSelected ? 'white' : '#6b7280'
                        }}>
                          <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2" style={{
                          color: isSelected ? 'white' : '#111827'
                        }}>
                          {t(`marketplace.districts.${getDistrictKey(district)}`)}
                        </h3>
                        <div className="text-sm" style={{ color: '#6b7280' }}>
                          {markets.length} {t('marketplace.explore.marketsCount')}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-purple-500 text-white rounded-full p-1">
                            <Filter className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Markets Display */}
        {selectedDistrict && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display' }}>
                  Markets in {t(`marketplace.districts.${getDistrictKey(selectedDistrict)}`)}
                </h2>
                <p className="text-xl text-gray-600">
                  {filteredMarkets.length} agricultural marketplaces available
                </p>
              </div>
              
              {filteredMarkets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No Markets Found
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Try selecting a different category
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMarkets.map((market, index) => (
                    <div key={index} className="group overflow-hidden" style={{
                      borderRadius: '20px',
                      border: '1px solid #e8f5e9',
                      background: 'white',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(22,163,74,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                    }}
                  >
                      <div className="p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                {market.name}
                              </h3>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{market.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderStars(market.rating)}
                            <span className="ml-2 text-sm font-semibold text-gray-700">{market.rating}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {market.description}
                        </p>
                        
                        {/* Key Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center text-gray-600 mb-2">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              <span className="text-sm font-semibold">{t('marketplace.marketInfo.dailyVolume')}</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{market.dailyVolume}</div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center text-gray-600 mb-2">
                              <Award className="w-4 h-4 mr-2" />
                              <span className="text-sm font-semibold">{t('marketplace.marketInfo.established')}</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{market.established}</div>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="mb-6">
                          <div className="flex items-center text-gray-600 mb-3">
                            <Zap className="w-4 h-4 mr-2" />
                            <span className="text-sm font-semibold">{t('marketplace.marketInfo.famousFor')}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {market.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">{market.timings}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="text-sm">{market.contact}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleGetDirections(market)}
                            className="flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center border-none"
                            style={{
                              background: 'linear-gradient(135deg, #16a34a, #15803d)',
                              color: 'white',
                              borderRadius: '10px',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.03)';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(22,163,74,0.35)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            {t('marketplace.marketInfo.getDirections')}
                          </button>
                          <button
                            onClick={() => navigator.clipboard.writeText(market.coordinates)}
                            className="px-4 py-3 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #16a34a, #15803d)',
                              color: 'white',
                              borderRadius: '10px',
                              border: 'none',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.03)';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(22,163,74,0.35)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <MapPin className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display' }}>
                {t('marketplace.features.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('marketplace.features.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('marketplace.features.exactLocations.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('marketplace.features.exactLocations.description')}
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('marketplace.features.marketInsights.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('marketplace.features.marketInsights.description')}
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('marketplace.features.directConnect.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('marketplace.features.directConnect.description')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Marketplace;
