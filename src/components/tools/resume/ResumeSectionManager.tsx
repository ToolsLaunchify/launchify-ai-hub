import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FileText, 
  Award, 
  Globe, 
  Languages,
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export type SectionType = 
  | 'personal' 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'projects' 
  | 'certifications' 
  | 'languages' 
  | 'awards'
  | 'references'
  | 'summary';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  content: any;
  order: number;
}

interface ResumeSectionManagerProps {
  sections: ResumeSection[];
  onUpdateSections: (sections: ResumeSection[]) => void;
}

const sectionTypes = [
  { type: 'summary', title: 'Professional Summary', icon: FileText, description: 'Brief overview of your career goals and achievements' },
  { type: 'projects', title: 'Projects', icon: FileText, description: 'Showcase your key projects and accomplishments' },
  { type: 'certifications', title: 'Certifications', icon: Award, description: 'Professional certifications and licenses' },
  { type: 'languages', title: 'Languages', icon: Globe, description: 'Languages you speak and proficiency levels' },
  { type: 'awards', title: 'Awards & Honors', icon: Award, description: 'Recognition and achievements' },
  { type: 'references', title: 'References', icon: User, description: 'Professional references (optional)' },
] as const;

const getSectionIcon = (type: SectionType) => {
  switch (type) {
    case 'personal': return User;
    case 'experience': return Briefcase;
    case 'education': return GraduationCap;
    case 'skills': return Code;
    case 'projects': return FileText;
    case 'certifications': return Award;
    case 'languages': return Globe;
    case 'awards': return Award;
    case 'references': return User;
    case 'summary': return FileText;
    default: return FileText;
  }
};

const ResumeSectionManager: React.FC<ResumeSectionManagerProps> = ({
  sections,
  onUpdateSections
}) => {
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  const addSection = (type: SectionType, title: string) => {
    const newSection: ResumeSection = {
      id: `section-${Date.now()}`,
      type,
      title,
      content: getDefaultContent(type),
      order: sections.length + 1
    };

    onUpdateSections([...sections, newSection]);
    setIsAddSectionOpen(false);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections
      .filter(s => s.id !== sectionId)
      .map((s, index) => ({ ...s, order: index + 1 }));
    onUpdateSections(updatedSections);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    [newSections[sectionIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[sectionIndex]];
    
    // Update order numbers
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    onUpdateSections(newSections);
  };

  const getDefaultContent = (type: SectionType) => {
    switch (type) {
      case 'summary':
        return { text: '' };
      case 'projects':
        return { items: [] };
      case 'certifications':
        return { items: [] };
      case 'languages':
        return { items: [] };
      case 'awards':
        return { items: [] };
      case 'references':
        return { items: [] };
      default:
        return { items: [] };
    }
  };

  const availableSections = sectionTypes.filter(
    sectionType => !sections.some(section => section.type === sectionType.type)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resume Sections</h3>
        
        <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
              <DialogDescription>
                Choose a section type to add to your resume
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-3 mt-4">
              {availableSections.map((sectionType) => {
                const IconComponent = sectionType.icon;
                return (
                  <Card 
                    key={sectionType.type}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addSection(sectionType.type, sectionType.title)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">{sectionType.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {sectionType.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {availableSections.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  All available sections have been added to your resume.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const IconComponent = getSectionIcon(section.type);
          const isRequired = ['personal', 'experience', 'education', 'skills'].includes(section.type);

          return (
            <Card key={section.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{section.title}</span>
                    {isRequired && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    {!isRequired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(section.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeSectionManager;