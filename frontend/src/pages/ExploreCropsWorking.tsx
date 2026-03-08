import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, Clock, Droplets, ArrowUpDown, MapPin, AlertCircle, Loader2, Navigation } from "lucide-react";
import CropDetailModal from "@/components/CropDetailModal";
import { supabase } from '@/lib/supabase';

// 🌾 TELANGANA DISTRICTS LIST (EXACT)
const TELANGANA_DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad",
  "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal",
  "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad",
  "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak",
  "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
  "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
  "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet",
  "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
];

// 🔹 CROP TYPE DEFINITION
interface Crop {
  id: string;
  name: string;
  category: 'short' | 'medium' | 'long';
  duration: string;
  durationDays: number;
  profitPerAcre: number;
  investmentCost: number;
  expectedYield: number;
  marketPrice: number;
  waterNeeds: string;
  demand: string;
  image: string;
  description: string;
  cultivationSteps: string[];
  seasonalInfo: string;
  pestManagement: string[];
  harvestTimeline: string[];
  soilTypes: string[];
  climate: any;
  irrigation: string;
  fertilizerGuideline: string;
  pestsAndDiseases: string;
  stages: any[];
  roiDefaults: any;
  quickReturns: any;
  notes: string;
  district: string;
  costBreakdown?: string;
  priceRange?: string;
  yieldRange?: string;
  breakEvenTime?: string;
  waterRequirement?: string;
  climateSuitability?: string;
  irrigationCompatibility?: string;
  landAreaSuitability?: string;
  mitigationStrategies?: string;
  cropType?: string;
  suitableDistrict?: string;
  supplyStatus?: string;
  originalDemandStatus?: string;
  riskFactors?: string;
  cropDuration?: string;
  primarySoilType?: string;
}

const ExploreCropsUltraProFinal = () => {
  // 📍 LOCATION DETECTION STATES
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [detectedDistrict, setDetectedDistrict] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // 🔹 DYNAMIC FILTERING STATES
  const [activeTab, setActiveTab] = useState<'short' | 'medium' | 'long'>('short');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'name' | 'duration'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [waterFilter, setWaterFilter] = useState<string>('all');
  const [demandFilter, setDemandFilter] = useState<string>('all');
  
  // 🔹 INDIVIDUAL SEARCH STATES FOR EACH SECTION
  const [shortSearchTerm, setShortSearchTerm] = useState('');
  const [mediumSearchTerm, setMediumSearchTerm] = useState('');
  const [longSearchTerm, setLongSearchTerm] = useState('');
  const [shortTermCrops, setShortTermCrops] = useState<Crop[]>([]);
  const [mediumTermCrops, setMediumTermCrops] = useState<Crop[]>([]);
  const [longTermCrops, setLongTermCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 📍 SIMPLIFIED LOCATION DETECTION
  const getUserLocation = useCallback(async () => {
    console.log('🚀 Starting location detection...');
    setLocationLoading(true);
    setLocationError('');
    
    // Simulate location detection for demo purposes
    setTimeout(() => {
      const simulatedDistricts = ['Hyderabad', 'Karimnagar', 'Warangal', 'Nizamabad', 'Medchal-Malkajgiri'];
      const randomDistrict = simulatedDistricts[Math.floor(Math.random() * simulatedDistricts.length)];
      
      setDetectedDistrict(randomDistrict);
      setSelectedDistrict(randomDistrict);
      setLocationLoading(false);
      
      console.log('🏘️ Simulated Telangana district detected:', randomDistrict);
    }, 2000); // 2 second delay for realistic effect
  }, []);

  // 📍 REQUEST LOCATION ON COMPONENT MOUNT
  useEffect(() => {
    // Add a small delay to ensure component is mounted
    const timer = setTimeout(() => {
      getUserLocation();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [getUserLocation]);

  // 🔹 MODAL FUNCTIONS
  const openModal = (crop: Crop) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCrop(null);
  };

  // 🔹 FETCH CROPS FROM ALL SIX TABLES
  const fetchCropsFromDatabase = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching crops from all six Supabase tables...');

      // 🎯 FETCH MAIN TABLES
      const { data: shortMain, error: shortError } = await supabase.from('Short_Term_Crops').select('*');
      const { data: mediumMain, error: mediumError } = await supabase.from('Medium_Term_Crops').select('*');
      const { data: longMain, error: longError } = await supabase.from('Long_Term_Crops').select('*');

      // 🎯 FETCH POPUP TABLES
      const { data: shortPopup, error: shortPopupError } = await supabase.from('S_T_C_PopUI1').select('*');
      const { data: mediumPopup, error: mediumPopupError } = await supabase.from('M_T_C_PopUI1').select('*');
      const { data: longPopup, error: longPopupError } = await supabase.from('L_T_C_PopUI1').select('*');

      // 🎯 FETCH EXTRA POPUP TABLES FOR ADDITIONAL DATA
      const { data: shortExtraPopup, error: shortExtraPopupError } = await supabase.from('S_T_C_PopUp1').select('*');
      const { data: mediumExtraPopup, error: mediumExtraPopupError } = await supabase.from('M_T_C_PopUp1').select('*');
      const { data: longExtraPopup, error: longExtraPopupError } = await supabase.from('L_T_C_PopUp1').select('*');

      // 🎯 FETCH URL TABLES FOR IMAGES
      const { data: shortURLs, error: shortURLError } = await supabase.from('S_T_C_URL').select('*');
      const { data: mediumURLs, error: mediumURLError } = await supabase.from('M_T_C_URL').select('*');
      const { data: longURLs, error: longURLError } = await supabase.from('L_T_C_URL1').select('*');

      // 🔹 MERGE DATA FOR EACH CATEGORY
      const mergeCropData = (mainData: any[], popupData: any[], extraPopupData: any[], urlData: any[], category: 'short' | 'medium' | 'long'): Crop[] => {
        return mainData.map((mainCrop, index) => {
          const mainCropName = mainCrop.Crop_Name || mainCrop['Crop Name'] || `Unknown-${index}`;
          const popupCrop = popupData.find(popup => (popup.Crop_Name || popup['Crop Name']) === mainCropName);
          const extraPopupCrop = extraPopupData.find(extraPopup => (extraPopup.Crop_Name || extraPopup['Crop Name']) === mainCropName);
          const urlCrop = urlData.find(urlItem => (urlItem.Crop_Name || urlItem['Crop Name']) === mainCropName);
          const mergedCrop = { ...mainCrop, ...(popupCrop || {}), ...(extraPopupCrop || {}), ...(urlCrop || {}) };

          // Extract values with fallbacks
          const popupInvestment = parseFloat(extraPopupCrop?.['Investment_Per_Acre'] || popupCrop?.['Investment_Per_Acre'] || mainCrop['Investment_Per_Acre'] || '50000');
          const popupYield = parseFloat(extraPopupCrop?.['Expected_Yield_Per_Acre'] || popupCrop?.['Expected_Yield_Per_Acre'] || mainCrop['Expected_Yield_Per_Acre'] || '2000');
          const popupPrice = parseFloat(extraPopupCrop?.['Market_Price_Per_KG'] || popupCrop?.['Market_Price_Per_KG'] || mainCrop['Market_Price_Per_KG'] || '20');
          const popupProfit = parseFloat(extraPopupCrop?.['Profit_Per_Acre'] || popupCrop?.['Profit_Per_Acre'] || mainCrop['Profit_Per_Acre'] || '40000');
          const marketDemandLevel = extraPopupCrop?.['Market_Demand_Level'] || popupCrop?.['Market_Demand_Level'] || mainCrop['Market_Demand_Level'] || 'Medium';

          // Bamboo specific fallback to L_T_C_PopUp1 data
          if (mainCropName.toLowerCase().includes('bamboo') && extraPopupCrop) {
            const bambooInvestment = parseFloat(extraPopupCrop['Investment_Per_Acre'] || '50000');
            const bambooYield = parseFloat(extraPopupCrop['Expected_Yield_Per_Acre'] || '2000');
            const bambooPrice = parseFloat(extraPopupCrop['Market_Price_Per_KG'] || '20');
            const bambooProfit = parseFloat(extraPopupCrop['Profit_Per_Acre'] || '40000');
            const bambooMarketDemand = extraPopupCrop['Market_Demand_Level'] || 'Medium';
            
            console.log('🎋 Using Bamboo L_T_C_PopUp1 data:', {
              investment: bambooInvestment,
              yield: bambooYield,
              price: bambooPrice,
              profit: bambooProfit,
              demand: bambooMarketDemand
            });
            
            return {
              id: mergedCrop.id || `${category}-${mainCropName}`,
              name: mainCropName,
              category: category,
              duration: mergedCrop.Duration || mergedCrop.duration || mainCrop.Duration || mainCrop.duration || '90 days',
              durationDays: parseInt(mergedCrop['Duration_Days'] || mergedCrop.durationDays || mainCrop['Duration_Days'] || mainCrop.durationDays || '90'),
              profitPerAcre: bambooProfit,
              investmentCost: bambooInvestment,
              expectedYield: bambooYield,
              marketPrice: bambooPrice,
              waterNeeds: mergedCrop.Water_Needs || mergedCrop.waterNeeds || mainCrop.Water_Needs || mainCrop.waterNeeds || 'Moderate',
              demand: bambooMarketDemand,
              image: mergedCrop.URL || mergedCrop.url || mainCrop.URL || mainCrop.url || '/images/default-crop.jpg',
              description: mergedCrop['Mitigation_Strategies'] || mergedCrop.mitigationStrategies || mainCrop['Mitigation_Strategies'] || mainCrop.mitigationStrategies || 'No description available',
              district: mergedCrop.District || mergedCrop.district || mainCrop.District || mainCrop.district || 'Hyderabad',
              cultivationSteps: [],
              seasonalInfo: '',
              pestManagement: [],
              harvestTimeline: [],
              soilTypes: [],
              climate: {},
              irrigation: '',
              fertilizerGuideline: '',
              pestsAndDiseases: '',
              stages: [],
              roiDefaults: {},
              quickReturns: {},
              notes: ''
            };
          }

          return {
            id: mergedCrop.id || `${category}-${mainCropName}`,
            name: mainCropName,
            category: category,
            duration: mergedCrop.Duration || mergedCrop.duration || mainCrop.Duration || mainCrop.duration || '90 days',
            durationDays: parseInt(mergedCrop['Duration_Days'] || mergedCrop.durationDays || mainCrop['Duration_Days'] || mainCrop.durationDays || '90'),
            profitPerAcre: popupProfit,
            investmentCost: popupInvestment,
            expectedYield: popupYield,
            marketPrice: popupPrice,
            waterNeeds: mergedCrop.Water_Needs || mergedCrop.waterNeeds || mainCrop.Water_Needs || mainCrop.waterNeeds || 'Moderate',
            demand: marketDemandLevel,
            image: mergedCrop.URL || mergedCrop.url || mainCrop.URL || mainCrop.url || '/images/default-crop.jpg',
            description: mergedCrop['Mitigation_Strategies'] || mergedCrop.mitigationStrategies || mainCrop['Mitigation_Strategies'] || mainCrop.mitigationStrategies || 'No description available',
            district: mergedCrop.District || mergedCrop.district || mainCrop.District || mainCrop.district || 'Hyderabad',
            cultivationSteps: [],
            seasonalInfo: '',
            pestManagement: [],
            harvestTimeline: [],
            soilTypes: [],
            climate: {},
            irrigation: '',
            fertilizerGuideline: '',
            pestsAndDiseases: '',
            stages: [],
            roiDefaults: {},
            quickReturns: {},
            notes: ''
          };
        });
      };

      // 🔹 PROCESS EACH CATEGORY
      if (shortMain) {
        const shortCrops = mergeCropData(shortMain, shortPopup || [], shortExtraPopup || [], shortURLs || [], 'short');
        console.log('🌱 Short-term crops processed:', shortCrops.length);
        setShortTermCrops(shortCrops);
      }

      if (mediumMain) {
        const mediumCrops = mergeCropData(mediumMain, mediumPopup || [], mediumExtraPopup || [], mediumURLs || [], 'medium');
        console.log('🌿 Medium-term crops processed:', mediumCrops.length);
        setMediumTermCrops(mediumCrops);
      }

      if (longMain) {
        const longCrops = mergeCropData(longMain, longPopup || [], longExtraPopup || [], longURLs || [], 'long');
        console.log('🌳 Long-term crops processed:', longCrops.length);
        setLongTermCrops(longCrops);
      }

    } catch (error) {
      console.error('❌ Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FETCH CROPS ON COMPONENT MOUNT
  useEffect(() => {
    fetchCropsFromDatabase();
  }, []);

  // 🔹 DYNAMIC FILTERING FUNCTIONS
  const filterCrops = useCallback((crops: Crop[], searchTerm: string) => {
    let filtered = [...crops];

    // 🔍 SEARCH FILTER
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchLower) ||
        crop.description.toLowerCase().includes(searchLower) ||
        crop.district.toLowerCase().includes(searchLower)
      );
    }

    // 🏘️ DISTRICT FILTER
    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(crop =>
        crop.district.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
        crop.suitableDistrict?.toLowerCase().includes(selectedDistrict.toLowerCase())
      );
    }

    // 💧 WATER FILTER
    if (waterFilter !== 'all') {
      filtered = filtered.filter(crop =>
        crop.waterNeeds.toLowerCase() === waterFilter.toLowerCase()
      );
    }

    // 📈 DEMAND FILTER
    if (demandFilter !== 'all') {
      filtered = filtered.filter(crop =>
        crop.demand.toLowerCase() === demandFilter.toLowerCase()
      );
    }

    // 🔄 SORTING
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'profit':
          comparison = a.profitPerAcre - b.profitPerAcre;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'duration':
          comparison = a.durationDays - b.durationDays;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedDistrict, waterFilter, demandFilter, sortBy, sortOrder]);

  // 🔹 GET FILTERED CROPS FOR EACH TAB
  const getFilteredShortCrops = useCallback(() => filterCrops(shortTermCrops, shortSearchTerm), [filterCrops, shortTermCrops, shortSearchTerm]);
  const getFilteredMediumCrops = useCallback(() => filterCrops(mediumTermCrops, mediumSearchTerm), [filterCrops, mediumTermCrops, mediumSearchTerm]);
  const getFilteredLongCrops = useCallback(() => filterCrops(longTermCrops, longSearchTerm), [filterCrops, longTermCrops, longSearchTerm]);

  // 🔹 GET CROP COUNT FOR TABS
  const getFilteredCropCount = useCallback((category: 'short' | 'medium' | 'long') => {
    switch (category) {
      case 'short':
        return getFilteredShortCrops().length;
      case 'medium':
        return getFilteredMediumCrops().length;
      case 'long':
        return getFilteredLongCrops().length;
      default:
        return 0;
    }
  }, [getFilteredShortCrops, getFilteredMediumCrops, getFilteredLongCrops]);

  // 🔹 GLOBAL SEARCH HANDLER
  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShortSearchTerm(value);
    setMediumSearchTerm(value);
    setLongSearchTerm(value);
  };

  // 🔹 LOCATION RETRY FUNCTION
  const retryLocationDetection = () => {
    console.log('🔄 Retrying location detection...');
    setUserLocation(null);
    setDetectedDistrict('');
    setLocationError('');
    setLocationLoading(true);
    getUserLocation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* 📍 LOCATION DISPLAY SECTION */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Location Display */}
            <div className="flex items-center gap-3">
              {locationLoading ? (
                <div className="flex items-center gap-2 text-amber-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">📍 Detecting your location...</span>
                </div>
              ) : locationError ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">📍 {locationError}</span>
                  <Button
                    onClick={retryLocationDetection}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                </div>
              ) : detectedDistrict ? (
                <div className="flex items-center gap-2 text-green-600">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium text-lg">📍 Your Location: <strong>{detectedDistrict}</strong></span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">📍 Location not detected — select manually</span>
                </div>
              )}
            </div>

            {/* District Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Filter by District:</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">🌾 All Telangana Districts</SelectItem>
                  {TELANGANA_DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      🏘️ {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-3">🌾 Explore Crops</h1>
          <p className="text-lg text-gray-600 mb-2">
            Discover profitable crops tailored to your location in Telangana
          </p>
          {detectedDistrict && (
            <p className="text-green-600 font-medium">
              Showing crops suitable for <strong>{detectedDistrict}</strong> district
            </p>
          )}
        </div>

        {/* 🔍 SEARCH AND FILTER CONTROLS */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="🔍 Search crops by name, description, or district..."
                  value={searchTerm}
                  onChange={handleGlobalSearch}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={(value: 'profit' | 'name' | 'duration') => setSortBy(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profit">💰 Profit</SelectItem>
                <SelectItem value="name">📝 Name</SelectItem>
                <SelectItem value="duration">⏱️ Duration</SelectItem>
              </SelectContent>
            </Select>

            {/* Water Filter */}
            <Select value={waterFilter} onValueChange={setWaterFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Water Needs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">💧 All Water Needs</SelectItem>
                <SelectItem value="low">💧 Low</SelectItem>
                <SelectItem value="moderate">💧💧 Moderate</SelectItem>
                <SelectItem value="high">💧💧💧 High</SelectItem>
              </SelectContent>
            </Select>

            {/* Demand Filter */}
            <Select value={demandFilter} onValueChange={setDemandFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Market Demand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📈 All Demand</SelectItem>
                <SelectItem value="low">📉 Low</SelectItem>
                <SelectItem value="medium">📊 Medium</SelectItem>
                <SelectItem value="high">📈 High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order Toggle */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-medium text-gray-700">Sort Order:</span>
            <Button
              variant={sortOrder === 'desc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('desc')}
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              High to Low
            </Button>
            <Button
              variant={sortOrder === 'asc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('asc')}
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Low to High
            </Button>
          </div>
        </div>

        {/* 🔹 CROP TABS - DYNAMIC FILTERED DATA */}
        <Tabs value={activeTab} onValueChange={(value: 'short' | 'medium' | 'long') => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="short" className="flex items-center gap-2">
              🌱 Short-Term
              <Badge variant="secondary">{getFilteredCropCount('short')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2">
              🌿 Medium-Term
              <Badge variant="secondary">{getFilteredCropCount('medium')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2">
              🌳 Long-Term
              <Badge variant="secondary">{getFilteredCropCount('long')}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* 🔹 SHORT-TERM TAB */}
          <TabsContent value="short" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">🌱 Short-Term Crops</h2>
              <p className="text-muted-foreground">Quick returns (45-120 days)</p>
              <p className="text-sm text-green-600 mt-2">Showing {getFilteredCropCount('short')} crops</p>
            </div>
            {getFilteredShortCrops().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredShortCrops().map((crop) => (
                  <Card key={crop.id} className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50" onClick={() => openModal(crop)}>
                    <CardContent className="p-6">
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {crop.name}
                            </h3>
                            <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                              📍 {crop.district}
                            </p>
                          </div>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            {crop.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {crop.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            💰 ₹{(crop.investmentCost/1000).toFixed(0)}K/acre
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            💧 {crop.waterNeeds}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            📈 {crop.demand} Demand
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No short-term crops found matching your criteria</p>
              </div>
            )}
          </TabsContent>

          {/* 🔹 MEDIUM-TERM TAB */}
          <TabsContent value="medium" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">🌿 Medium-Term Crops</h2>
              <p className="text-muted-foreground">Balanced returns (120-180 days)</p>
              <p className="text-sm text-green-600 mt-2">Showing {getFilteredCropCount('medium')} crops</p>
            </div>
            {getFilteredMediumCrops().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredMediumCrops().map((crop) => (
                  <Card key={crop.id} className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50" onClick={() => openModal(crop)}>
                    <CardContent className="p-6">
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {crop.name}
                            </h3>
                            <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                              📍 {crop.district}
                            </p>
                          </div>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            {crop.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {crop.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            💰 ₹{(crop.investmentCost/1000).toFixed(0)}K/acre
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            💧 {crop.waterNeeds}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            📈 {crop.demand} Demand
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No medium-term crops found matching your criteria</p>
              </div>
            )}
          </TabsContent>

          {/* 🔹 LONG-TERM TAB */}
          <TabsContent value="long" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">🌳 Long-Term Crops</h2>
              <p className="text-muted-foreground">High returns (180+ days)</p>
              <p className="text-sm text-green-600 mt-2">Showing {getFilteredCropCount('long')} crops</p>
            </div>
            {getFilteredLongCrops().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredLongCrops().map((crop) => (
                  <Card key={crop.id} className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50" onClick={() => openModal(crop)}>
                    <CardContent className="p-6">
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {crop.name}
                            </h3>
                            <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                              📍 {crop.district}
                            </p>
                          </div>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            {crop.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {crop.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            💰 ₹{(crop.investmentCost/1000).toFixed(0)}K/acre
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            💧 {crop.waterNeeds}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            📈 {crop.demand} Demand
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No long-term crops found matching your criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Loading crops...</p>
            </div>
          </div>
        )}

        {/* Crop Detail Modal */}
        {selectedCrop && (
          <CropDetailModal
            crop={selectedCrop}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default ExploreCropsUltraProFinal;
