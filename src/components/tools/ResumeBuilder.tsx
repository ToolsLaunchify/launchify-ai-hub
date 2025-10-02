import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Share2, 
  Save, 
  Eye,
  Plus,
  Settings,
  Palette,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useResume, useUpdateResume, useCreateResume, useResumeTemplates } from '@/hooks/useResumes';
import ResumeTemplateSelector from './resume/ResumeTemplateSelector';
import ResumeEditor from './resume/ResumeEditor';
import ResumePreview from './resume/ResumePreview';
import ResumePersonalSection from './resume/ResumePersonalSection';
import ResumeExperienceSection from './resume/ResumeExperienceSection';
import ResumeEducationSection from './resume/ResumeEducationSection';
import ResumeSkillsSection from './resume/ResumeSkillsSection';
import ResumeSectionManager from './resume/ResumeSectionManager';
import ResumeProjectsSection from './resume/ResumeProjectsSection';
import ResumeSummarySection from './resume/ResumeSummarySection';
import ResumeCertificationsSection from './resume/ResumeCertificationsSection';
import ResumeLanguagesSection from './resume/ResumeLanguagesSection';
import ResumeAwardsSection from './resume/ResumeAwardsSection';
import ResumeReferencesSection from './resume/ResumeReferencesSection';
import html2pdf from 'html2pdf.js';

const ResumeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const resumeId = searchParams.get('id');
  const isNewResume = !resumeId;
  
  const [activeTab, setActiveTab] = useState(isNewResume ? 'template' : 'build');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [resumeSections, setResumeSections] = useState<any[]>([
    { id: '1', type: 'personal', title: 'Personal Information', content: {}, order: 1 },
    { id: '2', type: 'summary', title: 'Professional Summary', content: { text: '' }, order: 2 },
    { id: '3', type: 'experience', title: 'Work Experience', content: { items: [] }, order: 3 },
    { id: '4', type: 'education', title: 'Education', content: { items: [] }, order: 4 },
    { id: '5', type: 'skills', title: 'Skills', content: { items: [] }, order: 5 },
  ]);

  const { data: resume, isLoading: resumeLoading } = useResume(resumeId || '');
  const { data: templates } = useResumeTemplates();
  const createResume = useCreateResume();
  const updateResume = useUpdateResume();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (resume) {
      setResumeTitle(resume.title);
      setSelectedTemplate(resume.template_id);
      setResumeSections(resume.sections || resumeSections);
    }
  }, [resume]);

  const handleSave = async () => {
    if (!user) return;

    try {
      if (isNewResume) {
        const newResume = await createResume.mutateAsync({
          title: resumeTitle,
          template_id: selectedTemplate,
          sections: resumeSections,
        });
        
        setSearchParams({ id: newResume.id });
        toast({
          title: "Resume Created",
          description: "Your resume has been created successfully.",
        });
      } else {
        await updateResume.mutateAsync({
          resumeId: resumeId,
          updates: {
            title: resumeTitle,
            template_id: selectedTemplate,
            sections: resumeSections,
          },
        });
        
        toast({
          title: "Resume Saved",
          description: "Your changes have been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we create your resume PDF...",
      });

      const element = document.getElementById('resume-preview');
      if (!element) {
        throw new Error('Resume preview not found');
      }

      const opt = {
        margin: 0.5,
        filename: `${resumeTitle.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();

      toast({
        title: "Success",
        description: "Your resume has been exported as PDF!",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: resumeTitle,
          text: 'Check out my resume!',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Resume link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share Failed", 
        description: "Unable to share resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateSection = (sectionId: string, content: any) => {
    setResumeSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, content }
          : section
      )
    );
  };

  const getSectionIcon = (type: string) => {
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

  if (!user) {
    return null;
  }

  if (resumeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/tools')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Tools
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold">{resumeTitle}</h1>
                <Badge variant="secondary" className="ml-2">
                  {isNewResume ? 'New' : 'Draft'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={handleSave} disabled={createResume.isPending || updateResume.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {createResume.isPending || updateResume.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="template" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Choose Template</span>
            </TabsTrigger>
            <TabsTrigger value="build" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Build Resume</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="mt-6">
            <ResumeTemplateSelector
              templates={templates || []}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              onContinue={() => setActiveTab('build')}
            />
          </TabsContent>

          <TabsContent value="build" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Editor Panel */}
              <div className="space-y-6">
                {/* Resume Title Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resume Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="resume-title">Give your resume a name</Label>
                      <Input
                        id="resume-title"
                        type="text"
                        placeholder="e.g., Software Engineer Resume"
                        value={resumeTitle}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        className="text-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        This title is for your reference and won't appear on the resume
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Management */}
                <ResumeSectionManager 
                  sections={resumeSections}
                  onUpdateSections={setResumeSections}
                />

                {/* Section Editors */}
                <div className="space-y-4">
                  {resumeSections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => {
                      const IconComponent = getSectionIcon(section.type);
                      return (
                        <Card key={section.id} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-base">
                              <IconComponent className="w-4 h-4" />
                              <span>{section.title}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {section.type === 'personal' && (
                              <ResumePersonalSection
                                content={section.content || {}}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'summary' && (
                              <ResumeSummarySection
                                content={section.content || { text: '' }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'experience' && (
                              <ResumeExperienceSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'education' && (
                              <ResumeEducationSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'skills' && (
                              <ResumeSkillsSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'projects' && (
                              <ResumeProjectsSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'certifications' && (
                              <ResumeCertificationsSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'languages' && (
                              <ResumeLanguagesSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'awards' && (
                              <ResumeAwardsSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                            {section.type === 'references' && (
                              <ResumeReferencesSection
                                content={section.content?.items ? section.content : { items: [] }}
                                onChange={(content) => updateSection(section.id, content)}
                              />
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>

              {/* Live Preview Panel */}
              <div className="sticky top-6">
                <Card className="h-[800px] overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full overflow-y-auto">
                    <div id="resume-preview">
                      <ResumePreview
                        sections={resumeSections}
                        template={templates?.find(t => t.id === selectedTemplate)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <div id="resume-preview-full">
                <ResumePreview
                  sections={resumeSections}
                  template={templates?.find(t => t.id === selectedTemplate)}
                  fullSize
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeBuilder;