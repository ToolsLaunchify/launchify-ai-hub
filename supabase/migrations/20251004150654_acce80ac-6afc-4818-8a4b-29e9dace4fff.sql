-- Update Resume Tools category with shorter name and emoji icon
UPDATE categories 
SET 
  name = 'Resume',
  icon = '📄'
WHERE slug = 'resume-tools';