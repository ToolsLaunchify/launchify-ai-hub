import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

interface SkillItem {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'tool';
}

interface SkillsContent {
  items: SkillItem[];
}

interface ResumeSkillsSectionProps {
  content: SkillsContent;
  onChange: (content: SkillsContent) => void;
}

const ResumeSkillsSection: React.FC<ResumeSkillsSectionProps> = ({
  content,
  onChange,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem['level']>('intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem['category']>('technical');

  const addSkill = () => {
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
    };

    onChange({
      items: [...content.items, newSkill],
    });

    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    onChange({
      items: content.items.filter(item => item.id !== id),
    });
  };

  const updateSkill = (id: string, field: keyof SkillItem, value: string) => {
    onChange({
      items: content.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const getLevelColor = (level: SkillItem['level']) => {
    switch (level) {
      case 'beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced': return 'bg-green-100 text-green-800 border-green-200';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: SkillItem['category']) => {
    switch (category) {
      case 'technical': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'soft': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'language': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'tool': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedSkills = content.items.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillItem['category'], SkillItem[]>);

  return (
    <div className="space-y-6">
      {/* Add New Skill */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="React, Leadership, Python..."
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
            </div>
            <div>
              <Label htmlFor="skillCategory">Category</Label>
              <Select value={newSkillCategory} onValueChange={(value: SkillItem['category']) => setNewSkillCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="soft">Soft Skills</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="tool">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="skillLevel">Level</Label>
              <Select value={newSkillLevel} onValueChange={(value: SkillItem['level']) => setNewSkillLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addSkill} className="mt-4" disabled={!newSkillName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Skills Display */}
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base capitalize flex items-center space-x-2">
              <Badge className={getCategoryColor(category as SkillItem['category'])}>
                {category === 'soft' ? 'Soft Skills' : category}
              </Badge>
              <span className="text-muted-foreground text-sm">({skills.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="group relative">
                  <Badge 
                    variant="outline" 
                    className={`${getLevelColor(skill.level)} pr-8 cursor-pointer`}
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="ml-2 text-xs opacity-75 capitalize">
                      {skill.level}
                    </span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {content.items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No skills added yet. Start by adding your first skill above.</p>
        </div>
      )}
    </div>
  );
};

export default ResumeSkillsSection;