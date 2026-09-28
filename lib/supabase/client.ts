import { createBrowserClient } from '@supabase/ssr';

// Fallback values keep local dev / a Vercel deploy without env vars working too —
// these are public anon keys, safe to read from the client either way.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jimlnwemwyyzqybtbkxg.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbWxud2Vtd3l5enF5YnRia3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MDU3MzMsImV4cCI6MjEwNjE4MTczM30.kzRfBmuzidF-p6CqfW7u_3bpQ7dydOF3TLemcZiF_OI';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
