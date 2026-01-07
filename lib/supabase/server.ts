import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tohylzyqnktwhdkbmnne.supabase.co"
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaHlsenlxbmt0d2hka2Jtbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0Mzk5MTgsImV4cCI6MjA4MzAxNTkxOH0.nHSeuPtG4BH-Ep9ng96nnqDMChHud2IK5rKan_cQORc"

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
        }
      },
    },
  })
}
