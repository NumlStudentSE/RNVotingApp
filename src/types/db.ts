import { Database } from "./supabase";

//helper type for poll and vote
export type Poll = Database['public']['Tables']['polls']['Row'];
export type Vote = Database['public']['Tables']['votes']['Row'];