-- Add actual_time_out and early_checkout_deduction columns to attendance table
-- actual_time_out: stores the real time user checked out
-- time_out: stores the recorded time (12PM/5PM/10PM)
-- early_checkout_deduction: hours deducted for checking out early

ALTER TABLE public.attendance 
ADD COLUMN IF NOT EXISTS actual_time_out TEXT,
ADD COLUMN IF NOT EXISTS early_checkout_deduction INTEGER DEFAULT 0;

COMMENT ON COLUMN public.attendance.actual_time_out IS 'Actual time user checked out (can be early)';
COMMENT ON COLUMN public.attendance.time_out IS 'Recorded checkout time (12PM for morning, 5PM for afternoon, 10PM for overtime)';
COMMENT ON COLUMN public.attendance.early_checkout_deduction IS 'Hours deducted for early checkout';
