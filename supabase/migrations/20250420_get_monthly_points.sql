
-- Function to get monthly points for a user
CREATE OR REPLACE FUNCTION public.get_monthly_points(user_id_param UUID)
RETURNS TABLE (
  month INT,
  year INT,
  points BIGINT
) 
LANGUAGE SQL
AS $$
  SELECT 
    EXTRACT(MONTH FROM TO_DATE(task_date, 'YYYY-MM-DD'))::INT as month,
    EXTRACT(YEAR FROM TO_DATE(task_date, 'YYYY-MM-DD'))::INT as year,
    SUM(points)::BIGINT as points
  FROM 
    daily_tasks
  WHERE 
    user_id = user_id_param 
    AND completed = true
    AND task_date IS NOT NULL
  GROUP BY 
    month, year
  ORDER BY 
    year DESC, month DESC
  LIMIT 12;
$$;
