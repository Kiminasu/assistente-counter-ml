// api/_lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// Note: this assumes you have SUPABASE_URL and SUPABASE_SERVICE_KEY
// set up as environment variables.
const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY ?? '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
