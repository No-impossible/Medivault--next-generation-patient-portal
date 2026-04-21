-- Add missing columns for doctor signup/authentication
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS "licenseNumber" TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Replace the read-only policy with a full-access policy so signup can INSERT
DROP POLICY IF EXISTS "Allow public read access to doctors" ON public.doctors;
CREATE POLICY "Allow all doctor actions" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
