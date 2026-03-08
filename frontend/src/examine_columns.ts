import { supabase } from './lib/supabase';

async function examineTableColumns() {
  console.log('🔍 Examining all table columns...');
  
  const tables = [
    'Short_Term_Crops',
    'Medium_Term_Crops', 
    'Long_Term_Crops',
    'S_T_C_PopUI1',
    'M_T_C_PopUI1',
    'L_T_C_PopUI1'
  ];

  for (const tableName of tables) {
    console.log(`\n📊 Table: ${tableName}`);
    try {
      const { data, error } = await supabase.from(tableName).select('*').limit(1);
      if (error) {
        console.error(`❌ Error in ${tableName}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Columns in ${tableName}:`, Object.keys(data[0]));
        console.log(`📝 Sample data:`, data[0]);
      } else {
        console.log(`⚠️ No data in ${tableName}`);
      }
    } catch (err) {
      console.error(`❌ Failed to fetch ${tableName}:`, err);
    }
  }
}

examineTableColumns();
