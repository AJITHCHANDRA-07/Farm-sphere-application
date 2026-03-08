import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Crop } from "@/data/cropData";
import { Calendar, Clock, Droplets, TrendingUp, MapPin, DollarSign } from "lucide-react";

interface CropDetailModalProps {
  crop: Crop | null;
  isOpen: boolean;
  onClose: () => void;
}

const CropDetailModal = ({ crop, isOpen, onClose }: CropDetailModalProps) => {
  // 🔄 INDIVIDUAL CROP DATA - Each crop shows its OWN values
  const [landArea, setLandArea] = useState(1);
  const [investmentCost, setInvestmentCost] = useState(crop?.roiDefaults?.investmentPerAcreINR || 0);
  const [marketPrice, setMarketPrice] = useState(crop?.roiDefaults?.pricePerUnitINR || 0);
  const [expectedYield, setExpectedYield] = useState(crop?.roiDefaults?.expectedYieldPerAcre || 0);

  if (!crop) return null;

  // 🔄 INTERACTIVE ROI CALCULATION - Uses THIS crop's specific data
  const calculateROI = () => {
    const totalRevenue = landArea * expectedYield * marketPrice;
    const totalInvestment = landArea * investmentCost;
    const netProfit = totalRevenue - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100).toFixed(2) : '0.00';
    
    return {
      totalRevenue,
      totalInvestment,
      netProfit,
      roiPercentage
    };
  };

  const roi = calculateROI();

  // 🎯 SHOW INDIVIDUAL CROP DATA - Not generic values
  console.log(`🌱 Popup for ${crop.name}: Investment=${crop.investmentCost}, Yield=${crop.expectedYield}, Price=${crop.marketPrice}, ROI=${crop.quickReturns?.avgROIPercent}`);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{crop.name}</DialogTitle>
          <DialogDescription className="text-base">
            {crop.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cultivation">Cultivation Guide</TabsTrigger>
            <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
          </TabsList>

          {/* 🔍 OVERVIEW TAB - ENHANCED WITH ORIGINAL TABLES DATA */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Investment Per Acre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{crop.investmentCost?.toLocaleString() || '0'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Expected Yield Per Acre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {crop.expectedYield?.toLocaleString() || '0'} kg
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Market Price Per KG</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{crop.marketPrice?.toLocaleString() || '0'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Profit Per Acre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{crop.profitPerAcre?.toLocaleString() || '0'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Market Demand Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={crop.demand === 'Very High' ? 'default' : 'secondary'}>
                    {crop.demand || 'Medium'}
                  </Badge>
                </CardContent>
              </Card>

              {/* 🎯 ORIGINAL TABLES DATA */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Supply Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={(crop as any).supplyStatus === 'Very High' ? 'default' : 'secondary'}>
                    {(crop as any).supplyStatus || 'Not specified'}
                  </Badge>
                </CardContent>
              </Card>

              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{(crop as any).riskFactors || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Crop Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-indigo-600">
                    {(crop as any).cropDuration || 'Not specified'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 🌱 CULTIVATION GUIDE TAB - ENHANCED WITH ORIGINAL TABLES DATA */}
          <TabsContent value="cultivation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cultivation Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{crop.cultivationSteps?.[0] || 'No cultivation steps available'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Season</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{crop.seasonalInfo || 'No seasonal information available'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water And Irrigation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{crop.irrigation || 'No irrigation information available'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pest And Disease Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{crop.pestManagement?.[0] || 'No pest management information available'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Harvest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{crop.harvestTimeline?.[0] || 'No harvest information available'}</p>
              </CardContent>
            </Card>

            {/* 🎯 ORIGINAL TABLES DATA - USER-FRIENDLY FORMAT */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Cultivation Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-primary">Primary Soil Type:</span>
                    <p className="text-sm mt-1">{(crop as any).primarySoilType || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Water Requirement:</span>
                    <p className="text-sm mt-1">{(crop as any).waterRequirement || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Climate Suitability:</span>
                    <p className="text-sm mt-1">{(crop as any).climateSuitability || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Irrigation Compatibility:</span>
                    <p className="text-sm mt-1">{(crop as any).irrigationCompatibility || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Land Area Suitability:</span>
                    <p className="text-sm mt-1">{(crop as any).landAreaSuitability || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Mitigation Strategies:</span>
                    <p className="text-sm mt-1">{(crop as any).mitigationStrategies || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Crop Type:</span>
                    <p className="text-sm mt-1">{(crop as any).cropType || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-primary">Suitable District:</span>
                    <p className="text-sm mt-1">{(crop as any).suitableDistrict || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 💰 ROI CALCULATOR TAB - INTERACTIVE WITH INDIVIDUAL CROP DATA */}
          <TabsContent value="roi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ROI Calculator for {crop.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landArea">Land Area (acres)</Label>
                    <Input
                      id="landArea"
                      type="number"
                      value={landArea}
                      onChange={(e) => setLandArea(Number(e.target.value))}
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="investmentCost">Investment Cost (₹/acre)</Label>
                    <Input
                      id="investmentCost"
                      type="number"
                      value={investmentCost}
                      onChange={(e) => setInvestmentCost(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedYield">Expected Yield (kg/acre)</Label>
                    <Input
                      id="expectedYield"
                      type="number"
                      value={expectedYield}
                      onChange={(e) => setExpectedYield(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketPrice">Market Price (₹/kg)</Label>
                    <Input
                      id="marketPrice"
                      type="number"
                      value={marketPrice}
                      onChange={(e) => setMarketPrice(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Investment:</span>
                    <span className="font-bold">₹{roi.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Revenue:</span>
                    <span className="font-bold text-green-600">₹{roi.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Profit:</span>
                    <span className="font-bold text-blue-600">₹{roi.netProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">ROI Percentage:</span>
                    <span className="font-bold text-purple-600">{roi.roiPercentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🎯 SHOW THIS CROP'S SPECIFIC DATABASE DATA */}
            <Card>
              <CardHeader>
                <CardTitle>{crop.name} - Specific Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Cost Breakdown:</span>
                    <p className="text-sm text-muted-foreground">{(crop as any).costBreakdown || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Price Range:</span>
                    <p className="text-sm text-muted-foreground">{(crop as any).priceRange || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Yield Range:</span>
                    <p className="text-sm text-muted-foreground">{(crop as any).yieldRange || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Break Even Time:</span>
                    <p className="text-sm text-muted-foreground">{(crop as any).breakEvenTime || 'Not specified'}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Base ROI for {crop.name}:</h4>
                  <p className="text-2xl font-bold text-green-600">{crop.quickReturns?.avgROIPercent || '0'}%</p>
                  <p className="text-sm text-muted-foreground">Based on current market data</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CropDetailModal;
