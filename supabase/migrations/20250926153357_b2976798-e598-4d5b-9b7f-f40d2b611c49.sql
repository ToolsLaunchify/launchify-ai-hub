-- Add the Resume Builder product to the products table
INSERT INTO products (
  id,
  name,
  slug,
  description,
  rich_description,
  product_type,
  tool_type,
  revenue_type,
  is_embedded_tool,
  tool_url,
  affiliate_link,
  cta_button_text,
  meta_title,
  meta_description,
  seo_title,
  social_title,
  social_description,
  focus_keyword,
  related_keywords,
  is_featured,
  is_newly_launched,
  is_popular,
  is_trending,
  content_score,
  collect_email,
  purchase_price,
  currency
) VALUES (
  'cf8d9e0f-3456-7890-bcde-f01234567890',
  'Resume Builder',
  'resume-builder',
  'Create professional resumes with AI-powered templates and real-time preview. Build, customize, and export your resume in minutes.',
  '<p>Transform your career with our professional <strong>Resume Builder</strong> - the ultimate tool for creating standout resumes that get you hired.</p>

<h3>🎯 Why Choose Our Resume Builder?</h3>
<ul>
<li><strong>Professional Templates</strong> - Choose from 5+ expertly designed templates</li>
<li><strong>Real-Time Preview</strong> - See your resume as you build it</li>
<li><strong>ATS-Friendly</strong> - Optimized to pass Applicant Tracking Systems</li>
<li><strong>Easy Export</strong> - Download as PDF, Word, or share online</li>
<li><strong>Smart Sections</strong> - Personal info, experience, education, skills & more</li>
</ul>

<h3>✨ Key Features</h3>
<ul>
<li>Drag & drop section ordering</li>
<li>Industry-specific templates</li>
<li>Built-in spell checker</li>
<li>Mobile responsive design</li>
<li>Save multiple resume versions</li>
<li>Professional formatting</li>
</ul>

<h3>🚀 Perfect For</h3>
<ul>
<li>Job seekers at any career level</li>
<li>Career changers</li>
<li>Recent graduates</li>
<li>Professionals updating their resumes</li>
<li>Freelancers and consultants</li>
</ul>

<p>Start building your professional resume today and land your dream job!</p>',
  'paid_tools',
  'embedded',
  'paid',
  true,
  '/tools/resume-builder',
  '/tools/resume-builder',
  'Build My Resume',
  'Professional Resume Builder - Create ATS-Friendly Resumes Online',
  'Build professional resumes with our easy-to-use resume builder. Choose from templates, add your experience, and export in minutes. ATS-friendly and recruiter-approved.',
  'Professional Resume Builder - Create Winning Resumes Fast',
  'Resume Builder - Create Professional Resumes Online',
  'Build professional resumes with templates, real-time preview, and ATS optimization. Perfect for job seekers and career changers.',
  'resume builder',
  ARRAY['professional resume', 'CV builder', 'resume templates', 'ATS resume', 'job application', 'career tools'],
  true,
  true,
  true,
  false,
  85,
  true,
  29.99,
  'USD'
);