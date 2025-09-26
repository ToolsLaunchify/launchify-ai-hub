-- Update existing templates with preview images
UPDATE resume_templates 
SET preview_image_url = '/src/assets/template-modern.png'
WHERE name = 'Modern Professional';

UPDATE resume_templates 
SET preview_image_url = '/src/assets/template-classic.png'
WHERE name = 'Classic Traditional';

UPDATE resume_templates 
SET preview_image_url = '/src/assets/template-creative.png'
WHERE name = 'Creative Designer';

UPDATE resume_templates 
SET preview_image_url = '/src/assets/template-tech.png'
WHERE name = 'Tech Minimalist';

UPDATE resume_templates 
SET preview_image_url = '/src/assets/template-executive.png'
WHERE name = 'Executive Premium';