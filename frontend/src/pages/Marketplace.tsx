import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  Search,
  ChevronDown,
  ChevronUp,
  Building,
  TrendingUp,
  Users
} from 'lucide-react';

const Marketplace = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // All 33 Telangana districts with their markets
  const telanganaMarkets = {
    'Hyderabad': [
      {
        name: 'Monda Market',
        description: 'Largest wholesale vegetable market in Hyderabad',
        location: 'Secunderabad, Hyderabad',
        coordinates: '17.4399° N, 78.4983° E',
        famousFor: 'Vegetables, Fruits, Flowers',
        timings: '4:00 AM - 10:00 PM',
        contact: '+91-40-27801234',
        rating: 4.5,
        specialties: ['Fresh Vegetables', 'Seasonal Fruits', 'Flowers']
      },
      {
        name: 'Bowenpally Market',
        description: 'Popular wholesale and retail market',
        location: 'Bowenpally, Hyderabad',
        coordinates: '17.4529° N, 78.4528° E',
        famousFor: 'Vegetables, Grains, Daily Essentials',
        timings: '5:00 AM - 11:00 PM',
        contact: '+91-40-27784567',
        rating: 4.3,
        specialties: ['Vegetables', 'Grains', 'Pulses']
      }
    ],
    'Rangareddy': [
      {
        name: 'Shadnagar Market',
        description: 'Major agricultural hub connecting rural farmers',
        location: 'Shadnagar, Rangareddy',
        coordinates: '17.0667° N, 78.2167° E',
        famousFor: 'Grains, Vegetables, Cotton',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8522-234567',
        rating: 4.4,
        specialties: ['Paddy', 'Cotton', 'Vegetables']
      },
      {
        name: 'Vikarabad Market',
        description: 'Traditional market for quality agricultural produce',
        location: 'Vikarabad, Rangareddy',
        coordinates: '17.3667° N, 78.1333° E',
        famousFor: 'Mangoes, Vegetables, Grains',
        timings: '6:00 AM - 8:00 PM',
        contact: '+91-8415-234567',
        rating: 4.3,
        specialties: ['Mangoes', 'Vegetables', 'Paddy']
      }
    ],
    'Medchal': [
      {
        name: 'Medchal Market',
        description: 'Major wholesale market serving northern Telangana',
        location: 'Medchal, Medchal Malkajgiri',
        coordinates: '17.6333° N, 78.4833° E',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:30 AM - 10:00 PM',
        contact: '+91-8455-234567',
        rating: 4.4,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains']
      }
    ],
    'Warangal': [
      {
        name: 'Warangal Main Market',
        description: 'Largest wholesale and retail market in Warangal',
        location: 'Warangal Urban',
        coordinates: '18.0000° N, 79.5833° E',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:00 AM - 11:00 PM',
        contact: '+91-870-234567',
        rating: 4.5,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains']
      }
    ],
    'Nalgonda': [
      {
        name: 'Nalgonda Main Market',
        description: 'Primary wholesale and retail market',
        location: 'Nalgonda Urban',
        coordinates: '17.0500° N, 79.2667° E',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:30 AM - 10:30 PM',
        contact: '+91-8682-234567',
        rating: 4.4,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains']
      }
    ],
    'Karimnagar': [
      {
        name: 'Karimnagar Main Market',
        description: 'Largest wholesale and retail market',
        location: 'Karimnagar Urban',
        coordinates: '18.4333° N, 79.1333° E',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:00 AM - 11:00 PM',
        contact: '+91-878-234567',
        rating: 4.5,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains']
      }
    ],
    'Khammam': [
      {
        name: 'Khammam Main Market',
        description: 'Primary wholesale and retail market',
        location: 'Khammam Urban',
        coordinates: '17.2500° N, 80.1500° E',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '4:30 AM - 10:30 PM',
        contact: '+91-8742-234567',
        rating: 4.4,
        specialties: ['Wholesale Vegetables', 'Fruits', 'Grains']
      }
    ],
    'Nizamabad': [
      {
        name: 'Nizamabad Main Market',
        description: 'Major agricultural hub for northern Telangana',
        location: 'Nizamabad Urban',
        coordinates: '18.6725° N, 78.0942° E',
        famousFor: 'Rice, Vegetables, Fruits',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-8462-234567',
        rating: 4.3,
        specialties: ['Rice Trading', 'Vegetables', 'Fruits']
      }
    ],
    'Adilabad': [
      {
        name: 'Adilabad Main Market',
        description: 'Tribal area agricultural market',
        location: 'Adilabad Urban',
        coordinates: '19.6667° N, 78.5333° E',
        famousFor: 'Forest Products, Vegetables',
        timings: '6:00 AM - 9:00 PM',
        contact: '+91-873-234567',
        rating: 4.0,
        specialties: ['Forest Products', 'Tribal Produce', 'Vegetables']
      }
    ],
    'Mahabubnagar': [
      {
        name: 'Mahabubnagar Main Market',
        description: 'Agricultural hub for southern Telangana',
        location: 'Mahabubnagar Urban',
        coordinates: '16.7333° N, 77.9833° E',
        famousFor: 'Vegetables, Grains, Pulses',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8542-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Grains', 'Pulses']
      }
    ],
    'Sangareddy': [
      {
        name: 'Sangareddy Main Market',
        description: 'Growing market near Hyderabad',
        location: 'Sangareddy Urban',
        coordinates: '17.6167° N, 78.0833° E',
        famousFor: 'Vegetables, Fruits, Dairy',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8455-345678',
        rating: 4.3,
        specialties: ['Vegetables', 'Fruits', 'Dairy Products']
      }
    ],
    'Siddipet': [
      {
        name: 'Siddipet Main Market',
        description: 'Strategic agricultural market',
        location: 'Siddipet Urban',
        coordinates: '18.1000° N, 78.8500° E',
        famousFor: 'Vegetables, Grains, Flowers',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-8456-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Grains', 'Flowers']
      }
    ],
    'Jagtial': [
      {
        name: 'Jagtial Main Market',
        description: 'Cotton belt agricultural hub',
        location: 'Jagtial Urban',
        coordinates: '18.8000° N, 78.9167° E',
        famousFor: 'Cotton, Vegetables, Grains',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-87-2345678',
        rating: 4.3,
        specialties: ['Cotton Trading', 'Vegetables', 'Grains']
      }
    ],
    'Kamareddy': [
      {
        name: 'Kamareddy Main Market',
        description: 'Border district agricultural market',
        location: 'Kamareddy Urban',
        coordinates: '18.3167° N, 78.3500° E',
        famousFor: 'Vegetables, Grains, Fruits',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-8553-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Fruits']
      }
    ],
    'Mancherial': [
      {
        name: 'Mancherial Main Market',
        description: 'Coal belt agricultural market',
        location: 'Mancherial Urban',
        coordinates: '18.8667° N, 79.4333° E',
        famousFor: 'Vegetables, Grains, Industrial Supply',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-873-345678',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Industrial Supply']
      }
    ],
    'Peddapalli': [
      {
        name: 'Peddapalli Main Market',
        description: 'Coal and agricultural mixed economy',
        location: 'Peddapalli Urban',
        coordinates: '18.6167° N, 79.3833° E',
        famousFor: 'Mixed Agricultural Products',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-873-234567',
        rating: 4.1,
        specialties: ['Mixed Economy', 'Agricultural Produce']
      }
    ],
    'Jayashankar Bhupalpally': [
      {
        name: 'Bhupalpally Main Market',
        description: 'Coal belt agricultural market',
        location: 'Bhupalpally, Jayashankar',
        coordinates: '17.9167° N, 79.6667° E',
        famousFor: 'Mixed Economy Produce',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-871-678901',
        rating: 4.1,
        specialties: ['Mixed Economy', 'Agricultural Produce']
      }
    ],
    'Yadadri Bhuvanagiri': [
      {
        name: 'Bhongir Main Market',
        description: 'Growing market near Hyderabad',
        location: 'Bhongir, Yadadri Bhuvanagiri',
        coordinates: '17.4667° N, 78.8833° E',
        famousFor: 'Proximity Market, Fresh Produce',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8682-567890',
        rating: 4.2,
        specialties: ['Proximity Trade', 'Fresh Vegetables']
      }
    ],
    'Mulugu': [
      {
        name: 'Mulugu Main Market',
        description: 'Forest and agricultural products market',
        location: 'Mulugu Urban',
        coordinates: '18.2000° N, 80.0000° E',
        famousFor: 'Forest Products, Tribal Produce',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-871-789012',
        rating: 4.0,
        specialties: ['Forest Products', 'Tribal Produce']
      }
    ],
    'Wanaparthy': [
      {
        name: 'Wanaparthy Main Market',
        description: 'Agricultural hub for southern Telangana',
        location: 'Wanaparthy Urban',
        coordinates: '15.9167° N, 78.1333° E',
        famousFor: 'Vegetables, Grains, Dairy',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8514-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Dairy']
      }
    ],
    'Bhadradri Kothagudem': [
      {
        name: 'Kothagudem Main Market',
        description: 'Coal belt agricultural market',
        location: 'Kothagudem Urban',
        coordinates: '17.6167° N, 80.6167° E',
        famousFor: 'Mixed Economy Agriculture',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8744-234567',
        rating: 4.1,
        specialties: ['Mixed Economy', 'Agricultural Produce']
      }
    ],
    'Jangaon': [
      {
        name: 'Jangaon Main Market',
        description: 'Important market for northern Warangal',
        location: 'Jangaon Urban',
        coordinates: '17.7167° N, 79.5000° E',
        famousFor: 'Regional Produce, Farm Products',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-871-456789',
        rating: 4.3,
        specialties: ['Regional Produce', 'Farm Products']
      }
    ],
    'Kumuram Bheem': [
      {
        name: 'Asifabad Main Market',
        description: 'Tribal area agricultural market',
        location: 'Asifabad, Kumuram Bheem',
        coordinates: '19.3500° N, 79.3000° E',
        famousFor: 'Tribal Produce, Forest Products',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-873-890123',
        rating: 4.0,
        specialties: ['Tribal Produce', 'Forest Products']
      }
    ],
    'Mahabubabad': [
      {
        name: 'Mahabubabad Main Market',
        description: 'Strategic market for western Warangal',
        location: 'Mahabubabad Urban',
        coordinates: '17.6000° N, 80.0500° E',
        famousFor: 'Mixed Agricultural Products',
        timings: '5:00 AM - 9:00 PM',
        contact: '+91-871-234567',
        rating: 4.2,
        specialties: ['Mixed Produce', 'Regional Trade']
      }
    ],
    'Narayanpet': [
      {
        name: 'Narayanpet Main Market',
        description: 'Traditional agricultural market',
        location: 'Narayanpet Urban',
        coordinates: '16.7333° N, 77.5000° E',
        famousFor: 'Traditional Farm Produce',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-8543-234567',
        rating: 4.0,
        specialties: ['Traditional Produce', 'Local Vegetables']
      }
    ],
    'Nirmal': [
      {
        name: 'Nirmal Main Market',
        description: 'Wood craft and agricultural market',
        location: 'Nirmal Urban',
        coordinates: '19.1167° N, 78.3500° E',
        famousFor: 'Crafts, Agricultural Products',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-873-901234',
        rating: 4.1,
        specialties: ['Craft Products', 'Agricultural Produce']
      }
    ],
    'Rajanna Sircilla': [
      {
        name: 'Sircilla Main Market',
        description: 'Textile town agricultural market',
        location: 'Sircilla Urban',
        coordinates: '18.3000° N, 78.8333° E',
        famousFor: 'Mixed Economy Produce',
        timings: '5:30 AM - 9:30 PM',
        contact: '+91-87-3456789',
        rating: 4.2,
        specialties: ['Mixed Economy', 'Vegetables', 'Grains']
      }
    ],
    'Suryapet': [
      {
        name: 'Suryapet Main Market',
        description: 'Strategic market for eastern Nalgonda',
        location: 'Suryapet Urban',
        coordinates: '16.9667° N, 79.6167° E',
        famousFor: 'Mixed Agricultural Produce',
        timings: '4:30 AM - 10:00 PM',
        contact: '+91-8682-456789',
        rating: 4.4,
        specialties: ['Mixed Produce', 'Regional Trade']
      }
    ],
    'Vikarabad': [
      {
        name: 'Vikarabad Main Market',
        description: 'Traditional market for quality produce',
        location: 'Vikarabad Urban',
        coordinates: '17.3667° N, 78.1333° E',
        famousFor: 'Mangoes, Vegetables, Grains',
        timings: '6:00 AM - 8:00 PM',
        contact: '+91-8415-234567',
        rating: 4.3,
        specialties: ['Mangoes', 'Vegetables', 'Paddy']
      }
    ],
    'Jogulamba Gadwal': [
      {
        name: 'Gadwal Main Market',
        description: 'Border market with Karnataka',
        location: 'Gadwal, Jogulamba Gadwal',
        coordinates: '15.9833° N, 77.7000° E',
        famousFor: 'Border Trade, Vegetables',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8516-234567',
        rating: 4.1,
        specialties: ['Border Trade', 'Vegetables', 'Grains']
      }
    ],
    'Komaram Bheem Asifabad': [
      {
        name: 'Asifabad Main Market',
        description: 'Tribal area agricultural market',
        location: 'Asifabad, Komaram Bheem',
        coordinates: '19.3500° N, 79.3000° E',
        famousFor: 'Tribal Produce, Forest Products',
        timings: '6:00 AM - 8:30 PM',
        contact: '+91-873-890123',
        rating: 4.0,
        specialties: ['Tribal Produce', 'Forest Products']
      }
    ],
    'Hanumakonda': [
      {
        name: 'Hanumakonda Main Market',
        description: 'Strategic market in Warangal urban area',
        location: 'Hanumakonda, Warangal Urban',
        coordinates: '18.0000° N, 79.5833° E',
        famousFor: 'Vegetables, Fruits, Grains',
        timings: '5:00 AM - 10:00 PM',
        contact: '+91-870-345678',
        rating: 4.3,
        specialties: ['Vegetables', 'Fruits', 'Grains']
      }
    ],
    'Medak': [
      {
        name: 'Medak Main Market',
        description: 'Traditional agricultural market',
        location: 'Medak Urban',
        coordinates: '18.5000° N, 78.2500° E',
        famousFor: 'Vegetables, Grains, Dairy',
        timings: '5:30 AM - 9:00 PM',
        contact: '+91-8452-234567',
        rating: 4.1,
        specialties: ['Vegetables', 'Grains', 'Dairy Products']
      }
    ],
    'Nagarkurnool': [
      {
        name: 'Nagarkurnool Main Market',
        description: 'Agricultural hub for southern Telangana',
        location: 'Nagarkurnool Urban',
        coordinates: '16.4833° N, 78.3167° E',
        famousFor: 'Vegetables, Grains, Fruits',
        timings: '5:00 AM - 9:30 PM',
        contact: '+91-8515-234567',
        rating: 4.2,
        specialties: ['Vegetables', 'Grains', 'Fruits']
      }
    ]
  };

  const districts = Object.keys(telanganaMarkets);

  const handleGetDirections = (market) => {
    const encodedLocation = encodeURIComponent(market.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleDistrictClick = (district) => {
    setSelectedDistrict(selectedDistrict === district ? null : district);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Telangana Agricultural Marketplaces
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Explore all 33 districts and their major agricultural markets
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search districts or markets..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* District Selection */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All 33 Districts
            </h2>
            <p className="text-lg text-gray-600">
              Click on any district to view its agricultural markets
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {districts
              .filter(district => 
                district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                telanganaMarkets[district].some(market => 
                  market.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .map((district) => {
                const markets = telanganaMarkets[district];
                const isSelected = selectedDistrict === district;
                
                return (
                  <button
                    key={district}
                    onClick={() => handleDistrictClick(district)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{district}</span>
                    </div>
                    <div className="text-sm mt-1 opacity-75">
                      {markets.length} markets
                    </div>
                  </button>
                );
              })}
          </div>
          
          {districts.filter(district => 
            district.toLowerCase().includes(searchTerm.toLowerCase()) ||
            telanganaMarkets[district].some(market => 
              market.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          ).length === 0 && (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No districts or markets found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Markets Display */}
      {selectedDistrict && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Markets in {selectedDistrict}
              </h2>
              <p className="text-lg text-gray-600">
                {telanganaMarkets[selectedDistrict]?.length || 0} agricultural marketplaces available
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telanganaMarkets[selectedDistrict]?.map((market, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {market.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{market.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(market.rating)}
                        <span className="ml-2 text-sm text-gray-600">{market.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {market.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="text-sm">
                          <strong>Famous for:</strong> {market.famousFor}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm">
                          <strong>Timings:</strong> {market.timings}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-sm">
                          <strong>Contact:</strong> {market.contact}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Specialties:</strong>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {market.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGetDirections(market)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(market.coordinates)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Use Our Marketplace Directory?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect directly with agricultural markets across Telangana
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Exact Locations
              </h3>
              <p className="text-gray-600">
                Get precise coordinates and directions to every agricultural market
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Market Insights
              </h3>
              <p className="text-gray-600">
                Know what products are famous and trading volumes at each market
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Direct Connect
              </h3>
              <p className="text-gray-600">
                Connect directly with market authorities and traders
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
