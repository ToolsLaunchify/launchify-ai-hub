-- Fix all tool type links in footer to use correct homepage tab URLs
UPDATE site_settings 
SET setting_value = jsonb_set(
  jsonb_set(
    setting_value,
    '{sections,0,links}',
    '[
      {"text": "About Us", "url": "/about"},
      {"text": "Contact", "url": "/contact"},
      {"text": "Privacy Policy", "url": "/privacy"},
      {"text": "Terms & Conditions", "url": "/terms"},
      {"text": "All Tools", "url": "/"},
      {"text": "AI Tools", "url": "/?tab=ai_tools"},
      {"text": "Software", "url": "/?tab=software"},
      {"text": "Free Tools", "url": "/?tab=free_tools"},
      {"text": "Paid Tools", "url": "/?tab=paid_tools"}
    ]'::jsonb
  ),
  '{sections,1,links}',
  '[
    {"text": "AI Tools", "url": "/?tab=ai_tools"},
    {"text": "Software", "url": "/?tab=software"},
    {"text": "Free Tools", "url": "/?tab=free_tools"},
    {"text": "Paid Tools", "url": "/?tab=paid_tools"}
  ]'::jsonb
)
WHERE setting_key = 'footer_settings';