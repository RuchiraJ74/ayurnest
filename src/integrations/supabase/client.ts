// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tswiyrbwueipzzqfifbm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzd2l5cmJ3dWVpcHp6cWZpZmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Mjc0NzQsImV4cCI6MjA2MDQwMzQ3NH0.wG8b4qo9SiIOwWhhGlnswgIR00HiP1UFQaX9ABQMW3A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);