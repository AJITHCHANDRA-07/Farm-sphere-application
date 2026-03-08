// Test database columns directly
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMTAxMywiZXhwIjoyMDg2MTk3MDEzfQ.XGqPi-F3wLim21IAqY9l_CjLwSoy_hCjAdsxXkJDtd4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testColumns() {
  try {
    console.log('🔍 Testing database columns...');
    
    // Test Short_Term_Crops
    const { data: shortData, error: shortError } = await supabase.from('Short_Term_Crops').select('*').limit(1);
    if (shortError) {
      console.error('❌ Short_Term_Crops error:', shortError);
    } else if (shortData && shortData.length > 0) {
      console.log('✅ Short_Term_Crops columns:', Object.keys(shortData[0]));
      console.log('📝 Sample data:', JSON.stringify(shortData[0], null, 2));
    }
    
    // Test S_T_C_PopUI1
    const { data: shortPopup, error: popupError } = await supabase.from('S_T_C_PopUI1').select('*').limit(1);
    if (popupError) {
      console.error('❌ S_T_C_PopUI1 error:', popupError);
    } else if (shortPopup && shortPopup.length > 0) {
      console.log('✅ S_T_C_PopUI1 columns:', Object.keys(shortPopup[0]));
      console.log('📝 Sample popup data:', JSON.stringify(shortPopup[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testColumns();
