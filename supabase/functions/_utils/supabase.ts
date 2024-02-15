import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Database } from './types_db.ts'

export const supabaseAdminClient = createClient<Database>(
  // Supabase API URL - env var exported by default when deployed.
  Deno.env.get('SUPABASE_URL') ?? '',
  // Supabase API SERVICE ROLE KEY - env var exported by default when deployed.
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)
