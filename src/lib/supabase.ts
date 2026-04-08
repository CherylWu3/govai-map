import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Fellow = {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  whatsapp: string;
  dates: string | null;
  created_at: string;
};
