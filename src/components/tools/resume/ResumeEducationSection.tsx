import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

interface EducationContent {
  items: EducationItem[];
}

interface ResumeEducationSectionProps {
  content: EducationContent;
  onChange: (content: EducationContent) => void;
}

const ResumeEducationSection: React.FC<ResumeEducationSectionProps> = ({
  content,
  onChange,
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const addEducation = () => {
    const newItem: EducationItem = {
      id: Date.now().toString(),
      degree: '',
      fieldOfStudy: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };

    onChange({
      items: [...content.items, newItem],
    });
    setExpandedItem(newItem.id);
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    onChange({
      items: content.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeEducation = (id: string) => {
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
                  {item.degree || 'New Education'} 
                  {item.fieldOfStudy && ` in ${item.fieldOfStudy}`}
                  {item.school && ` - ${item.school}`}
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
                  onClick={() => removeEducation(item.id)}
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
                    <Label htmlFor={`degree-${item.id}`}>Degree</Label>
                    <Input
                      id={`degree-${item.id}`}
                      value={item.degree}
                      onChange={(e) => updateEducation(item.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`fieldOfStudy-${item.id}`}>Field of Study</Label>
                    <Input
                      id={`fieldOfStudy-${item.id}`}
                      value={item.fieldOfStudy}
                      onChange={(e) => updateEducation(item.id, 'fieldOfStudy', e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`school-${item.id}`}>School</Label>
                    <Input
                      id={`school-${item.id}`}
                      value={item.school}
                      onChange={(e) => updateEducation(item.id, 'school', e.target.value)}
                      placeholder="University of Technology"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`location-${item.id}`}>Location</Label>
                    <Input
                      id={`location-${item.id}`}
                      value={item.location}
                      onChange={(e) => updateEducation(item.id, 'location', e.target.value)}
                      placeholder="New York, NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`startDate-${item.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${item.id}`}
                      type="month"
                      value={item.startDate}
                      onChange={(e) => updateEducation(item.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`endDate-${item.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${item.id}`}
                      type="month"
                      value={item.endDate}
                      onChange={(e) => updateEducation(item.id, 'endDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`gpa-${item.id}`}>GPA (Optional)</Label>
                    <Input
                      id={`gpa-${item.id}`}
                      value={item.gpa}
                      onChange={(e) => updateEducation(item.id, 'gpa', e.target.value)}
                      placeholder="3.8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`description-${item.id}`}>Additional Details (Optional)</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateEducation(item.id, 'description', e.target.value)}
                    placeholder="• Relevant coursework: Data Structures, Algorithms, Software Engineering&#10;• Dean's List for 3 consecutive semesters&#10;• President of Computer Science Club"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include honors, relevant coursework, activities, or achievements
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Button
        variant="outline"
        onClick={addEducation}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};

export default ResumeEducationSection;