
-- Create table for storing AI suggestions and recommendations
CREATE TABLE public.ai_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('code_review', 'schema_optimization', 'accessibility', 'error_analysis', 'refactor')),
  ai_model TEXT NOT NULL CHECK (ai_model IN ('gpt-4o', 'claude-4', 'gemini-2.5-pro')),
  input_data JSONB NOT NULL,
  suggestion_content JSONB NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'rejected', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for code analysis sessions
CREATE TABLE public.code_analysis_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  session_name TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  files_analyzed JSONB NOT NULL,
  total_suggestions INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create table for AI model performance tracking
CREATE TABLE public.ai_model_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  suggestion_type TEXT NOT NULL,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  average_response_time DECIMAL(10,3),
  average_confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_suggestions
CREATE POLICY "Users can view their own AI suggestions" 
  ON public.ai_suggestions 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own AI suggestions" 
  ON public.ai_suggestions 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own AI suggestions" 
  ON public.ai_suggestions 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- RLS policies for code_analysis_sessions
CREATE POLICY "Users can view their own analysis sessions" 
  ON public.code_analysis_sessions 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own analysis sessions" 
  ON public.code_analysis_sessions 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own analysis sessions" 
  ON public.code_analysis_sessions 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- RLS policies for ai_model_metrics (admin access only for now)
CREATE POLICY "Public read access to AI model metrics" 
  ON public.ai_model_metrics 
  FOR SELECT 
  TO public;

-- Create indexes for better performance
CREATE INDEX idx_ai_suggestions_user_type ON public.ai_suggestions(user_id, suggestion_type);
CREATE INDEX idx_ai_suggestions_status ON public.ai_suggestions(status);
CREATE INDEX idx_code_analysis_sessions_user ON public.code_analysis_sessions(user_id);
CREATE INDEX idx_ai_model_metrics_model ON public.ai_model_metrics(model_name, suggestion_type);
