-- מחיקת כפילויות - שמירה רק על העותק החדש ביותר מכל שאלה
WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY metadata->>'custom_id'
               ORDER BY created_at DESC
           ) as rn
    FROM questions
    WHERE is_premium = true
    AND metadata->>'custom_id' IS NOT NULL
)
DELETE FROM questions
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);