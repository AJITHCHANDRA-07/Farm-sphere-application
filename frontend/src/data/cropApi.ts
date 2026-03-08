
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMTAxMywiZXhwIjoyMDg2MTk3MDEzfQ.XGqPi-F3wLim21IAqY9l_CjLwSoy_hCjAdsxXkJDtd4'; // Use service role key for full access
const supabase = createClient(supabaseUrl, supabaseKey);

// API Configuration (fallback)
const API_BASE_URL = 'http://localhost:3001/api';

// Fetch crops by category from Supabase
export const fetchCropsByCategory = async (category: 'short' | 'medium' | 'long', userDistrict?: string) => {
  try {
    console.log(`🔄 Fetching ${category}-term crops from Supabase...`);
    console.log(`📍 User district: ${userDistrict || 'Not provided'}`);
    
    if (!userDistrict) {
      console.log('❌ No district provided');
      return [];
    }
    
    if (userDistrict === 'Not Supported') {
      console.log('❌ District not supported:', userDistrict);
      return [];
    }
    
    // Optimized query: Only fetch crops for the specific district
    let query = supabase
      .from('crop_data')
      .select('*');
    
    // Filter by district first for performance
    query = query.or(`Suitable Telangana Districts.ilike.%${userDistrict}%,Suitable Telangana Districts.ilike.%${userDistrict}`);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return [];
    }
    
    console.log(`📊 Crops found for ${userDistrict}: ${data?.length || 0}`);
    
    // Fetch crop image URLs from L_T_C_URL1 table
    let cropImageData = null;
    let workingTableName = null;
    
    try {
      console.log('🔄 Fetching crop images from L_T_C_URL1 table...');
      
      const { data: imageData, error: imageError } = await supabase
        .from('L_T_C_URL1')
        .select('Id, "Crop Name", URL');
      
      if (imageError) {
        console.error('❌ Error fetching from L_T_C_URL1:', imageError);
        console.error('Error details:', imageError.message, imageError.code, imageError.hint);
      } else if (imageData && imageData.length > 0) {
        cropImageData = imageData;
        workingTableName = 'L_T_C_URL1';
        console.log(`✅ Found ${imageData.length} crop image URLs in L_T_C_URL1`);
        console.log('Sample image data:', imageData.slice(0, 3));
        console.log('Table columns:', Object.keys(imageData[0]));
      } else {
        console.log('⚠️ L_T_C_URL1 table exists but is empty');
      }
      
      if (!cropImageData) {
        console.log('❌ No crop image data found in L_T_C_URL1 table');
      }
    } catch (error) {
      console.error('❌ Error fetching crop images:', error);
    }

    // Convert raw data to expected format and filter by duration
    let processedCrops = (data || []).map((crop: any, index: number) => {
      // Parse duration - handle various formats
      let cropDuration = 0;
      const cropDurationStr = crop['Crop Duration (Days)'];
      
      if (cropDurationStr) {
        // Handle month patterns like "Aug-25", "May-20", "04-Oct"
        if (cropDurationStr.includes('-') && (cropDurationStr.includes('Jan') || cropDurationStr.includes('Feb') || cropDurationStr.includes('Mar') || cropDurationStr.includes('Apr') || cropDurationStr.includes('May') || cropDurationStr.includes('Jun') || cropDurationStr.includes('Jul') || cropDurationStr.includes('Aug') || cropDurationStr.includes('Sep') || cropDurationStr.includes('Oct') || cropDurationStr.includes('Nov') || cropDurationStr.includes('Dec'))) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const parts = cropDurationStr.split('-');
          
          if (parts.length === 2) {
            // Handle patterns like "Aug-25" (month-day)
            const monthPart = parts.find(part => months.includes(part));
            const dayPart = parts.find(part => !isNaN(parseInt(part)));
            
            if (monthPart && dayPart) {
              const monthIndex = months.indexOf(monthPart);
              if (monthIndex !== -1) {
                cropDuration = (monthIndex * 30) + parseInt(dayPart);
              }
            }
            // Handle patterns like "04-Oct" (day-month)
            else if (parts[0].match(/^\d+$/) && months.includes(parts[1])) {
              const day = parseInt(parts[0]);
              const monthIndex = months.indexOf(parts[1]);
              if (monthIndex !== -1) {
                cropDuration = (monthIndex * 30) + day;
              }
            }
          }
        }
        // Handle day ranges like "90-120"
        else if (cropDurationStr.includes('-') && !isNaN(parseInt(cropDurationStr.split('-')[0]))) {
          const parts = cropDurationStr.split('-');
          // Take average of range for better categorization
          const start = parseInt(parts[0]) || 0;
          const end = parseInt(parts[1]) || parseInt(parts[0]) || 0;
          cropDuration = Math.floor((start + end) / 2);
        }
        // Handle single day values
        else if (!isNaN(parseInt(cropDurationStr))) {
          cropDuration = parseInt(cropDurationStr) || 0;
        }
      }
      
      // Simplified district-wise distribution based on user location
      // Just check if crop is suitable for the user's district and categorize by duration
      const suitableDistricts = crop['Suitable Telangana Districts'] || '';
      const districts = suitableDistricts.split(',').map(d => d.trim());
      
      // Duration parsing already handled above in cropDuration variable
      
      // Categorize based on actual duration
      let cropCategory: 'short' | 'medium' | 'long' = 'short';
      
      if (cropDuration <= 120) cropCategory = 'short';
      else if (cropDuration <= 365) cropCategory = 'medium';
      else cropCategory = 'long';
      
      return {
        id: index + 1,
        name: crop['Crop Name'],
        category: cropCategory,
        subcategory: crop['Crop Type'],
        duration: cropDuration,
        profit_per_acre: Math.floor(Math.random() * 200000) + 100000, // Mock data
        investment_cost: Math.floor(Math.random() * 80000) + 40000, // Mock data
        expected_yield: Math.floor(Math.random() * 3000) + 1500, // Mock data
        market_price: Math.floor(Math.random() * 80) + 40, // Mock data
        water_needs: crop['Water Requirement'],
        demand_level: crop['Demand Status'],
        image: (() => {
          // Try to find matching image from L_T_C_URL table
          const cropName = crop['Crop Name'];
          console.log(`🔍 Looking for image for crop: "${cropName}"`);
          
          // If we have image data from L_T_C_URL1, try to match
          if (cropImageData && cropImageData.length > 0) {
            console.log(`📋 Using L_T_C_URL1 table with ${cropImageData.length} records`);
            
            const imageRecord = cropImageData?.find(img => {
              // Use exact column names from L_T_C_URL1 table
              const imgCropName = img['Crop Name'];
              
              console.log(`🔍 Comparing: "${cropName}" with "${imgCropName}"`);
              
              return imgCropName === cropName ||
                     imgCropName?.toLowerCase() === cropName?.toLowerCase() ||
                     imgCropName?.trim() === cropName?.trim() ||
                     imgCropName?.toLowerCase().trim() === cropName?.toLowerCase().trim();
            });
            
            // Use exact column name 'URL' from L_T_C_URL1 table
            const imageUrl = imageRecord?.URL;
            
            if (imageUrl) {
              console.log(`✅ Found image for ${cropName}: ${imageUrl}`);
              return imageUrl;
            } else {
              console.log(`⚠️ No URL found for ${cropName} in L_T_C_URL1`);
            }
          } else {
            console.log(`⚠️ No image data available from L_T_C_URL1 table`);
          }
          
          // Fallback: Use a static crop image based on crop name for consistency
          const cropSeed = cropName.toLowerCase().replace(/\s+/g, '');
          const fallbackImages = {
            'paddy': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            'wheat': 'https://images.unsplash.com/photo-1598977148803-1d6a4a8d4b5c?w=400&h=300&fit=crop',
            'cotton': 'https://images.unsplash.com/photo-1625246333195-78d938e3140d?w=400&h=300&fit=crop',
            'maize': 'https://images.unsplash.com/photo-1598207947477-243da22d6d81?w=400&h=300&fit=crop',
            'sugarcane': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            'groundnut': 'https://images.unsplash.com/photo-1598977148803-1d6a4a8d4b5c?w=400&h=300&fit=crop',
            'redgram': 'https://images.unsplash.com/photo-1625246333195-78d938e3140d?w=400&h=300&fit=crop',
            'greengram': 'https://images.unsplash.com/photo-1598207947477-243da22d6d81?w=400&h=300&fit=crop',
            'blackgram': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            'bengalgram': 'https://images.unsplash.com/photo-1598977148803-1d6a4a8d4b5c?w=400&h=300&fit=crop',
            'chilli': 'https://images.unsplash.com/photo-1625246333195-78d938e3140d?w=400&h=300&fit=crop',
            'turmeric': 'https://images.unsplash.com/photo-1598207947477-243da22d6d81?w=400&h=300&fit=crop',
            'coriander': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
            'brinjal': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
            'bhendi': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
            'onion': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
            'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
            'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
            'citrus': 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop',
            'guava': 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop',
            'papaya': 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop',
            'coconut': 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop',
            'cashew': 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&h=300&fit=crop',
          };
          
          const fallbackUrl = fallbackImages[cropSeed as keyof typeof fallbackImages] || 
                            `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop`;
          
          console.log(`⚠️ Using fallback image for ${cropName}: ${fallbackUrl}`);
          return fallbackUrl;
        })(),
        description: `${crop['Crop Name']} - ${crop['Crop Type']} with ${crop['Demand Status']} demand`,
        climate: crop['Climate Suitability'],
        soil_type: crop['Primary Soil Type Required'],
        suitable_districts: crop['Suitable Telangana Districts'],
        risk_factors: crop['Risk Factors'],
        mitigation_strategies: crop['Mitigation Strategies']
      };
    });
    
    console.log(`📋 Processed ${processedCrops.length} crops`);
    
    // Debug: Show image URLs for first few crops
    console.log('🖼️ Sample crop images:');
    processedCrops.slice(0, 5).forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.name}: ${crop.image}`);
    });
    
    // Filter by category (district filtering already done in database query)
    const finalCrops = processedCrops.filter(crop => crop.category === category);
    console.log(`📊 ${category}-term crops for ${userDistrict}: ${finalCrops.length}`);
    
    // Debug: Show image URLs for filtered crops
    console.log(`🖼️ ${category}-term crop images:`);
    finalCrops.slice(0, 3).forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.name}: ${crop.image}`);
    });
    
    // Sort by profit
    finalCrops.sort((a, b) => b.profit_per_acre - a.profit_per_acre);
    
    console.log(`✅ Returning ${finalCrops.length} ${category}-term crops for ${userDistrict}`);
    return finalCrops;
    
  } catch (error) {
    console.error('❌ Failed to fetch crops from Supabase:', error);
    return [];
  }
};

// Fetch all crops
export const fetchAllCrops = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all crops:', error);
    return [];
  }
};

// Fetch crops by district
export const fetchCropsByDistrict = async (district: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/district/${district}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch crops by district:', error);
    return [];
  }
};

// NEW: Fetch high import dependency crops
export const fetchHighImportDependencyCrops = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/high-import-dependency`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch high import dependency crops:', error);
    return [];
  }
};

// NEW: Fetch high supply gap crops
export const fetchHighSupplyGapCrops = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/high-supply-gap`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch high supply gap crops:', error);
    return [];
  }
};

// NEW: Fetch crops with government schemes
export const fetchCropsWithSchemes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/with-schemes`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch crops with schemes:', error);
    return [];
  }
};

// NEW: Search crops
export const searchCrops = async (query: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Failed to search crops:', error);
    return [];
  }
};

// NEW: Fetch crop statistics
export const fetchCropStatistics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/stats`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch crop statistics:', error);
    return null;
  }
};

// Direct database diagnostic function
export const diagnoseDatabaseConnection = async () => {
  console.log('🔍 DIAGNOSING DATABASE CONNECTION...');
  console.log('=====================================');
  
  // Test 1: Check if we can connect to Supabase at all
  try {
    console.log('📡 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('crop_data')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      console.error('Error details:', testError.message, testError.code, testError.hint);
      return { success: false, error: 'Supabase connection failed', details: testError };
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (error) {
    console.error('❌ Critical error connecting to Supabase:', error);
    return { success: false, error: 'Critical connection error', details: error };
  }
  
  // Test 2: Check crop_data table
  try {
    console.log('📊 Testing crop_data table...');
    const { data: crops, error: cropError } = await supabase
      .from('crop_data')
      .select('*')
      .limit(5);
    
    if (cropError) {
      console.error('❌ crop_data table error:', cropError);
    } else {
      console.log(`✅ crop_data table: Found ${crops?.length || 0} crops`);
      if (crops && crops.length > 0) {
        console.log('📋 Sample crop:', crops[0]);
        console.log('📋 Available columns:', Object.keys(crops[0]));
      }
    }
  } catch (error) {
    console.error('❌ Error accessing crop_data:', error);
  }
  
  // Test 3: Check all possible image tables
  const possibleTables = [
    'L_T_C_URL',
    'S_T_C_URL', 
    'M_T_C_URL',
    'L_T_C_PopUI1',
    'S_T_C_PopUI1', 
    'M_T_C_PopUI1',
    'crop_images',
    'crop_urls',
    'long_term_crop_urls',
    'short_term_crop_urls',
    'medium_term_crop_urls'
  ];
  
  console.log('🖼️ Testing image tables...');
  let workingTables = [];
  
  for (const tableName of possibleTables) {
    try {
      console.log(`🔍 Testing table: ${tableName}`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log(`✅ ${tableName}: Found ${data.length} records`);
        console.log(`📋 Columns:`, Object.keys(data[0]));
        console.log(`📋 Sample:`, data[0]);
        workingTables.push({ tableName, recordCount: data.length, sample: data[0] });
      } else {
        console.log(`⚠️ ${tableName}: Table exists but is empty`);
      }
    } catch (error) {
      console.log(`❌ ${tableName}: ${error}`);
    }
  }
  
  // Test 4: List all tables in the database
  try {
    console.log('📚 Listing all available tables...');
    // This is a PostgreSQL query to list all tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables'); // This might not work, but let's try
    
    if (tablesError) {
      console.log('⚠️ Cannot list tables (may need RPC function)');
    } else {
      console.log('📋 Available tables:', tables);
    }
  } catch (error) {
    console.log('⚠️ Cannot list tables automatically');
  }
  
  console.log('=====================================');
  console.log('🔍 DIAGNOSIS COMPLETE');
  
  return {
    success: true,
    workingTables,
    message: workingTables.length > 0 
      ? `Found ${workingTables.length} working image tables` 
      : 'No working image tables found'
  };
};

// Extract long-term crop image links
export const getLongTermCropImageLinks = async (limit: number = 10) => {
  try {
    console.log('🔍 Extracting long-term crop image links...');
    
    // First, get long-term crops
    const { data: longTermCrops, error: cropError } = await supabase
      .from('crop_data')
      .select('*')
      .eq('category', 'long')
      .limit(limit);
    
    if (cropError) {
      console.error('❌ Error fetching long-term crops:', cropError);
      return null;
    }
    
    console.log(`📊 Found ${longTermCrops?.length || 0} long-term crops`);
    
    // Try to find image URLs from multiple tables
    const possibleTables = [
      'L_T_C_URL',
      'L_T_C_PopUI1',
      'crop_images',
      'crop_urls',
      'long_term_crop_urls'
    ];
    
    let imageData = null;
    let workingTable = null;
    
    for (const tableName of possibleTables) {
      console.log(`🔍 Checking table: ${tableName}`);
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('*');
        
        if (tableError) {
          console.log(`❌ ${tableName}: ${tableError.message}`);
        } else if (tableData && tableData.length > 0) {
          imageData = tableData;
          workingTable = tableName;
          console.log(`✅ Found ${tableData.length} image records in ${tableName}`);
          break;
        }
      } catch (error) {
        console.log(`❌ ${tableName}: ${error}`);
      }
    }
    
    if (!imageData) {
      console.log('❌ No image table found');
      return null;
    }
    
    // Match crops with images
    const cropImageLinks = (longTermCrops || []).map(crop => {
      const cropName = crop['Crop Name'];
      
      const imageRecord = imageData?.find(img => {
        const imgCropName = img.crop_name || img['crop_name'] || img.Crop_Name || img['Crop_Name'] || 
                           img.name || img['name'] || img.Name || img['Name'];
        
        return imgCropName === cropName ||
               imgCropName?.toLowerCase() === cropName?.toLowerCase() ||
               imgCropName?.trim() === cropName?.trim() ||
               imgCropName?.toLowerCase().trim() === cropName?.toLowerCase().trim();
      });
      
      const imageUrl = imageRecord?.URL || imageRecord?.['URL'] || imageRecord?.url || imageRecord?.['url'] || 
                      imageRecord?.Image || imageRecord?.['Image'] || imageRecord?.image || imageRecord?.['image'] ||
                      imageRecord?.Image_URL || imageRecord?.['Image_URL'] || imageRecord?.image_url || imageRecord?.['image_url'];
      
      return {
        crop_name: cropName,
        image_url: imageUrl || 'NO_IMAGE_FOUND',
        table_used: workingTable,
        image_record: imageRecord || null
      };
    });
    
    console.log('🖼️ Long-term crop image links:');
    cropImageLinks.forEach((item, index) => {
      console.log(`${index + 1}. ${item.crop_name}: ${item.image_url}`);
    });
    
    return cropImageLinks;
    
  } catch (error) {
    console.error('❌ Error extracting long-term crop image links:', error);
    return null;
  }
};

// Test function to check available tables and their structure
export const testCropImageTable = async () => {
  try {
    console.log('🧪 Testing crop image tables...');
    
    // Test all possible table names
    const possibleTables = [
      'L_T_C_URL',
      'S_T_C_URL', 
      'M_T_C_URL',
      'L_T_C_PopUI1',
      'S_T_C_PopUI1', 
      'M_T_C_PopUI1',
      'crop_images',
      'crop_urls',
      'long_term_crop_urls',
      'short_term_crop_urls',
      'medium_term_crop_urls'
    ];
    
    for (const tableName of possibleTables) {
      console.log(`🔍 Testing table: ${tableName}`);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(3);
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else if (data && data.length > 0) {
          console.log(`✅ ${tableName}: Found ${data.length} records`);
          console.log(`📋 Columns:`, Object.keys(data[0]));
          console.log(`📋 Sample:`, data[0]);
          return { tableName, data, columns: Object.keys(data[0]) };
        } else {
          console.log(`⚠️ ${tableName}: Table exists but is empty`);
        }
      } catch (tableError) {
        console.log(`❌ ${tableName}: ${tableError}`);
      }
    }
    
    console.log('❌ No working crop image table found');
    return null;
  } catch (error) {
    console.error('❌ Test function error:', error);
    return null;
  }
};

// Fallback to static data if API fails
export const getCropsByCategory = async (category: 'short' | 'medium' | 'long', userDistrict?: string) => {
  try {
    // Try Supabase first
    const supabaseData = await fetchCropsByCategory(category, userDistrict);
    if (supabaseData.length > 0) return supabaseData;
    
    // Fallback to static data
    console.log('Using static fallback data');
    const cropDataModule = await import('./cropData');
    
    switch (category) {
      case 'short': return cropDataModule.shortTermCrops;
      case 'medium': return cropDataModule.mediumTermCrops;
      case 'long': return cropDataModule.longTermCrops;
      default: return cropDataModule.shortTermCrops;
    }
  } catch (error) {
    console.error('Error in getCropsByCategory:', error);
    return [];
  }
};
