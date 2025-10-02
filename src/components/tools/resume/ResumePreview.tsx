import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ResumeSection, ResumeTemplate } from '@/hooks/useResumes';
import { getTemplateStyle, type TemplateStyle } from '@/lib/resumeTemplates';

interface ResumePreviewProps {
  sections: ResumeSection[];
  template?: ResumeTemplate;
  fullSize?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  sections,
  template,
  fullSize = false,
}) => {
  // Get template style
  const templateStyle: TemplateStyle = template 
    ? getTemplateStyle(template.name)
    : getTemplateStyle('modern');

  // Get all sections
  const personalSection = sections.find(s => s.type === 'personal');
  const summarySection = sections.find(s => s.type === 'summary');
  const experienceSection = sections.find(s => s.type === 'experience');
  const educationSection = sections.find(s => s.type === 'education');
  const skillsSection = sections.find(s => s.type === 'skills');
  const projectsSection = sections.find(s => s.type === 'projects');
  const certificationsSection = sections.find(s => s.type === 'certifications');
  const languagesSection = sections.find(s => s.type === 'languages');
  const awardsSection = sections.find(s => s.type === 'awards');
  const referencesSection = sections.find(s => s.type === 'references');

  const personalInfo = personalSection?.content || {};
  const summary = summarySection?.content?.summary || '';
  const experiences = experienceSection?.content?.items || [];
  const education = educationSection?.content?.items || [];
  const skills = skillsSection?.content?.items || [];
  const projects = projectsSection?.content?.items || [];
  const certifications = certificationsSection?.content?.items || [];
  const languages = languagesSection?.content?.items || [];
  const awards = awardsSection?.content?.items || [];
  const references = referencesSection?.content?.items || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  // Apply template styles
  const containerStyle = {
    fontFamily: templateStyle.fonts.body,
    fontSize: templateStyle.styles.bodySize,
    lineHeight: templateStyle.styles.lineHeight,
    color: templateStyle.colors.text,
  };

  const nameStyle = {
    fontFamily: templateStyle.fonts.heading,
    fontSize: templateStyle.styles.nameSize,
    fontWeight: '700' as const,
    color: templateStyle.colors.primary,
  };

  const headingStyle = {
    fontFamily: templateStyle.fonts.heading,
    fontSize: templateStyle.styles.headingSize,
    fontWeight: templateStyle.styles.headingWeight as any,
    color: templateStyle.colors.primary,
    marginBottom: '1rem',
  };

  const sectionSpacing = {
    marginBottom: templateStyle.styles.sectionSpacing,
  };

  return (
    <div 
      className={`bg-white ${fullSize ? 'min-h-screen p-8' : 'h-full p-4 overflow-y-auto'}`}
      style={containerStyle}
    >
      <div className={`mx-auto ${fullSize ? 'max-w-4xl' : 'max-w-full'}`}>
        {/* Header - Personal Information */}
        <div className="text-center space-y-3" style={sectionSpacing}>
          <h1 style={nameStyle}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: templateStyle.colors.textLight }}>
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <span>✉</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <span>☎</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>

          {(personalInfo.website || personalInfo.linkedin) && (
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: templateStyle.colors.textLight }}>
              {personalInfo.website && (
                <div className="flex items-center gap-1">
                  <span>🌐</span>
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <span>in</span>
                  <span>LinkedIn</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ borderTop: `2px solid ${templateStyle.colors.primary}`, margin: '1.5rem 0' }} />

        {/* Professional Summary */}
        {summary && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Professional Summary</h2>
            <p style={{ color: templateStyle.colors.text, whiteSpace: 'pre-line' }}>{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experiences.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Work Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ 
                        fontSize: '1.0625rem', 
                        fontWeight: '600',
                        color: templateStyle.colors.text,
                        fontFamily: templateStyle.fonts.heading
                      }}>
                        {exp.jobTitle}
                      </h3>
                      <p style={{ fontWeight: '500', color: templateStyle.colors.text }}>{exp.company}</p>
                      <p style={{ fontSize: '0.875rem', color: templateStyle.colors.textLight }}>{exp.location}</p>
                    </div>
                    <div className="text-sm text-right" style={{ color: templateStyle.colors.textLight, fontSize: '0.875rem' }}>
                      <p>
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="mt-2" style={{ fontSize: '0.875rem', color: templateStyle.colors.text }}>
                      <div className="whitespace-pre-line">{exp.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ 
                        fontSize: '1.0625rem', 
                        fontWeight: '600',
                        color: templateStyle.colors.text,
                        fontFamily: templateStyle.fonts.heading
                      }}>
                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </h3>
                      <p style={{ fontWeight: '500', color: templateStyle.colors.text }}>{edu.school}</p>
                      <p style={{ fontSize: '0.875rem', color: templateStyle.colors.textLight }}>{edu.location}</p>
                      {edu.gpa && (
                        <p style={{ fontSize: '0.875rem', color: templateStyle.colors.textLight }}>GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-right" style={{ color: templateStyle.colors.textLight, fontSize: '0.875rem' }}>
                      <p>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                  {edu.description && (
                    <div className="mt-2" style={{ fontSize: '0.875rem', color: templateStyle.colors.text }}>
                      <div className="whitespace-pre-line">{edu.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Skills</h2>
            <div className="space-y-3">
              {['technical', 'soft', 'language', 'tool'].map((category) => {
                const categorySkills = getSkillsByCategory(category);
                if (categorySkills.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 style={{ 
                      fontWeight: '600', 
                      marginBottom: '0.5rem', 
                      textTransform: 'capitalize',
                      color: templateStyle.colors.text,
                      fontSize: '0.9375rem'
                    }}>
                      {category === 'soft' ? 'Soft Skills' : category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span 
                          key={skill.id}
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.8125rem',
                            borderRadius: '0.375rem',
                            border: `1px solid ${templateStyle.colors.accent}`,
                            color: templateStyle.colors.accent,
                            backgroundColor: 'transparent'
                          }}
                        >
                          {skill.name}
                          <span style={{ marginLeft: '0.25rem', opacity: 0.75, textTransform: 'capitalize' }}>
                            ({skill.level})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Projects</h2>
            <div className="space-y-4">
              {projects.map((project: any) => (
                <div key={project.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ 
                        fontSize: '1.0625rem', 
                        fontWeight: '600',
                        color: templateStyle.colors.text,
                        fontFamily: templateStyle.fonts.heading
                      }}>
                        {project.name}
                      </h3>
                      {project.role && <p style={{ fontWeight: '500', color: templateStyle.colors.text }}>{project.role}</p>}
                    </div>
                    {project.startDate && (
                      <div className="text-sm text-right" style={{ color: templateStyle.colors.textLight, fontSize: '0.875rem' }}>
                        <p>
                          {formatDate(project.startDate)} - {project.isOngoing ? 'Present' : formatDate(project.endDate)}
                        </p>
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p style={{ fontSize: '0.875rem', color: templateStyle.colors.text, whiteSpace: 'pre-line' }}>{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech: string, idx: number) => (
                        <span 
                          key={idx}
                          style={{
                            display: 'inline-block',
                            padding: '0.125rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: '0.25rem',
                            backgroundColor: templateStyle.colors.secondary,
                            color: 'white'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <p style={{ fontSize: '0.875rem', color: templateStyle.colors.accent }}>
                      {project.link}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Certifications</h2>
            <div className="space-y-3">
              {certifications.map((cert: any) => (
                <div key={cert.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ fontWeight: '600', color: templateStyle.colors.text }}>{cert.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: templateStyle.colors.text }}>{cert.issuer}</p>
                    </div>
                    {cert.date && (
                      <p style={{ fontSize: '0.875rem', color: templateStyle.colors.textLight }}>{formatDate(cert.date)}</p>
                    )}
                  </div>
                  {cert.credentialId && (
                    <p style={{ fontSize: '0.75rem', color: templateStyle.colors.textLight }}>Credential ID: {cert.credentialId}</p>
                  )}
                  {cert.credentialUrl && (
                    <p style={{ fontSize: '0.75rem', color: templateStyle.colors.accent }}>
                      View Certificate: {cert.credentialUrl}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Languages</h2>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang: any) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span style={{ fontWeight: '500', color: templateStyle.colors.text }}>{lang.name}</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                    border: `1px solid ${templateStyle.colors.accent}`,
                    color: templateStyle.colors.accent
                  }}>
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>Awards & Honors</h2>
            <div className="space-y-3">
              {awards.map((award: any) => (
                <div key={award.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ fontWeight: '600', color: templateStyle.colors.text }}>{award.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: templateStyle.colors.text }}>{award.issuer}</p>
                    </div>
                    {award.date && (
                      <p style={{ fontSize: '0.875rem', color: templateStyle.colors.textLight }}>{formatDate(award.date)}</p>
                    )}
                  </div>
                  {award.description && (
                    <p style={{ fontSize: '0.875rem', color: templateStyle.colors.text, whiteSpace: 'pre-line' }}>{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references.length > 0 && (
          <div style={sectionSpacing}>
            <h2 style={headingStyle}>References</h2>
            <div className="space-y-4">
              {references.map((ref: any) => (
                <div key={ref.id} className="space-y-1">
                  <h3 style={{ fontWeight: '600', color: templateStyle.colors.text }}>{ref.name}</h3>
                  {ref.position && <p style={{ fontSize: '0.875rem', color: templateStyle.colors.text }}>{ref.position}</p>}
                  {ref.company && <p style={{ fontSize: '0.875rem', color: templateStyle.colors.text }}>{ref.company}</p>}
                  <div className="flex gap-4 text-sm mt-1" style={{ color: templateStyle.colors.textLight, fontSize: '0.875rem' }}>
                    {ref.email && (
                      <div className="flex items-center gap-1">
                        <span>✉</span>
                        <span>{ref.email}</span>
                      </div>
                    )}
                    {ref.phone && (
                      <div className="flex items-center gap-1">
                        <span>☎</span>
                        <span>{ref.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!personalInfo.firstName && !personalInfo.lastName && experiences.length === 0 && 
         education.length === 0 && skills.length === 0 && projects.length === 0 &&
         certifications.length === 0 && languages.length === 0 && awards.length === 0 &&
         references.length === 0 && !summary && (
          <div className="text-center py-12" style={{ color: templateStyle.colors.textLight }}>
            <p>Start building your resume by filling out the sections on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
