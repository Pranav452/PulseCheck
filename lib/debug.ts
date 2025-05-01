import { supabase } from './supabase';

export async function checkSupabaseConnection() {
  try {
    // Test the connection to Supabase
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful:', data);
    return true;
  } catch (err) {
    console.error('Unexpected error checking Supabase connection:', err);
    return false;
  }
}

export async function testAuthFlow() {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return false;
    }
    
    if (!session) {
      console.log('No active session found');
      return false;
    }
    
    console.log('Active session found:', session);
    
    // Test getting user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (userError) {
      console.error('Error fetching user data:', userError);
      return false;
    }
    
    console.log('User data retrieved successfully:', userData);
    return true;
  } catch (err) {
    console.error('Unexpected error testing auth flow:', err);
    return false;
  }
} 