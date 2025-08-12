
-- 1) Add audio_url column to questions (if it doesn't exist)
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

COMMENT ON COLUMN public.questions.audio_url IS 'Direct URL for listening audio. Also mirrored in metadata->>audio_url for compatibility.';

-- 2) Backfill: copy existing metadata audio_url into the new column where missing
UPDATE public.questions
SET audio_url = metadata->>'audio_url'
WHERE audio_url IS NULL
  AND metadata ? 'audio_url';

-- Optional sanity check (non-blocking): count how many rows now have audio_url
-- SELECT COUNT(*) AS with_audio FROM public.questions WHERE audio_url IS NOT NULL;
