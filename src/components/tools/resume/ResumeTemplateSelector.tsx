import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ResumeTemplate } from '@/hooks/useResumes';

interface ResumeTemplateSelectorProps {
  templates: ResumeTemplate[];
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
}

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const { toast } = useToast();

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    onSelectTemplate(templateId);
    toast({
      title: "Template Selected",
      description: `${templateName} template has been selected. Continue to build your resume.`,
    });
  };
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No templates available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Resume Template</h2>
        <p className="text-muted-foreground">
          Select a professional template that best fits your style and industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelectTemplate(template.id, template.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {selectedTemplate === template.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              {template.is_premium && (
                <Badge variant="secondary" className="w-fit">
                  Premium
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {/* Template Preview */}
              <div className="aspect-[8.5/11] bg-gradient-subtle rounded-lg mb-4 overflow-hidden">
                {template.preview_image_url ? (
                  <img 
                    src={template.preview_image_url} 
                    alt={`${template.name} preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="text-center p-4">
                      <div className="w-full h-4 bg-primary/20 rounded mb-2"></div>
                      <div className="w-3/4 h-3 bg-primary/15 rounded mb-2"></div>
                      <div className="w-1/2 h-3 bg-primary/15 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="w-full h-2 bg-primary/10 rounded"></div>
                        <div className="w-5/6 h-2 bg-primary/10 rounded"></div>
                        <div className="w-4/5 h-2 bg-primary/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {template.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
              )}
              
              <Button 
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTemplate(template.id, template.name);
                }}
              >
                {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Template selected! Continue to build your resume.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplateSelector;