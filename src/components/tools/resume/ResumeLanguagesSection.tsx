import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
}

interface ResumeLanguagesSectionProps {
  content: { items: LanguageItem[] };
  onChange: (content: { items: LanguageItem[] }) => void;
}

const ResumeLanguagesSection: React.FC<ResumeLanguagesSectionProps> = ({
  content,
  onChange,
}) => {
  const addLanguage = () => {
    const newItem: LanguageItem = {
      id: `lang-${Date.now()}`,
      name: '',
      proficiency: 'intermediate',
    };
    onChange({ items: [...content.items, newItem] });
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, value: string) => {
    const updatedItems = content.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ items: updatedItems });
  };

  const removeLanguage = (id: string) => {
    const updatedItems = content.items.filter(item => item.id !== id);
    onChange({ items: updatedItems });
  };

  return (
    <div className="space-y-4">
      {content.items.map((item) => (
        <Card key={item.id} className="relative">
          <CardContent className="pt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeLanguage(item.id)}
              className="absolute top-2 right-2 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language *</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateLanguage(item.id, 'name', e.target.value)}
                  placeholder="e.g., English, Spanish, Mandarin"
                />
              </div>

              <div className="space-y-2">
                <Label>Proficiency Level *</Label>
                <Select
                  value={item.proficiency}
                  onValueChange={(value) => updateLanguage(item.id, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native">Native / Bilingual</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addLanguage} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Language
      </Button>
    </div>
  );
};

export default ResumeLanguagesSection;
