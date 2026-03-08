import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, TrendingUp, Clock, Droplets, ArrowUpDown, MapPin, AlertCircle, Loader2, DollarSign, Building, Shield, FileText, Calculator } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/translations';

interface InvestmentData {
  Id: number;
  Name: string;
  Investment: string;
  "Govt. Subsidy": string;
  "Land Required": string;
  Category: string;
  "Risk Level": string;
  "Application Procedure & Website": string;
  "Complete Plan": string;
  "Annual ROI & Payback": string;
  Profit: string;
  investment_image?: string;
}

interface InvestmentImageData {
  id?: number;
  Name?: string;
  'Investment Name'?: string;
  investment_name?: string;
  URL?: string;
  url?: string;
  Url?: string;
  Image?: string;
  image?: string;
  investment_image?: string;
}

const InvestmentsPage = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  const [investments, setInvestments] = useState<InvestmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'investment' | 'profit' | 'risk'>('investment');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic ROI Calculator States
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [expectedROI, setExpectedROI] = useState(25);
  const [timePeriod, setTimePeriod] = useState(3);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      // 🎯 FETCH INVESTMENTS DATA
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('Investments')
        .select('*')
        .order('Id', { ascending: true });

      if (investmentsError) {
        console.error('Error fetching investments:', investmentsError);
        setLoading(false);
        return;
      }

      // 🎯 FETCH INVESTMENT IMAGE URLS FROM Investments_URL TABLE
      const { data: investmentImages, error: imagesError } = await supabase
        .from('Investments_URL')
        .select('*');

      if (imagesError) {
        console.error('Error fetching investment images:', imagesError);
      } else {
        console.log('🖼️ Investment images fetched:', investmentImages?.length || 0);
        console.log('🔍 Investment image columns:', investmentImages?.[0] ? Object.keys(investmentImages[0]) : []);
        console.log('📝 Sample investment image data:', investmentImages?.[0]);
        
        // 🔹 DEBUG ALL INVESTMENT IMAGES
        if (investmentImages && investmentImages.length > 0) {
          console.log('🔍 ALL INVESTMENT IMAGES:');
          investmentImages.forEach((img, index) => {
            console.log(`🖼️ IMAGE ${index + 1}:`, {
              'Name': img.Name,
              'Investment Name': img['Investment Name'],
              'investment_name': img.investment_name,
              'URL': img.URL,
              'url': img.url,
              'Image': img.Image,
              'image': img.image
            });
          });
        }
      }

      // 🎯 MERGE INVESTMENT DATA WITH IMAGE URLS
      const mergedInvestments = (investmentsData || []).map(investment => {
        // Find corresponding image for this investment
        const investmentImage = investmentImages?.find(img => {
          const imgInvestmentName = img.Name || img['Investment Name'] || img.investment_name;
          const investmentName = investment.Name;
          return imgInvestmentName === investmentName;
        });

        // 🔹 DEBUG MATCHING PROCESS
        console.log(`🔍 Matching investment: "${investment.Name}"`);
        if (investmentImage) {
          console.log(`✅ Found image for ${investment.Name}:`, investmentImage);
        } else {
          console.log(`❌ No image found for ${investment.Name}`);
          // Show available investment names for debugging
          const availableInvestmentNames = investmentImages?.map(img => 
            img.Name || img['Investment Name'] || img.investment_name
          ).filter(Boolean);
          console.log(`📍 Available investment names in images table:`, availableInvestmentNames);
        }

        // Extract image URL with multiple fallback column names
        const imageUrl = investmentImage?.URL || 
                         investmentImage?.url || 
                         investmentImage?.Url || 
                         investmentImage?.Image || 
                         investmentImage?.image || 
                         investmentImage?.investment_image;

        console.log(`🖼️ ${investment.Name} - Image URL: "${imageUrl || 'No image found'}"`);

        return {
          ...investment,
          investment_image: imageUrl
        };
      });

      setInvestments(mergedInvestments);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const openModal = (investment: InvestmentData) => {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
    
    // Set ROI calculator values based on investment data
    const roiMatch = investment["Annual ROI & Payback"].match(/(\d+)-?(\d+)?%/);
    const roiValue = roiMatch ? (parseInt(roiMatch[1]) + parseInt(roiMatch[2] || roiMatch[1])) / 2 : 25;
    
    const timeMatch = investment["Annual ROI & Payback"].match(/(\d+\.?\d*)-(\d+\.?\d*)?\s*yrs/);
    const timeValue = timeMatch ? (parseFloat(timeMatch[1]) + parseFloat(timeMatch[2] || timeMatch[1])) / 2 : 3;
    
    const investmentMatch = investment.Investment.match(/₹([\d,]+)-?([\d,]+)?\s*(Lakhs|Crore)/);
    const minInvestment = investmentMatch ? parseInt(investmentMatch[1].replace(/,/g, '')) : 10;
    const unit = investmentMatch ? investmentMatch[3] : 'Lakhs';
    const investmentInRupees = unit === 'Crore' ? minInvestment * 10000000 : minInvestment * 100000;
    
    setExpectedROI(roiValue);
    setTimePeriod(timeValue);
    setInvestmentAmount(investmentInRupees);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvestment(null);
  };

  const calculateROI = () => {
    const totalInvestment = investmentAmount;
    const annualReturn = (totalInvestment * expectedROI) / 100;
    const totalReturns = annualReturn * timePeriod;
    const netProfit = totalReturns - totalInvestment;
    const roiPercentage = ((netProfit / totalInvestment) * 100).toFixed(2);
    
    return {
      totalInvestment,
      annualReturn,
      totalReturns,
      netProfit,
      roiPercentage
    };
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-600 hover:bg-green-700';
      case 'medium': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'high': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'production': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'storage': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAndSortedInvestments = investments
    .filter(investment => {
      const matchesSearch = investment.Name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'all' || investment["Risk Level"].toLowerCase() === riskFilter;
      const matchesCategory = categoryFilter === 'all' || investment.Category.toLowerCase() === categoryFilter;
      return matchesSearch && matchesRisk && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'investment':
          aValue = parseInt(a.Investment.match(/₹([\d,]+)/)?.[1].replace(/,/g, '') || '0');
          bValue = parseInt(b.Investment.match(/₹([\d,]+)/)?.[1].replace(/,/g, '') || '0');
          break;
        case 'profit':
          aValue = parseInt(a.Profit.match(/₹([\d,]+)/)?.[1].replace(/,/g, '') || '0');
          bValue = parseInt(b.Profit.match(/₹([\d,]+)/)?.[1].replace(/,/g, '') || '0');
          break;
        case 'risk':
          aValue = a["Risk Level"] === 'Low' ? 1 : a["Risk Level"] === 'Medium' ? 2 : 3;
          bValue = b["Risk Level"] === 'Low' ? 1 : b["Risk Level"] === 'Medium' ? 2 : 3;
          break;
        default:
          aValue = parseInt(a.Investment.match(/₹([\d,]+)/)?.[1].replace(/,/g, '') || '0');
          bValue = parseInt(b.Investment.match(/₹([\d,]+)/)?.[1].replace(/,/g, '') || '0');
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading investments...</p>
        </div>
      </div>
    );
  }

  // 🔹 DEBUG: Show first few investments with image data
  console.log('🔍 DEBUG - First 3 investments with images:');
  investments.slice(0, 3).forEach((investment, index) => {
    console.log(`📊 Investment ${index + 1}:`, {
      'name': investment.Name,
      'has_image': !!investment.investment_image,
      'image_url': investment.investment_image,
      'image_length': investment.investment_image?.length || 0
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-4 tracking-wide">
              💰 {t('investments.title')}
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              {t('investments.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search investments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="investment">Sort by Investment</option>
              <option value="profit">Sort by Profit</option>
              <option value="risk">Sort by Risk Level</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="production">Production</option>
              <option value="storage">Storage</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>

        {/* Investment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedInvestments.map((investment) => (
            <Card 
              key={investment.Id} 
              className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
              onClick={() => openModal(investment)}
            >
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted relative">
                  {investment.investment_image ? (
                    <img 
                      src={investment.investment_image}
                      alt={investment.Name}
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        console.log(`✅ Successfully loaded investment image for ${investment.Name}:`, investment.investment_image);
                      }}
                      onError={(e) => {
                        console.log(`❌ Failed to load investment image for ${investment.Name}:`, investment.investment_image);
                        // Hide failed image and show fallback
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="image-fallback w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center" style={{display: investment.investment_image ? 'none' : 'flex'}}>
                    <Building className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {investment.Name}
                      </h3>
                      <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                        {investment.Category}
                      </p>
                    </div>
                    <Badge variant="default" className={getRiskBadgeColor(investment["Risk Level"])}>
                      {investment["Risk Level"]} Risk
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      💰 {investment.Investment}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      📈 {investment.Profit}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ⏱️ {investment["Annual ROI & Payback"].split(',')[0]}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Detail Modal */}
        {selectedInvestment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Modal Header with Image */}
                {selectedInvestment.investment_image && (
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img 
                      src={selectedInvestment.investment_image}
                      alt={selectedInvestment.Name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(`❌ Failed to load modal image for ${selectedInvestment.Name}:`, selectedInvestment.investment_image);
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="text-3xl font-black mb-2 tracking-wide">
                        {selectedInvestment.Name}
                      </h2>
                      <p className="text-lg opacity-90 font-medium">💰 Long-Term Agricultural Investment</p>
                    </div>
                    <Button
                      onClick={closeModal}
                      variant="ghost"
                      className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                    >
                      ✕
                    </Button>
                  </div>
                )}
                
                {/* Modal Header (when no image) */}
                {!selectedInvestment.investment_image && (
                  <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white p-6 rounded-t-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-black mb-2 tracking-wide">
                          {selectedInvestment.Name}
                        </h2>
                        <p className="text-lg opacity-90 font-medium">💰 Long-Term Agricultural Investment</p>
                      </div>
                      <Button
                        onClick={closeModal}
                        variant="ghost"
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                )}

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="procedure">Procedure</TabsTrigger>
                    <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Investment Required</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-green-600">
                            {selectedInvestment.Investment}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Government Subsidy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-blue-600">
                            {selectedInvestment["Govt. Subsidy"]}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Land Required</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-purple-600">
                            {selectedInvestment["Land Required"]}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={`text-lg ${getCategoryColor(selectedInvestment.Category)}`}>
                            {selectedInvestment.Category}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Risk Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className={`text-lg ${getRiskBadgeColor(selectedInvestment["Risk Level"])}`}>
                            {selectedInvestment["Risk Level"]} Risk
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Annual ROI & Payback</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-orange-600">
                            {selectedInvestment["Annual ROI & Payback"]}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Expected Profit</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-emerald-600">
                            {selectedInvestment.Profit}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Procedure Tab */}
                  <TabsContent value="procedure" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Application Procedure & Website</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                          <p className="leading-relaxed">
                            <span className="font-bold text-blue-800 text-lg">📋 IMPORTANT:</span>
                            <span className="font-bold text-blue-700"> Get drug license from state pharmacy council.</span>
                            <span className="text-sm text-gray-600"> This is a mandatory requirement for all pharmaceutical and medical-related investments. The license ensures compliance with state regulations and quality standards.</span>
                          </p>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                          <h4 className="font-bold text-yellow-800 text-lg mb-2">📝 Application Process:</h4>
                          <p className="text-sm text-gray-700 mb-3">{selectedInvestment["Application Procedure & Website"]}</p>
                          
                          <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
                            <Button 
                              onClick={() => window.open('https://msme.gov.in', '_blank')}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
                            >
                              🚀 APPLY NOW
                            </Button>
                            <Button 
                              onClick={() => window.open('https://msme.gov.in', '_blank')}
                              variant="outline"
                              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg"
                            >
                              🌐 VISIT WEBSITE
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-purple-800">📋 Complete Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-purple-900 font-medium">{selectedInvestment["Complete Plan"]}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                      <CardHeader>
                        <CardTitle className="text-orange-800">📈 Annual ROI & Payback Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-orange-900 font-bold text-lg">{selectedInvestment["Annual ROI & Payback"]}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* ROI Calculator Tab */}
                  <TabsContent value="roi" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>ROI Calculator for {selectedInvestment.Name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="investmentAmount">Investment Amount (₹)</Label>
                            <Input
                              id="investmentAmount"
                              type="number"
                              value={investmentAmount}
                              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                              min="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                            <Input
                              id="expectedROI"
                              type="number"
                              value={expectedROI}
                              onChange={(e) => setExpectedROI(Number(e.target.value))}
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="timePeriod">Time Period (years)</Label>
                            <Input
                              id="timePeriod"
                              type="number"
                              value={timePeriod}
                              onChange={(e) => setTimePeriod(Number(e.target.value))}
                              min="0.1"
                              step="0.1"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Investment:</span>
                            <span className="font-bold">₹{calculateROI().totalInvestment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Annual Return:</span>
                            <span className="font-bold text-green-600">₹{calculateROI().annualReturn.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Returns:</span>
                            <span className="font-bold text-blue-600">₹{calculateROI().totalReturns.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Net Profit:</span>
                            <span className="font-bold text-purple-600">₹{calculateROI().netProfit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">ROI Percentage:</span>
                            <span className="font-bold text-orange-600">{calculateROI().roiPercentage}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsPage;
