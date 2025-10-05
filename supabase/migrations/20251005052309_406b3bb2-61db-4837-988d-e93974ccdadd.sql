-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to auto-delete expired trash items daily at midnight UTC
SELECT cron.schedule(
  'auto-delete-expired-trash',
  '0 0 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://gazyicdietwqakxnbwmp.supabase.co/functions/v1/auto-delete-trash',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhenlpY2RpZXR3cWFreG5id21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzcwOTQsImV4cCI6MjA3MzM1MzA5NH0.eBUAyQascpbFEk0KHThSbIYUVsXqpI0zxijcPZ4_0oQ"}'::jsonb,
      body := '{}'::jsonb
    ) as request_id;
  $$
);
