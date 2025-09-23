-- Update the Tool Types section (index 1) in footer settings to use homepage tab URLs
UPDATE site_settings 
SET setting_value = jsonb_set(
  setting_value,
  '{sections,1,links}',
  '[
    {"label": "AI Tools", "url": "/?tab=ai_tools"},
    {"label": "Software", "url": "/?tab=software"},
    {"label": "Free Tools", "url": "/?tab=free_tools"},
    {"label": "Paid Tools", "url": "/?tab=paid_tools"}
  ]'::jsonb
)
WHERE setting_key = 'footer_settings';