-- Delete existing gig economy questions that have partial passage text
-- These are identifiable by their original_id values from 1-10 and type 'reading-comprehension'
DELETE FROM public.questions 
WHERE type = 'reading-comprehension' 
  AND original_id BETWEEN 1 AND 10 
  AND topic_id = 3;