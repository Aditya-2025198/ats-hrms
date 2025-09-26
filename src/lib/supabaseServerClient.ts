// src/lib/supabaseServerClient.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-side only (service role key)
export const supabaseServer = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
