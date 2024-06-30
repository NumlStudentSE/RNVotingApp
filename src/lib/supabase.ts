import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';


// Accessing environment variables using expo-constants
const { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } = Constants.manifest.extra;

// Ensure the environment variables are not undefined
if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase URL or Anonymous Key from environment variables');
}

//supabaseUrl and supabaseAnonKey are 2 public keys that are safe to use inside the Expo Client Side Code
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;


//supabase client to fetch data
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase URL:', supabaseUrl); // Debugging line
console.log('Supabase Anon Key:', supabaseAnonKey); // Debugging line




