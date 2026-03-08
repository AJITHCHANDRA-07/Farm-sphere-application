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
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';

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

// 📍 DISTRICT MAP - Nominatim raw value → Your exact district name
const DISTRICT_MAP: Record<string, string> = {
  'ranga reddy': 'Rangareddy',
  'rangareddy': 'Rangareddy',
  'ranga reddy district': 'Rangareddy',
  'hyderabad': 'Hyderabad',
  'hyderabad district': 'Hyderabad',
  'medchal malkajgiri': 'Medchal-Malkajgiri',
  'medchal-malkajgiri': 'Medchal-Malkajgiri',
  'medchal': 'Medchal-Malkajgiri',
  'nalgonda': 'Nalgonda',
  'nalgonda district': 'Nalgonda',
  'karimnagar': 'Karimnagar',
  'karimnagar district': 'Karimnagar',
  'warangal': 'Warangal',
  'warangal district': 'Warangal',
  'nizamabad': 'Nizamabad',
  'nizamabad district': 'Nizamabad',
  'khammam': 'Khammam',
  'khammam district': 'Khammam',
  'adilabad': 'Adilabad',
  'adilabad district': 'Adilabad',
  'jagtial': 'Jagtial',
  'jagtial district': 'Jagtial',
  'jangaon': 'Jangaon',
  'jangaon district': 'Jangaon',
  'jayashankar bhupalpally': 'Jayashankar Bhupalpally',
  'jayashankar': 'Jayashankar Bhupalpally',
  'bhupalpally': 'Jayashankar Bhupalpally',
  'jogulamba gadwal': 'Jogulamba Gadwal',
  'gadwal': 'Jogulamba Gadwal',
  'jogulamba': 'Jogulamba Gadwal',
  'kamareddy': 'Kamareddy',
  'kamareddy district': 'Kamareddy',
  'kumuram bheem asifabad': 'Kumuram Bheem Asifabad',
  'asifabad': 'Kumuram Bheem Asifabad',
  'kumuram bheem': 'Kumuram Bheem Asifabad',
  'mahabubabad': 'Mahabubabad',
  'mahabubabad district': 'Mahabubabad',
  'mahabubnagar': 'Mahabubnagar',
  'mahabubnagar district': 'Mahabubnagar',
  'mancherial': 'Mancherial',
  'mancherial district': 'Mancherial',
  'medak': 'Medak',
  'medak district': 'Medak',
  'mulugu': 'Mulugu',
  'mulugu district': 'Mulugu',
  'nagarkurnool': 'Nagarkurnool',
  'nagar kurnool': 'Nagarkurnool',
  'nagarkurnool district': 'Nagarkurnool',
  'narayanpet': 'Narayanpet',
  'narayanpet district': 'Narayanpet',
  'nirmal': 'Nirmal',
  'nirmal district': 'Nirmal',
  'peddapalli': 'Peddapalli',
  'peddapalli district': 'Peddapalli',
  'rajanna sircilla': 'Rajanna Sircilla',
  'sircilla': 'Rajanna Sircilla',
  'rajanna': 'Rajanna Sircilla',
  'sangareddy': 'Sangareddy',
  'sangareddy district': 'Sangareddy',
  'siddipet': 'Siddipet',
  'siddipet district': 'Siddipet',
  'suryapet': 'Suryapet',
  'suryapet district': 'Suryapet',
  'vikarabad': 'Vikarabad',
  'vikarabad district': 'Vikarabad',
  'wanaparthy': 'Wanaparthy',
  'wanaparthy district': 'Wanaparthy',
  'bhadradri kothagudem': 'Bhadradri Kothagudem',
  'kothagudem': 'Bhadradri Kothagudem',
  'bhadradri': 'Bhadradri Kothagudem',
  'hanamkonda': 'Hanamkonda',
  'hanamkonda district': 'Hanamkonda',
  'hanumakonda': 'Hanamkonda',
  'yadadri bhuvanagiri': 'Yadadri Bhuvanagiri',
  'yadadri': 'Yadadri Bhuvanagiri',
  'bhuvanagiri': 'Yadadri Bhuvanagiri',
};

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
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
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

  // ============================================================
  // 📍 REAL LOCATION DETECTION — NO RANDOM, NO FAKE
  // ============================================================
  const getUserLocation = useCallback(async () => {
    console.log('🚀 Starting real location detection...');
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      console.log('⚠️ Geolocation not supported by this browser');
      setDetectedDistrict('Hyderabad');
      setSelectedDistrict('Hyderabad');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 GPS coordinates received:', { latitude, longitude });

        setUserLocation({ lat: latitude, lon: longitude });

        try {
          // 🌐 Call Nominatim — Free, No API Key needed
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );

          const data = await response.json();
          const addr = data.address;

          console.log('🗺️ Nominatim full address:', addr);
          console.log('state_district:', addr.state_district);
          console.log('county:', addr.county);

          // ✅ state_district FIRST — this is always the correct district level
          const rawDistrict = addr.state_district || addr.county || addr.city_district || '';
          console.log('📌 Raw district from Nominatim:', rawDistrict);

          // ✅ Match to your exact TELANGANA_DISTRICTS list
          const key = rawDistrict.toLowerCase().trim();
          const matchedDistrict = DISTRICT_MAP[key] || rawDistrict || 'Hyderabad';

          console.log('✅ Final matched district:', matchedDistrict);

          setDetectedDistrict(matchedDistrict);
          setSelectedDistrict(matchedDistrict);
          setLocationLoading(false);

        } catch (fetchError) {
          console.error('❌ Nominatim reverse geocoding failed:', fetchError);
          // Fallback only if Nominatim call itself fails (network issue etc.)
          setDetectedDistrict('Hyderabad');
          setSelectedDistrict('Hyderabad');
          setLocationLoading(false);
        }
      },
      (error) => {
        // GPS permission denied or timeout
        console.error('❌ Geolocation error:', error.message);
        setLocationLoading(false);
        setDetectedDistrict('Hyderabad');
        setSelectedDistrict('Hyderabad');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // 📍 REQUEST LOCATION ON COMPONENT MOUNT
  useEffect(() => {
    const timer = setTimeout(() => {
      getUserLocation();
    }, 500);
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

      const { data: shortMain } = await supabase.from('Short_Term_Crops').select('*');
      const { data: mediumMain } = await supabase.from('Medium_Term_Crops').select('*');
      const { data: longMain } = await supabase.from('Long_Term_Crops').select('*');
      const { data: shortPopup } = await supabase.from('S_T_C_PopUI1').select('*');
      const { data: mediumPopup } = await supabase.from('M_T_C_PopUI1').select('*');
      const { data: longPopup } = await supabase.from('L_T_C_PopUI1').select('*');
      const { data: shortExtraPopup } = await supabase.from('S_T_C_PopUp1').select('*');
      const { data: mediumExtraPopup } = await supabase.from('M_T_C_PopUp1').select('*');
      const { data: longExtraPopup } = await supabase.from('L_T_C_PopUp1').select('*');
      const { data: shortURLs } = await supabase.from('S_T_C_URL').select('*');
      const { data: mediumURLs } = await supabase.from('M_T_C_URL').select('*');
      const { data: longURLs } = await supabase.from('L_T_C_URL1').select('*');

      const mergeCropData = (mainData: any[], popupData: any[], extraPopupData: any[], urlData: any[], category: 'short' | 'medium' | 'long'): Crop[] => {
        return mainData.map((mainCrop, index) => {
          const mainCropName = mainCrop.Crop_Name || mainCrop['Crop Name'] || `Unknown-${index}`;
          const popupCrop = popupData.find(popup => (popup.Crop_Name || popup['Crop Name']) === mainCropName);
          const extraPopupCrop = extraPopupData.find(extraPopup => (extraPopup.Crop_Name || extraPopup['Crop Name']) === mainCropName);
          const urlCrop = urlData.find(urlItem => (urlItem.Crop_Name || urlItem['Crop Name']) === mainCropName);
          const mergedCrop = { ...mainCrop, ...(popupCrop || {}), ...(extraPopupCrop || {}), ...(urlCrop || {}) };

          const popupInvestment = parseFloat(extraPopupCrop?.['Investment_Per_Acre'] || popupCrop?.['Investment_Per_Acre'] || mainCrop['Investment_Per_Acre'] || '50000');
          const popupYield = parseFloat(extraPopupCrop?.['Expected_Yield_Per_Acre'] || popupCrop?.['Expected_Yield_Per_Acre'] || mainCrop['Expected_Yield_Per_Acre'] || '2000');
          const popupPrice = parseFloat(extraPopupCrop?.['Market_Price_Per_KG'] || popupCrop?.['Market_Price_Per_KG'] || mainCrop['Market_Price_Per_KG'] || '20');
          const popupProfit = parseFloat(extraPopupCrop?.['Profit_Per_Acre'] || popupCrop?.['Profit_Per_Acre'] || mainCrop['Profit_Per_Acre'] || '40000');
          const marketDemandLevel = extraPopupCrop?.['Market_Demand_Level'] || popupCrop?.['Market_Demand_Level'] || mainCrop['Market_Demand_Level'] || 'Medium';
          const suitableDistrict = mainCrop['Suitable Telangana District'] || mainCrop['Suitable_Telangana_District'] || mainCrop.District || mainCrop.district || 'Hyderabad';
          const supplyStatus = mainCrop['Supply Status'] || mainCrop['Supply_Status'] || extraPopupCrop?.['Supply_Status'] || popupCrop?.['Supply_Status'] || '';
          const riskFactors = mainCrop['Risk Factors'] || mainCrop['Risk_Factors'] || extraPopupCrop?.['Risk_Factors'] || popupCrop?.['Risk_Factors'] || '';
          const cropDuration = mainCrop['Crop Duration'] || mainCrop['Crop_Duration'] || extraPopupCrop?.['Crop_Duration'] || popupCrop?.['Crop_Duration'] || '';
          const cultivationSteps = extraPopupCrop?.['Cultivation_Steps'] || popupCrop?.['Cultivation_Steps'] || mainCrop['Cultivation_Steps'] || mainCrop['Cultivation Steps'] || '';
          const bestSeason = extraPopupCrop?.['Best_Season'] || popupCrop?.['Best_Season'] || mainCrop['Best_Season'] || mainCrop['Best Season'] || '';
          const waterAndIrrigation = extraPopupCrop?.['Water_And_Irrigation'] || popupCrop?.['Water_And_Irrigation'] || mainCrop['Water_And_Irrigation'] || mainCrop['Water And Irrigation'] || '';
          const pestAndDiseaseManagement = extraPopupCrop?.['Pest_And_Disease_Management'] || popupCrop?.['Pest_And_Disease_Management'] || mainCrop['Pest_And_Disease_Management'] || mainCrop['Pest And Disease Management'] || '';
          const harvestInformation = extraPopupCrop?.['Harvest_Information'] || popupCrop?.['Harvest_Information'] || mainCrop['Harvest_Information'] || mainCrop['Harvest Information'] || '';
          const primarySoilType = mainCrop['Primary Soil Type Required'] || '';
          const waterRequirement = mainCrop['Water Requirement'] || mainCrop['Water_Requirement'] || extraPopupCrop?.['Water_Requirement'] || popupCrop?.['Water_Requirement'] || '';
          const climateSuitability = mainCrop['Climate Suitability'] || mainCrop['Climate_Suitability'] || extraPopupCrop?.['Climate_Suitability'] || popupCrop?.['Climate_Suitability'] || '';
          const irrigationCompatibility = mainCrop['Irrigation Compatibility'] || mainCrop['Irrigation_Compatibility'] || extraPopupCrop?.['Irrigation_Compatibility'] || popupCrop?.['Irrigation_Compatibility'] || '';
          const landAreaSuitability = mainCrop['Land Area Suitability'] || mainCrop['Land_Area_Suitability'] || extraPopupCrop?.['Land_Area_Suitability'] || popupCrop?.['Land_Area_Suitability'] || '';
          const mitigationStrategies = mainCrop['Mitigation Strategies'] || mainCrop['Mitigation_Strategies'] || extraPopupCrop?.['Mitigation_Strategies'] || popupCrop?.['Mitigation_Strategies'] || '';
          const cropType = mainCrop['Crop Type'] || mainCrop['Crop_Type'] || extraPopupCrop?.['Crop_Type'] || popupCrop?.['Crop_Type'] || '';
          const suitableDistrictFromTable = mainCrop['Suitable Telangana district'] || mainCrop['Suitable Telangana District'] || mainCrop['Suitable District'] || mainCrop['Suitable_District'] || extraPopupCrop?.['Suitable_District'] || popupCrop?.['Suitable_District'] || '';
          const roiCalculator = extraPopupCrop?.['ROI_Calculator'] || popupCrop?.['ROI_Calculator'] || mainCrop['ROI_Calculator'] || 'Not specified';
          const costBreakdown = extraPopupCrop?.['Cost_Breakdown_Per_Acre'] || popupCrop?.['Cost_Breakdown_Per_Acre'] || mainCrop['Cost Breakdown'] || mainCrop['Cost_Breakdown'] || '';
          const priceRange = extraPopupCrop?.['Price_Range_Per_KG'] || popupCrop?.['Price_Range_Per_KG'] || mainCrop['Price Range'] || mainCrop['Price_Range'] || '';
          const yieldRange = extraPopupCrop?.['Yield_Range_Per_Acre'] || popupCrop?.['Yield_Range_Per_Acre'] || mainCrop['Yield Range'] || mainCrop['Yield_Range'] || '';
          const breakEvenTime = extraPopupCrop?.['Break_Even_Time'] || popupCrop?.['Break_Even_Time'] || mainCrop['Break Even Time'] || mainCrop['Break_Even_Time'] || '30';

          const actualInvestment = popupInvestment;
          const actualProfit = popupProfit;
          let roiPercentage = actualInvestment > 0 ? (actualProfit / actualInvestment) * 100 : 30;
          let baseRoi = roiPercentage * (category === 'short' ? 1.1 : category === 'medium' ? 1.2 : 1.3);
          baseRoi = Math.max(0, baseRoi);

          const landAreaAcres = mainCrop['Land Area (acres)'] || '1';
          const investmentCostPerAcre = parseFloat(mainCrop['Investment Cost (₹/acre)'] || '0');
          const expectedYieldPerAcre = parseFloat(mainCrop['Expected Yield (kg/acre)'] || '0');
          const marketPricePerKg = parseFloat(mainCrop['Market Price (₹/kg)'] || '0');
          const totalInvestment = parseFloat(mainCrop['Total Investment'] || '0');
          const totalRevenue = parseFloat(mainCrop['Total Revenue'] || '0');
          const netProfit = parseFloat(mainCrop['Net Profit'] || '0');

          return {
            id: mergedCrop.id || `${category}-${mainCropName}`,
            name: mainCropName,
            category,
            duration: mergedCrop.Duration || mergedCrop.duration || '90 days',
            durationDays: parseInt(mergedCrop['Duration_Days'] || mergedCrop.durationDays || '90'),
            profitPerAcre: popupProfit,
            investmentCost: popupInvestment,
            expectedYield: popupYield,
            marketPrice: popupPrice,
            waterNeeds: mergedCrop.Water_Needs || mergedCrop.waterNeeds || 'Moderate',
            demand: marketDemandLevel,
            image: mergedCrop.URL || mergedCrop.url || '/images/default-crop.jpg',
            description: mitigationStrategies,
            district: suitableDistrict,
            cultivationSteps: [cultivationSteps],
            seasonalInfo: bestSeason,
            pestManagement: [pestAndDiseaseManagement],
            harvestTimeline: [harvestInformation],
            soilTypes: [primarySoilType],
            climate: { suitability: climateSuitability },
            irrigation: waterAndIrrigation,
            fertilizerGuideline: '',
            pestsAndDiseases: pestAndDiseaseManagement,
            stages: [],
            roiDefaults: { calculator: roiCalculator },
            quickReturns: { avgROIPercent: baseRoi.toFixed(2) },
            notes: '',
            costBreakdown,
            priceRange,
            yieldRange,
            breakEvenTime,
            waterRequirement,
            climateSuitability,
            irrigationCompatibility,
            landAreaSuitability,
            mitigationStrategies,
            cropType,
            suitableDistrict: suitableDistrictFromTable,
            supplyStatus,
            originalDemandStatus: marketDemandLevel,
            riskFactors,
            cropDuration,
            primarySoilType,
            landAreaAcres,
            investmentCostPerAcre,
            expectedYieldPerAcre,
            marketPricePerKg,
            totalInvestment,
            totalRevenue,
            netProfit,
            roiPercentage,
          };
        });
      };

      if (shortMain) setShortTermCrops(mergeCropData(shortMain, shortPopup || [], shortExtraPopup || [], shortURLs || [], 'short'));
      if (mediumMain) setMediumTermCrops(mergeCropData(mediumMain, mediumPopup || [], mediumExtraPopup || [], mediumURLs || [], 'medium'));
      if (longMain) setLongTermCrops(mergeCropData(longMain, longPopup || [], longExtraPopup || [], longURLs || [], 'long'));

    } catch (error) {
      console.error('❌ Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCropsFromDatabase();
  }, []);

  // 🔹 DYNAMIC FILTERING
  const filterCrops = useCallback((crops: Crop[], searchTerm: string) => {
    let filtered = [...crops];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchLower) ||
        crop.description.toLowerCase().includes(searchLower) ||
        crop.district.toLowerCase().includes(searchLower)
      );
    }

    if (detectedDistrict && detectedDistrict !== '') {
      filtered = filtered.filter(crop =>
        crop.district.toLowerCase().includes(detectedDistrict.toLowerCase()) ||
        crop.suitableDistrict?.toLowerCase().includes(detectedDistrict.toLowerCase())
      );
    }

    if (waterFilter !== 'all') {
      filtered = filtered.filter(crop => crop.waterNeeds.toLowerCase() === waterFilter.toLowerCase());
    }

    if (demandFilter !== 'all') {
      filtered = filtered.filter(crop => crop.demand.toLowerCase() === demandFilter.toLowerCase());
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'profit': comparison = a.profitPerAcre - b.profitPerAcre; break;
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'duration': comparison = a.durationDays - b.durationDays; break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [detectedDistrict, waterFilter, demandFilter, sortBy, sortOrder]);

  const getFilteredShortCrops = useCallback(() => filterCrops(shortTermCrops, shortSearchTerm), [filterCrops, shortTermCrops, shortSearchTerm]);
  const getFilteredMediumCrops = useCallback(() => filterCrops(mediumTermCrops, mediumSearchTerm), [filterCrops, mediumTermCrops, mediumSearchTerm]);
  const getFilteredLongCrops = useCallback(() => filterCrops(longTermCrops, longSearchTerm), [filterCrops, longTermCrops, longSearchTerm]);

  const getFilteredCropCount = useCallback((category: 'short' | 'medium' | 'long') => {
    switch (category) {
      case 'short': return getFilteredShortCrops().length;
      case 'medium': return getFilteredMediumCrops().length;
      case 'long': return getFilteredLongCrops().length;
      default: return 0;
    }
  }, [getFilteredShortCrops, getFilteredMediumCrops, getFilteredLongCrops]);

  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShortSearchTerm(value);
    setMediumSearchTerm(value);
    setLongSearchTerm(value);
  };

  const retryLocationDetection = () => {
    setUserLocation(null);
    setDetectedDistrict('');
    setLocationError('');
    setLocationLoading(true);
    getUserLocation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-3">{t('exploreCrops.hero.title')}</h1>
          <p className="text-lg text-gray-600 mb-2">
            {t('exploreCrops.hero.subtitle')}
          </p>
        </div>

        {/* 📍 DISTRICT LABEL */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 border border-green-300 rounded-lg shadow-sm">
            {locationLoading ? (
              <div className="flex items-center gap-2 text-green-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Detecting your district...</span>
              </div>
            ) : detectedDistrict ? (
              <div className="flex items-center gap-2 text-green-700">
                <MapPin className="h-5 w-5" />
                <span className="font-medium text-lg">{detectedDistrict}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Hyderabad</span>
              </div>
            )}
          </div>
        </div>

        {/* 🔍 SEARCH AND FILTER CONTROLS */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-medium text-gray-700">Sort Order:</span>
            <Button variant={sortOrder === 'desc' ? 'default' : 'outline'} size="sm" onClick={() => setSortOrder('desc')}>
              <ArrowUpDown className="h-4 w-4 mr-1" /> High to Low
            </Button>
            <Button variant={sortOrder === 'asc' ? 'default' : 'outline'} size="sm" onClick={() => setSortOrder('asc')}>
              <ArrowUpDown className="h-4 w-4 mr-1" /> Low to High
            </Button>
          </div>
        </div>

        {/* 🔹 CROP TABS */}
        <Tabs value={activeTab} onValueChange={(value: 'short' | 'medium' | 'long') => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="short" className="flex items-center gap-2">
              🌱 Short-Term <Badge variant="secondary">{getFilteredCropCount('short')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2">
              🌿 Medium-Term <Badge variant="secondary">{getFilteredCropCount('medium')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2">
              🌳 Long-Term <Badge variant="secondary">{getFilteredCropCount('long')}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* SHORT TERM */}
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
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{crop.name}</h3>
                            <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">📍 {crop.district}</p>
                          </div>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">{crop.duration}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{crop.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">💰 ₹{(crop.investmentCost / 1000).toFixed(0)}K/acre</Badge>
                          <Badge variant="outline" className="text-xs">💧 {crop.waterNeeds}</Badge>
                          <Badge variant="outline" className="text-xs">📈 {crop.demand} Demand</Badge>
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

          {/* MEDIUM TERM */}
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
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{crop.name}</h3>
                            <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">📍 {crop.district}</p>
                          </div>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">{crop.duration}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{crop.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">💰 ₹{(crop.investmentCost / 1000).toFixed(0)}K/acre</Badge>
                          <Badge variant="outline" className="text-xs">💧 {crop.waterNeeds}</Badge>
                          <Badge variant="outline" className="text-xs">📈 {crop.demand} Demand</Badge>
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

          {/* LONG TERM */}
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
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{crop.name}</h3>
                            <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">📍 {crop.district}</p>
                          </div>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">{crop.duration}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{crop.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">💰 ₹{(crop.investmentCost / 1000).toFixed(0)}K/acre</Badge>
                          <Badge variant="outline" className="text-xs">💧 {crop.waterNeeds}</Badge>
                          <Badge variant="outline" className="text-xs">📈 {crop.demand} Demand</Badge>
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