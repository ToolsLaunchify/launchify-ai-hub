-- Update footer settings to use homepage tab URLs instead of tool type page URLs
UPDATE site_settings 
SET setting_value = jsonb_set(
  setting_value,
  '{sections,0,links}',
  '[
    {"label": "All Tools", "url": "/"},
    {"label": "AI Tools", "url": "/?tab=ai_tools"},
    {"label": "Software", "url": "/?tab=software"},
    {"label": "Free Tools", "url": "/?tab=free_tools"},
    {"label": "Paid Tools", "url": "/?tab=paid_tools"}
  ]'::jsonb
)
WHERE setting_key = 'footer_settings';