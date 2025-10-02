import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ResumeTemplate } from '@/hooks/useResumes';
import templateClassic from '@/assets/template-classic.png';
import templateModern from '@/assets/template-modern.png';
import templateAcademic from '@/assets/template-academic.png';
import templateExecutive from '@/assets/template-executive.png';
import templateCreative from '@/assets/template-creative.png';
import templateSales from '@/assets/template-sales.png';
import templateTech from '@/assets/template-tech.png';
import templateMinimal from '@/assets/template-minimal.png';
import templateProfessional from '@/assets/template-professional.png';

interface ResumeTemplateSelectorProps {
  templates: ResumeTemplate[];
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
  onContinue?: () => void;
}

const templateImages: Record<string, string> = {
  'classic': templateClassic,
  'modern': templateModern,
  'academic': templateAcademic,
  'executive': templateExecutive,
  'creative': templateCreative,
  'sales': templateSales,
  'tech': templateTech,
  'minimal': templateMinimal,
  'professional': templateProfessional,
};

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onContinue,
}) => {
  const { toast } = useToast();

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    toast({
      title: "Template Selected",
      description: "You can now proceed to build your resume.",
    });
  };

  const getTemplateImage = (templateName: string) => {
    const key = templateName.toLowerCase();
    return templateImages[key] || templateImages['modern'];
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

      {selectedTemplate && onContinue && (
        <div className="flex justify-center">
          <Button onClick={onContinue} size="lg" className="gap-2">
            Continue to Build Resume
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
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
                <img 
                  src={template.preview_image_url || getTemplateImage(template.name)} 
                  alt={`${template.name} preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {template.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
              )}
              
              <Button 
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSelectTemplate(template.id)}
              >
                {selectedTemplate === template.id ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Selected
                  </>
                ) : (
                  'Select Template'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;