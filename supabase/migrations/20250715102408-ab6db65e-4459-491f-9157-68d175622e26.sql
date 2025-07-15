-- Fix simulation_sessions table constraints
-- Remove NOT NULL constraint from completed_at since sessions start incomplete
ALTER TABLE public.simulation_sessions 
ALTER COLUMN completed_at DROP NOT NULL;

-- Ensure id has proper default (should already be there but let's be sure)
ALTER TABLE public.simulation_sessions 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Set completed_at default to null for new incomplete sessions
ALTER TABLE public.simulation_sessions 
ALTER COLUMN completed_at SET DEFAULT NULL;