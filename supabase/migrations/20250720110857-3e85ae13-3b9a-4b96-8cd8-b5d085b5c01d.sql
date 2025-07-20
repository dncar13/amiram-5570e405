-- Step 1: Set all questions as premium by default
UPDATE questions SET is_premium = true;

-- Step 2: Mark 20 random questions as free for demo purposes
UPDATE questions 
SET is_premium = false 
WHERE id IN (
  SELECT id 
  FROM questions 
  ORDER BY random() 
  LIMIT 20
);