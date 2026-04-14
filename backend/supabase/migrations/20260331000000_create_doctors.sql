CREATE TABLE public.doctors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  exp text NOT NULL,
  rating numeric NOT NULL,
  img text,
  fee text NOT NULL,
  "nextSlot" text NOT NULL,
  clinic boolean NOT NULL,
  department text NOT NULL
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to doctors" ON public.doctors
  FOR SELECT USING (true);
