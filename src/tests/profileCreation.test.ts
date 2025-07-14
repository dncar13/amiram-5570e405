/**
 * Test profile creation functionality
 */
import { supabase } from '@/integrations/supabase/client';

export const testProfileCreation = async () => {
  console.log('🧪 Testing profile creation...');
  
  try {
    // Test 1: Check if handle_new_user function exists
    const { data: functionData, error: functionError } = await supabase
      .rpc('handle_new_user', {});
    
    if (functionError) {
      console.log('❌ handle_new_user function test failed:', functionError);
    } else {
      console.log('✅ handle_new_user function exists');
    }
    
    // Test 2: Check profiles table structure
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ Profiles table access failed:', profilesError);
    } else {
      console.log('✅ Profiles table accessible');
      console.log('📊 Current profiles count:', profilesData?.length || 0);
    }
    
    // Test 3: Check if trigger is working by querying trigger information
    const { data: triggerData, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('*')
      .eq('trigger_name', 'on_auth_user_created');
    
    if (triggerError) {
      console.log('❌ Trigger check failed:', triggerError);
    } else {
      console.log('✅ Trigger information:', triggerData);
    }
    
  } catch (error) {
    console.error('❌ Profile creation test failed:', error);
  }
};

// Run the test
testProfileCreation();