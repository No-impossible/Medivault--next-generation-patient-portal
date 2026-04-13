-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This strictly creates the 'prescriptions' table so your Smart Pharmacy functions optimally after logout.

CREATE TABLE IF NOT EXISTS public.prescriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "patientId" text NOT NULL,
  medicines jsonb DEFAULT '[]'::jsonb,
  "imageUrl" text,
  status text DEFAULT 'verified',
  created_at timestamptz DEFAULT now()
);

-- Turn on Row Level Security
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- As the current authentication relies on mock IDs, allow all unauthenticated operations 
-- so your frontend works smoothly.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prescriptions;
CREATE POLICY "Enable read access for all users" ON public.prescriptions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON public.prescriptions;
CREATE POLICY "Enable insert for all users" ON public.prescriptions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON public.prescriptions;
CREATE POLICY "Enable delete for all users" ON public.prescriptions FOR DELETE USING (true);
