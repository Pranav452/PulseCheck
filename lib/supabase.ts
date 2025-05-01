import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a helper singleton for client-side components
let clientSingleton: typeof supabase;

export function createSupabaseClient() {
  if (clientSingleton) return clientSingleton;
  
  clientSingleton = supabase;
  return clientSingleton;
} 