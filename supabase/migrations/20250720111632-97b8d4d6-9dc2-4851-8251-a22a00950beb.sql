-- Remove old premium set questions that are no longer relevant
-- These were the old separate premium sets that are now integrated into the unified system

DELETE FROM questions 
WHERE metadata->>'set_id' LIKE '%premium%' 
  AND metadata->>'set_id' IS NOT NULL;