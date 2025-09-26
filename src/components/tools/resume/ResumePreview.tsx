import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import type { ResumeSection, ResumeTemplate } from '@/hooks/useResumes';

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
  const personalSection = sections.find(s => s.type === 'personal');
  const experienceSection = sections.find(s => s.type === 'experience');
  const educationSection = sections.find(s => s.type === 'education');
  const skillsSection = sections.find(s => s.type === 'skills');

  const personalInfo = personalSection?.content || {};
  const experiences = experienceSection?.content?.items || [];
  const education = educationSection?.content?.items || [];
  const skills = skillsSection?.content?.items || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  return (
    <div className={`bg-white text-gray-900 ${fullSize ? 'min-h-screen p-8' : 'h-full p-4 overflow-y-auto'}`}>
      <div className={`mx-auto ${fullSize ? 'max-w-4xl' : 'max-w-full'} space-y-6`}>
        {/* Header - Personal Information */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 flex-wrap">
            {personalInfo.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 flex-wrap">
            {personalInfo.website && (
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center space-x-1">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </div>
            )}
          </div>
          
          {personalInfo.summary && (
            <div className="mt-4 text-gray-700 max-w-3xl mx-auto">
              <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Work Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                      <p className="text-gray-600 text-sm">{exp.location}</p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <p>
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-sm text-gray-700 mt-2">
                      <div className="whitespace-pre-line">{exp.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {experiences.length > 0 && education.length > 0 && <Separator />}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </h3>
                      <p className="text-gray-700 font-medium">{edu.school}</p>
                      <p className="text-gray-600 text-sm">{edu.location}</p>
                      {edu.gpa && (
                        <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <p>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                  {edu.description && (
                    <div className="text-sm text-gray-700 mt-2">
                      <div className="whitespace-pre-line">{edu.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(experiences.length > 0 || education.length > 0) && skills.length > 0 && <Separator />}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="space-y-4">
              {['technical', 'soft', 'language', 'tool'].map((category) => {
                const categorySkills = getSkillsByCategory(category);
                if (categorySkills.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-800 mb-2 capitalize">
                      {category === 'soft' ? 'Soft Skills' : category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge key={skill.id} variant="outline" className="text-xs">
                          {skill.name}
                          <span className="ml-1 opacity-75 capitalize">
                            ({skill.level})
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Template Info */}
        {template && (
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>Created with {template.name} template</p>
          </div>
        )}

        {/* Empty State */}
        {!personalInfo.firstName && !personalInfo.lastName && experiences.length === 0 && 
         education.length === 0 && skills.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Start building your resume by filling out the sections on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;