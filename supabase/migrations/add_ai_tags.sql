-- ===============================================================
-- MediVault: AI Tagging Feature — Supabase Migration
-- Run this in your Supabase SQL Editor
-- ===============================================================

-- 1. Add 'tags' column (text array) to the records table
--    This stores AI-generated tags like ['HEART', 'BLOOD', 'RECENT']
ALTER TABLE records
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- 2. Add 'uploadedAt' timestamp column for accurate temporal tagging
ALTER TABLE records
ADD COLUMN IF NOT EXISTS "uploadedAt" timestamptz DEFAULT now();

-- 3. Create a GIN index for fast tag-based queries (array containment)
CREATE INDEX IF NOT EXISTS idx_records_tags
ON records USING GIN (tags);

-- 4. Optional: Backfill 'tags' for existing records with no tags
--    Adds a GENERAL + OLDER tag to legacy records
UPDATE records
SET tags = ARRAY['GENERAL', 'OLDER']
WHERE tags IS NULL OR array_length(tags, 1) IS NULL;

-- ===============================================================
-- Notes:
-- - The 'tags' column uses PostgreSQL native text arrays.
-- - The supabaseClient.js uses `.overlaps('tags', tags)` for
--   multi-tag filtering in the doctor UI.
-- - Tags are generated client-side by aiTaggingService.js and
--   saved as part of the record insert payload.
-- ===============================================================
