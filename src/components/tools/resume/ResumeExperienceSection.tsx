import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
}

interface ExperienceContent {
  items: ExperienceItem[];
}

interface ResumeExperienceSectionProps {
  content: ExperienceContent;
  onChange: (content: ExperienceContent) => void;
}

const ResumeExperienceSection: React.FC<ResumeExperienceSectionProps> = ({
  content,
  onChange,
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
    };

    onChange({
      items: [...content.items, newItem],
    });
    setExpandedItem(newItem.id);
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string | boolean) => {
    onChange({
      items: content.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      items: content.items.filter(item => item.id !== id),
    });
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {content.items.map((item) => (
        <Card key={item.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle 
                className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                onClick={() => toggleExpanded(item.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <span>
                  {item.jobTitle || 'New Position'} 
                  {item.company && ` at ${item.company}`}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                >
                  {expandedItem === item.id ? 'Collapse' : 'Edit'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {expandedItem === item.id && (
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`jobTitle-${item.id}`}>Job Title</Label>
                    <Input
                      id={`jobTitle-${item.id}`}
                      value={item.jobTitle}
                      onChange={(e) => updateExperience(item.id, 'jobTitle', e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`company-${item.id}`}>Company</Label>
                    <Input
                      id={`company-${item.id}`}
                      value={item.company}
                      onChange={(e) => updateExperience(item.id, 'company', e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`location-${item.id}`}>Location</Label>
                  <Input
                    id={`location-${item.id}`}
                    value={item.location}
                    onChange={(e) => updateExperience(item.id, 'location', e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`startDate-${item.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${item.id}`}
                      type="month"
                      value={item.startDate}
                      onChange={(e) => updateExperience(item.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`endDate-${item.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${item.id}`}
                      type="month"
                      value={item.endDate}
                      onChange={(e) => updateExperience(item.id, 'endDate', e.target.value)}
                      disabled={item.isCurrentJob}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`currentJob-${item.id}`}
                    checked={item.isCurrentJob}
                    onCheckedChange={(checked) => {
                      updateExperience(item.id, 'isCurrentJob', checked as boolean);
                      if (checked) {
                        updateExperience(item.id, 'endDate', '');
                      }
                    }}
                  />
                  <Label htmlFor={`currentJob-${item.id}`}>I currently work here</Label>
                </div>

                <div>
                  <Label htmlFor={`description-${item.id}`}>Job Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateExperience(item.id, 'description', e.target.value)}
                    placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality products&#10;• Improved application performance by 40% through code optimization"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use bullet points to highlight your key achievements and responsibilities
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Button
        variant="outline"
        onClick={addExperience}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Work Experience
      </Button>
    </div>
  );
};

export default ResumeExperienceSection;