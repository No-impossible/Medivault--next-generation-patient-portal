-- Fix the records table schema to support AI Tags and formatted dates from the Patient Dashboard
ALTER TABLE public.records ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.records ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.records ADD COLUMN IF NOT EXISTS "uploadedAt" TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.records ALTER COLUMN date TYPE TEXT USING date::TEXT;
