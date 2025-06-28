import { supabase } from './integrations/supabase/client';

/**
 * Test script to verify basket loading integration
 * Run this in dev console to test the backend connectivity
 */
export const testBasketIntegration = async () => {
  console.log('🧪 Testing Basket Integration...\n');

  try {
    // Test 1: Check Supabase connection
    console.log('1️⃣ Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('baskets')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Supabase connection failed:', connectionError);
      return false;
    }
    console.log('✅ Supabase connection successful');

    // Test 2: Test anonymous auth
    console.log('\n2️⃣ Testing anonymous authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.error('❌ Anonymous auth failed:', authError);
      return false;
    }
    console.log('✅ Anonymous auth successful, user ID:', authData.user?.id);

    // Test 3: Test basket table access
    console.log('\n3️⃣ Testing basket table access...');
    const { data: baskets, error: basketError } = await supabase
      .from('baskets')
      .select('*')
      .limit(5);
    
    if (basketError) {
      console.error('❌ Basket table access failed:', basketError);
      return false;
    }
    console.log('✅ Basket table access successful, found', baskets?.length || 0, 'baskets');

    // Test 4: Test basket_members table access
    console.log('\n4️⃣ Testing basket_members table access...');
    const { data: members, error: membersError } = await supabase
      .from('basket_members')
      .select('*')
      .limit(5);
    
    if (membersError) {
      console.error('❌ Basket members table access failed:', membersError);
      return false;
    }
    console.log('✅ Basket members table access successful, found', members?.length || 0, 'members');

    // Test 5: Test joined basket query (the problematic query)
    console.log('\n5️⃣ Testing joined basket query...');
    const userId = authData.user?.id;
    if (userId) {
      const { data: joinedBaskets, error: joinedError } = await supabase
        .from('basket_members')
        .select(`
          basket_id,
          baskets!inner(
            *,
            contributions(amount_usd),
            basket_members(user_id)
          )
        `)
        .eq('user_id', userId);
      
      if (joinedError) {
        console.error('❌ Joined basket query failed:', joinedError);
        return false;
      }
      console.log('✅ Joined basket query successful, found', joinedBaskets?.length || 0, 'joined baskets');
    }

    console.log('\n🎉 All tests passed! Basket integration is working properly.');
    return true;

  } catch (error) {
    console.error('❌ Test failed with exception:', error);
    return false;
  }
};

// Auto-run in development mode
if (import.meta.env.DEV) {
  // Uncomment to auto-test on module load
  // testBasketIntegration();
}

// Make available globally for manual testing
(window as any).testBasketIntegration = testBasketIntegration; 