# Complete Database Schema Guide

The `PGRST205` error occurred because you haven't created the `consultations` table in Supabase. Unlike Firebase, Supabase relies on strict relational PostgreSQL tables that must be explicitly defined in their admin portal before you start pushing or pulling records from them. Therefore, the web app client cannot generate them dynamically for you.

Please go to your Supabase **SQL Editor** menu entirely via the browser (the little `</>` icon on your dashboard sidebar) and run this exact SQL query to build the required table:

```sql
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "doctorName" TEXT,
    department TEXT,
    date TEXT,
    time TEXT,
    type TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS) policies
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Expose anon/guest inserts so prototype functions flawlessly
CREATE POLICY "Allow all actions" ON public.consultations FOR ALL USING (true) WITH CHECK (true);
```

### Table 2: Emergency QR Access Tokens
Run this as a separate query or right below the first one to enable the new Emergency Check-in feature:

```sql
CREATE TABLE IF NOT EXISTS public.share_tokens (
    id UUID PRIMARY KEY,
    patient_id TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.share_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all token actions" ON public.share_tokens FOR ALL USING (true) WITH CHECK (true);
```

### Table 3: Doctor Accounts
Run this to enable persistent doctor login and registration:

```sql
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    specialization TEXT,
    gender TEXT,
    location TEXT,
    "licenseNumber" TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all doctor actions" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
```
