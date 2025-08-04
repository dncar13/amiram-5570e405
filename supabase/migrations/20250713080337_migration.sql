-- Passages table (eliminates duplication)
CREATE TABLE passages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id integer UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  topic text,
  general_subject text CHECK (general_subject IN ('Technology', 'Economics', 'Engineering', 'Health', 'Society', 'Education', 'Environment', 'History', 'Psychology', 'Ethics')),
  word_count integer,
  estimated_reading_time integer,
  line_count integer,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  metadata jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Topics table
CREATE TABLE topics (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Question sets table
CREATE TABLE question_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  passage_id uuid REFERENCES passages(id),
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_count integer,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Migration tracking table
CREATE TABLE migration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text NOT NULL,
  file_path text,
  status text CHECK (status IN ('started', 'completed', 'failed')),
  records_processed integer,
  errors jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Update Questions Table
ALTER TABLE questions 
  ADD COLUMN passage_id uuid REFERENCES passages(id),
  ADD COLUMN passage_line_range jsonb,
  ADD COLUMN question_subtype text CHECK (question_subtype IN ('main-idea', 'detail', 'inference', 'vocabulary-in-context', 'sentence-completion', NULL)),
  ADD COLUMN set_id uuid REFERENCES question_sets(id),
  ADD COLUMN set_order integer,
  ADD COLUMN version integer DEFAULT 1;

-- Add Constraints
ALTER TABLE questions
  ADD CONSTRAINT reading_questions_must_have_passage
  CHECK (
    (type != 'reading-comprehension') OR 
    (type = 'reading-comprehension' AND passage_id IS NOT NULL)
  );

-- Ensure unique original_id per type
CREATE UNIQUE INDEX idx_questions_original_id_type ON questions(original_id, type);

-- Passages indexes
CREATE INDEX idx_passages_topic ON passages(topic);
CREATE INDEX idx_passages_difficulty ON passages(difficulty);
CREATE INDEX idx_passages_general_subject ON passages(general_subject);

-- Questions additional indexes
CREATE INDEX idx_questions_passage_id ON questions(passage_id);
CREATE INDEX idx_questions_set_id ON questions(set_id);
CREATE INDEX idx_questions_subtype ON questions(question_subtype);

-- Migration logs indexes
CREATE INDEX idx_migration_logs_batch_id ON migration_logs(batch_id);
CREATE INDEX idx_migration_logs_status ON migration_logs(status);

-- Enable RLS on new tables
ALTER TABLE passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Public read access" ON passages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON question_sets FOR SELECT USING (true);

-- Basic admin policy for migration logs (you can adjust this later)
CREATE POLICY "Admin access to migration logs" ON migration_logs FOR ALL USING (true);