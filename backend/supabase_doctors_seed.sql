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

-- Note: In Supabase, if you want public read access, you need to enable RLS and add a policy:
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to doctors" ON public.doctors
  FOR SELECT USING (true);

INSERT INTO public.doctors (name, exp, rating, img, fee, "nextSlot", clinic, department) VALUES
-- General
('Dr. Sanjay Gupta', '15 Years', 4.8, 'SG', '₹500', 'Today, 10:00 AM', true, 'general'),
('Dr. Anil Sharma', '12 Years', 4.7, 'AS', '₹400', 'Tomorrow, 4:00 PM', false, 'general'),
('Dr. Meera Patel', '18 Years', 4.9, 'MP', '₹600', 'Today, 1:00 PM', true, 'general'),
('Dr. Rajesh Iyer', '22 Years', 4.6, 'RI', '₹550', 'Wed, 9:30 AM', true, 'general'),
('Dr. Sneha Kapoor', '8 Years', 4.5, 'SK', '₹350', 'Today, 6:00 PM', false, 'general'),

-- Cardio
('Dr. Vivek Narang', '25 Years', 4.9, 'VN', '₹1500', 'Tomorrow, 11:00 AM', true, 'cardio'),
('Dr. Ritu Desai', '20 Years', 4.8, 'RD', '₹1200', 'Today, 3:00 PM', false, 'cardio'),
('Dr. Arvind Reddy', '15 Years', 4.7, 'AR', '₹1000', 'Fri, 10:00 AM', true, 'cardio'),
('Dr. Neha Verma', '10 Years', 4.6, 'NV', '₹800', 'Today, 5:30 PM', true, 'cardio'),
('Dr. K. N. Murthy', '30 Years', 4.9, 'KM', '₹2000', 'Mon, 9:00 AM', false, 'cardio'),

-- Neuro
('Dr. Vikram Singh', '18 Years', 4.6, 'VS', '₹1800', 'Thu, 2:00 PM', true, 'neuro'),
('Dr. Priti Joshi', '12 Years', 4.7, 'PJ', '₹1400', 'Tomorrow, 12:30 PM', false, 'neuro'),
('Dr. Suresh Menon', '22 Years', 4.8, 'SM', '₹1600', 'Today, 4:00 PM', true, 'neuro'),
('Dr. Harish Rao', '28 Years', 4.9, 'HR', '₹2000', 'Wed, 11:00 AM', true, 'neuro'),
('Dr. Ayesha Khan', '15 Years', 4.8, 'AK', '₹1500', 'Fri, 3:30 PM', false, 'neuro'),

-- Ortho
('Dr. Priya Desai', '10 Years', 4.8, 'PD', '₹900', 'Tomorrow, 11:30 AM', true, 'ortho'),
('Dr. Aman Gupta', '14 Years', 4.7, 'AG', '₹1000', 'Today, 2:00 PM', true, 'ortho'),
('Dr. Manish Sen', '20 Years', 4.9, 'MS', '₹1200', 'Mon, 10:00 AM', false, 'ortho'),
('Dr. Rohan Agarwal', '18 Years', 4.6, 'RA', '₹1100', 'Today, 5:00 PM', true, 'ortho'),
('Dr. Sunil Shetty', '25 Years', 4.9, 'SS', '₹1500', 'Wed, 4:00 PM', true, 'ortho'),

-- Pedia
('Dr. Aditi Sharma', '12 Years', 4.8, 'AS', '₹600', 'Today, 9:00 AM', true, 'pedia'),
('Dr. Rohan Das', '8 Years', 4.6, 'RD', '₹500', 'Tomorrow, 3:30 PM', false, 'pedia'),
('Dr. Swati Mishra', '15 Years', 4.9, 'SM', '₹800', 'Today, 11:00 AM', true, 'pedia'),
('Dr. Nitin Kumar', '20 Years', 4.7, 'NK', '₹1000', 'Mon, 5:00 PM', true, 'pedia'),
('Dr. Pooja Bajaj', '10 Years', 4.8, 'PB', '₹700', 'Fri, 1:00 PM', false, 'pedia'),

-- Opthalmo
('Dr. Lisa Ray', '14 Years', 4.7, 'LR', '₹800', 'Fri, 10:15 AM', true, 'opthalmo'),
('Dr. Karan Bhatia', '18 Years', 4.8, 'KB', '₹1000', 'Today, 12:00 PM', true, 'opthalmo'),
('Dr. Naveen Jindal', '25 Years', 4.9, 'NJ', '₹1500', 'Tomorrow, 9:30 AM', false, 'opthalmo'),
('Dr. Shilpa Sethi', '12 Years', 4.6, 'SS', '₹700', 'Wed, 4:30 PM', true, 'opthalmo'),
('Dr. Anil Kumble', '20 Years', 4.8, 'AK', '₹1200', 'Today, 6:00 PM', true, 'opthalmo');
