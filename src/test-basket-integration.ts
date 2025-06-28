import { supabase } from './integrations/supabase/client';

/**
 * Test script to verify basket fetching and RLS policies
 * Run this in dev console to test the backend connectivity
 */
export const testBasketIntegration = async () => {
  console.log('🧺 Starting Basket Integration Test...');
  
  try {
    // Test 1: Check current user authentication
    console.log('\n📋 Test 1: Authentication Check');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError);
      // Try to sign in anonymously
      console.log('🔄 Attempting anonymous sign-in...');
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
      if (anonError) {
        console.error('❌ Anonymous sign-in failed:', anonError);
        return;
      }
      console.log('✅ Anonymous sign-in successful:', anonData.user?.id);
    } else {
      console.log('✅ User authenticated:', user.id);
    }

    const currentUser = user || (await supabase.auth.getUser()).data.user;
    if (!currentUser) {
      console.error('❌ No user available after authentication attempts');
      return;
    }

    // Test 2: Check if user exists in users table
    console.log('\n📋 Test 2: User Profile Check');
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (profileError) {
      console.error('❌ User profile fetch failed:', profileError);
      console.log('🔄 Creating user profile...');
      // This should be handled by the trigger, but let's check
    } else {
      console.log('✅ User profile exists:', {
        id: userProfile.id,
        display_name: userProfile.display_name,
        country: userProfile.country,
        is_anonymous: userProfile.is_anonymous
      });
    }

    // Test 3: Test created baskets query
    console.log('\n📋 Test 3: Created Baskets Query');
    const { data: createdBaskets, error: createdError } = await supabase
      .from('baskets')
      .select(`
        *,
        contributions(amount_usd),
        basket_members(user_id)
      `)
      .eq('creator_id', currentUser.id);

    if (createdError) {
      console.error('❌ Created baskets query failed:', createdError);
      console.error('Error details:', {
        code: createdError.code,
        message: createdError.message,
        details: createdError.details,
        hint: createdError.hint
      });
    } else {
      console.log('✅ Created baskets query successful:', createdBaskets?.length || 0, 'baskets found');
      createdBaskets?.forEach((basket, index) => {
        console.log(`  ${index + 1}. ${basket.title} (${basket.id})`);
      });
    }

    // Test 4: Test basket_members table access
    console.log('\n📋 Test 4: Basket Members Query');
    const { data: membershipData, error: membershipError } = await supabase
      .from('basket_members')
      .select('*')
      .eq('user_id', currentUser.id);

    if (membershipError) {
      console.error('❌ Basket members query failed:', membershipError);
      console.error('Error details:', {
        code: membershipError.code,
        message: membershipError.message,
        details: membershipError.details,
        hint: membershipError.hint
      });
    } else {
      console.log('✅ Basket members query successful:', membershipData?.length || 0, 'memberships found');
      membershipData?.forEach((membership, index) => {
        console.log(`  ${index + 1}. Basket: ${membership.basket_id}, Creator: ${membership.is_creator}`);
      });
    }

    // Test 5: Test joined baskets query (complex join)
    console.log('\n📋 Test 5: Joined Baskets Query (Complex Join)');
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
      .eq('user_id', currentUser.id)
      .eq('is_creator', false);

    if (joinedError) {
      console.error('❌ Joined baskets query failed:', joinedError);
      console.error('Error details:', {
        code: joinedError.code,
        message: joinedError.message,
        details: joinedError.details,
        hint: joinedError.hint
      });
    } else {
      console.log('✅ Joined baskets query successful:', joinedBaskets?.length || 0, 'joined baskets found');
      joinedBaskets?.forEach((jb, index) => {
        console.log(`  ${index + 1}. ${jb.baskets.title} (${jb.baskets.id})`);
      });
    }

    // Test 6: Test contributions query
    console.log('\n📋 Test 6: Contributions Query');
    const { data: contributions, error: contributionsError } = await supabase
      .from('contributions')
      .select('*')
      .eq('user_id', currentUser.id);

    if (contributionsError) {
      console.error('❌ Contributions query failed:', contributionsError);
    } else {
      console.log('✅ Contributions query successful:', contributions?.length || 0, 'contributions found');
    }

    // Test 7: Test public baskets visibility
    console.log('\n📋 Test 7: Public Baskets Visibility');
    const { data: publicBaskets, error: publicError } = await supabase
      .from('baskets')
      .select('*')
      .eq('is_private', false)
      .limit(5);

    if (publicError) {
      console.error('❌ Public baskets query failed:', publicError);
    } else {
      console.log('✅ Public baskets query successful:', publicBaskets?.length || 0, 'public baskets found');
    }

    // Test 8: Test RLS policies by trying to access another user's data
    console.log('\n📋 Test 8: RLS Policy Test (Should Fail)');
    const { data: allBaskets, error: rlsError } = await supabase
      .from('baskets')
      .select('*')
      .neq('creator_id', currentUser.id)
      .eq('is_private', true)
      .limit(1);

    if (rlsError) {
      console.log('✅ RLS working correctly - private baskets blocked:', rlsError.message);
    } else {
      console.log('⚠️  RLS may not be working - private baskets accessible:', allBaskets?.length || 0);
    }

    console.log('\n🎉 Basket Integration Test Complete!');
    
  } catch (error) {
    console.error('💥 Test failed with unexpected error:', error);
  }
};

// Auto-run in development mode
if (import.meta.env.DEV) {
  // Uncomment to auto-test on module load
  // testBasketIntegration();
}

// Make available globally for manual testing
(window as any).testBasketIntegration = testBasketIntegration; 