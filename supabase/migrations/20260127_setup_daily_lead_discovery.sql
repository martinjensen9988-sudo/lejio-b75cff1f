-- Daily Lead Discovery Scheduler
-- This migration sets up a daily scheduled job to find and score new leads

-- Create a table to track daily lead discovery runs
CREATE TABLE IF NOT EXISTS public.lead_discovery_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_date DATE NOT NULL DEFAULT now(),
  leads_found INTEGER DEFAULT 0,
  leads_added INTEGER DEFAULT 0,
  average_score NUMERIC(3,1),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(run_date)
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_lead_discovery_runs_date ON public.lead_discovery_runs(run_date DESC);

-- Add comment
COMMENT ON TABLE public.lead_discovery_runs IS 'Tracks daily automated lead discovery runs';
COMMENT ON COLUMN public.lead_discovery_runs.leads_found IS 'Number of leads found during the run';
COMMENT ON COLUMN public.lead_discovery_runs.leads_added IS 'Number of new leads successfully added to sales_leads table';
COMMENT ON COLUMN public.lead_discovery_runs.average_score IS 'Average lead score for discovered leads (0-10)';

-- Create a function to record lead discovery activity
CREATE OR REPLACE FUNCTION public.record_lead_discovery_run(
  p_leads_found INTEGER,
  p_leads_added INTEGER,
  p_average_score NUMERIC,
  p_status TEXT DEFAULT 'completed',
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_run_id UUID;
BEGIN
  INSERT INTO lead_discovery_runs (
    run_date,
    leads_found,
    leads_added,
    average_score,
    status,
    error_message
  ) VALUES (
    CURRENT_DATE,
    p_leads_found,
    p_leads_added,
    p_average_score,
    p_status,
    p_error_message
  )
  ON CONFLICT (run_date) DO UPDATE SET
    leads_found = EXCLUDED.leads_found,
    leads_added = EXCLUDED.leads_added,
    average_score = EXCLUDED.average_score,
    status = EXCLUDED.status,
    error_message = EXCLUDED.error_message,
    updated_at = now()
  RETURNING id INTO v_run_id;

  RETURN v_run_id;
END;
$$;

-- Create a view to get today's lead discovery status
CREATE OR REPLACE VIEW public.today_lead_discovery_status AS
SELECT
  id,
  run_date,
  leads_found,
  leads_added,
  average_score,
  status,
  error_message,
  created_at,
  CASE
    WHEN status = 'completed' THEN 'success'
    WHEN status = 'failed' THEN 'error'
    WHEN status = 'running' THEN 'warning'
    ELSE 'info'
  END AS status_type
FROM lead_discovery_runs
WHERE run_date = CURRENT_DATE
LIMIT 1;

-- Add RLS policies
ALTER TABLE public.lead_discovery_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view lead discovery runs"
  ON public.lead_discovery_runs FOR SELECT
  USING (has_any_admin_role(auth.uid()));

CREATE POLICY "Service can insert lead discovery runs"
  ON public.lead_discovery_runs FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Service can update lead discovery runs"
  ON public.lead_discovery_runs FOR UPDATE
  USING (TRUE);

-- Add trigger for updated_at
CREATE TRIGGER update_lead_discovery_runs_updated_at
  BEFORE UPDATE ON public.lead_discovery_runs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Instructions for setting up scheduled execution:
-- 1. Use an external scheduler (e.g., EasyCron, AWS EventBridge)
-- 2. Or use Supabase Auth hooks with cron-like behavior
-- 3. Send a POST request daily to: supabase.functions.invoke('schedule-daily-lead-discovery')
-- 4. The function will automatically:
--    - Find 20 new leads using AI
--    - Enrich them with contact information
--    - Calculate lead scores
--    - Add them to sales_leads table
--    - Send admin notification
