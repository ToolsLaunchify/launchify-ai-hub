-- Remove extra tool links from Company section, keep only the 4 company pages
UPDATE site_settings 
SET setting_value = jsonb_set(
  setting_value,
  '{sections,0,links}',
  '[
    {"text": "About Us", "url": "/about"},
    {"text": "Contact", "url": "/contact"},
    {"text": "Privacy Policy", "url": "/privacy"},
    {"text": "Terms & Conditions", "url": "/terms"}
  ]'::jsonb
)
WHERE setting_key = 'footer_settings';