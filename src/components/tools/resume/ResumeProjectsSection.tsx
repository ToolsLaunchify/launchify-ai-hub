import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
  startDate: string;
  endDate: string;
}

interface ProjectsContent {
  items: Project[];
}

interface ResumeProjectsSectionProps {
  content: ProjectsContent;
  onChange: (content: ProjectsContent) => void;
}

const ResumeProjectsSection: React.FC<ResumeProjectsSectionProps> = ({
  content,
  onChange
}) => {
  const addProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: ''
    };

    onChange({
      items: [...content.items, newProject]
    });
  };

  const updateProject = (projectId: string, field: keyof Project, value: string) => {
    onChange({
      items: content.items.map(project =>
        project.id === projectId ? { ...project, [field]: value } : project
      )
    });
  };

  const removeProject = (projectId: string) => {
    onChange({
      items: content.items.filter(project => project.id !== projectId)
    });
  };

  return (
    <div className="space-y-4">
      {content.items.map((project) => (
        <Card key={project.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Project</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-name-${project.id}`}>Project Name</Label>
                <Input
                  id={`project-name-${project.id}`}
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="E-commerce Website"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-link-${project.id}`}>Project Link (Optional)</Label>
                <Input
                  id={`project-link-${project.id}`}
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-start-${project.id}`}>Start Date</Label>
                <Input
                  id={`project-start-${project.id}`}
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-end-${project.id}`}>End Date</Label>
                <Input
                  id={`project-end-${project.id}`}
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-technologies-${project.id}`}>Technologies Used</Label>
              <Input
                id={`project-technologies-${project.id}`}
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-description-${project.id}`}>Description</Label>
              <Textarea
                id={`project-description-${project.id}`}
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Describe your project, key achievements, and your role..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
};

export default ResumeProjectsSection;