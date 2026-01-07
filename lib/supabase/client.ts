import { createBrowserClient } from "@supabase/ssr"

const fallbackUrl = "https://tohylzyqnktwhdkbmnne.supabase.co"
const fallbackAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaHlsenlxbmt0d2hka2Jtbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Mzk5MTgsImV4cCI6MjA4MzAxNTkxOH0.nHSeuPtG4BH-Ep9ng96nnqDMChHud2IK5rKan_cQORc"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallbackUrl
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? fallbackAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL/anon key missing in environment (.env.local)")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
