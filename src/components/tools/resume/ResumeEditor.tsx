import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Settings } from 'lucide-react';
import type { ResumeSection } from '@/hooks/useResumes';

interface ResumeEditorProps {
  sections: ResumeSection[];
  onUpdateSection: (sectionId: string, content: any) => void;
  onAddSection: () => void;
  resumeTitle: string;
  onUpdateTitle: (title: string) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  sections,
  onUpdateSection,
  onAddSection,
  resumeTitle,
  onUpdateTitle,
}) => {
  return (
    <div className="space-y-6">
      {/* Resume Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Resume Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resumeTitle">Resume Title</Label>
              <Input
                id="resumeTitle"
                value={resumeTitle}
                onChange={(e) => onUpdateTitle(e.target.value)}
                placeholder="My Professional Resume"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Resume Sections
            <Button variant="outline" size="sm" onClick={onAddSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={sections[0]?.id} className="w-full">
            <TabsList className="w-full flex-wrap h-auto p-1">
              {sections.map((section) => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="capitalize"
                >
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="mt-6">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-4">{section.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    Content editor for {section.type} section will be implemented here.
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeEditor;