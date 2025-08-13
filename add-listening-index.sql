-- Database performance index for listening questions
-- This index optimizes queries that filter by type and difficulty
-- Used in the new listening module to efficiently fetch questions

-- Index for questions table to optimize type+difficulty queries
CREATE INDEX IF NOT EXISTS idx_questions_type_difficulty 
ON questions(type, difficulty);

-- Index for questions table to optimize type+difficulty+audio queries
CREATE INDEX IF NOT EXISTS idx_questions_type_difficulty_audio 
ON questions(type, difficulty, audio_url);

-- Index for questions table to optimize listening comprehension queries
CREATE INDEX IF NOT EXISTS idx_questions_listening_comprehension 
ON questions(type, difficulty) 
WHERE type = 'listening_comprehension';

-- Index for questions table to optimize listening continuation queries
CREATE INDEX IF NOT EXISTS idx_questions_listening_continuation 
ON questions(type, difficulty) 
WHERE type = 'listening_continuation';

-- Index for questions table to optimize vocabulary queries
CREATE INDEX IF NOT EXISTS idx_questions_vocabulary 
ON questions(type, difficulty) 
WHERE type IN ('vocabulary', 'sentence-completion');

-- Index for questions table to optimize grammar context queries  
CREATE INDEX IF NOT EXISTS idx_questions_grammar_context 
ON questions(type, difficulty) 
WHERE type = 'grammar_in_context';

-- Performance note: These indexes will significantly speed up 
-- the new listening module queries that filter by question type and difficulty
