import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Droplets, Thermometer, Clock, TrendingUp, AlertCircle, Leaf, Tree, Sprout } from 'lucide-react';

// Sample crop data - in production, this would come from API or JSON import


// All Telangana districts for dropdown
const TELANGANA_DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial",
  "Jayashankar Bhupalpally", "Jangaon", "Jogulamba Gadwal", "Kamareddy",
  "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad",
  "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu",
  "Nagar Kurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli",
  "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
  "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Yadadri Bhuvanagiri"
];

const ExploreCropsPage = () => {
  const [userDistrict, setUserDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState({
    short: [],
    medium: [],
    long: []
  });
  const [locationPermission, setLocationPermission] = useState('pending'); // pending, granted, denied
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  // Filter crops based on user's district
  const filterCropsByDistrict = useCallback((district) => {
    if (!district) return;

    const filtered = {
      short: [],
      medium: [],
      long: []
    };

    CROPS_DATABASE.forEach(crop => {
      // Check if crop is suitable for the selected district
      const isSuitable = crop.suitableDistricts.some(d => 
        d.toLowerCase().includes(district.toLowerCase()) || 
        district.toLowerCase().includes(d.toLowerCase())
      );

      if (isSuitable) {
        filtered[crop.category].push(crop);
      }
    });

    setFilteredCrops(filtered);
  }, []);

  // Request location permission
  const requestLocationPermission = () => {
    setIsLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use real Nominatim reverse geocoding API
          const { latitude, longitude } = position.coords;
          
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            const addr = data.address;

            // Nominatim returns county / state_district for district-level
            const rawDistrict = addr.county || addr.state_district || addr.city_district || '';

            // Normalize to match your TELANGANA_DISTRICTS list exactly
            const DISTRICT_MAP = {
              'hyderabad': 'Hyderabad',
              'ranga reddy': 'Rangareddy',
              'rangareddy': 'Rangareddy',
              'Ranga Reddy': 'Rangareddy',
              'medchal': 'Medchal-Malkajgiri',
              'medchal malkajgiri': 'Medchal-Malkajgiri',
              'medchal-malkajgiri': 'Medchal-Malkajgiri',
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
              'kumuram bheem asifabad': 'Kumuram Bheem Asifabad',
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

            const key = rawDistrict.toLowerCase().trim();
            const matchedDistrict = DISTRICT_MAP[key] || rawDistrict || 'Hyderabad';

            setUserDistrict(matchedDistrict);
            setLocationPermission('granted');
            setShowLocationPrompt(false);
            filterCropsByDistrict(matchedDistrict);
            setIsLoading(false);

            console.log('🏘️ Detected Telangana district:', matchedDistrict);
          } catch (geoError) {
            console.error('Reverse geocoding failed:', geoError);
            setUserDistrict('Hyderabad');
            setSelectedDistrict('Hyderabad');
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          setShowLocationPrompt(false);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationPermission('denied');
      setShowLocationPrompt(false);
      setIsLoading(false);
    }
  };

  // Handle manual district selection
  const handleDistrictSelection = (district) => {
    setUserDistrict(district);
    filterCropsByDistrict(district);
    setShowLocationPrompt(false);
  };

  // Filter districts based on search query
  const filteredDistricts = TELANGANA_DISTRICTS.filter(district =>
    district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate "Why this crop?" explanation
  const generateWhyExplanation = (crop, district) => {
    return `This crop is a good match for your farm because it is well-suited for ${crop.primarySoilType} found in ${district} and there is a ${crop.demandStatus} demand for it in the market.`;
  };

  // Crop Card Component
  const CropCard = ({ crop }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-green-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{crop.name}</h3>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          {crop.cropType}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Duration:</span>
          <span className="ml-2 text-gray-900">{crop.duration}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Droplets className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Water:</span>
          <span className="ml-2 text-gray-900">{crop.waterRequirement}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Thermometer className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Climate:</span>
          <span className="ml-2 text-gray-900">{crop.climateSuitability}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Why this crop?
        </h4>
        <p className="text-blue-800 text-sm leading-relaxed">
          {generateWhyExplanation(crop, userDistrict)}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {crop.importDependency === "Yes" && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
              Import Dependent
            </span>
          )}
          {crop.supplyStatus === "Very Low" && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
              Low Supply
            </span>
          )}
          {crop.demandStatus === "Very High" && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              High Demand
            </span>
          )}
        </div>
        
        <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );

  // Sector Section Component
  const SectorSection = ({ title, icon: Icon, crops, emptyMessage }) => (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Icon className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          {crops.length} crops
        </span>
      </div>
      
      {crops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map(crop => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <p className="text-yellow-800 font-medium">{emptyMessage}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location Permission Prompt */}
      {showLocationPrompt && (
        <div className="bg-blue-600 text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Find the best crops for your location
                  </h3>
                  <p className="text-blue-100">
                    To show you most suitable crops for your farm, we need to know your location. 
                    This data is used only to filter our crop database.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={requestLocationPermission}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Detecting...' : 'Use My Location'}
                </button>
                <button
                  onClick={() => setShowLocationPrompt(false)}
                  className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200"
                >
                  Search Manually
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        {!userDistrict && !showLocationPrompt && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Crops for Telangana Farmers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect crops for your farm based on soil type, climate, and market demand
            </p>
          </div>
        )}

        {/* Manual District Search */}
        {!userDistrict && !showLocationPrompt && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Select Your District
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              No problem! You can search for your district manually.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Start typing your district name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            
            {searchQuery && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredDistricts.map(district => (
                  <button
                    key={district}
                    onClick={() => handleDistrictSelection(district)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                  >
                    {district}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-lg text-gray-600">Detecting your location...</span>
            </div>
          </div>
        )}

        {/* Results Header */}
        {userDistrict && !isLoading && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-green-900">
                  Showing crops recommended for {userDistrict}
                </h2>
                <p className="text-green-800 mt-1">
                  Based on soil compatibility and market demand analysis
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Crops Display */}
        {userDistrict && !isLoading && (
          <div>
            <SectorSection
              title="🌱 Short-Term Crops (45-120 days)"
              icon={Sprout}
              crops={filteredCrops.short}
              emptyMessage="While there are no Short-Term crops perfectly suited for your area in our current database, we have great options in Medium and Long-Term crops!"
            />
            
            <SectorSection
              title="🌾 Medium-Term Crops (4-12 months)"
              icon={Leaf}
              crops={filteredCrops.medium}
              emptyMessage="While there are no Medium-Term crops perfectly suited for your area in our current database, we have great options in Short and Long-Term crops!"
            />
            
            <SectorSection
              title="🌳 Long-Term Crops (1-30 years)"
              icon={Tree}
              crops={filteredCrops.long}
              emptyMessage="While there are no Long-Term crops perfectly suited for your area in our current database, we have great options in Short and Medium-Term crops!"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCropsPage;
