import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

interface ResumeAwardsSectionProps {
  content: { items: AwardItem[] };
  onChange: (content: { items: AwardItem[] }) => void;
}

const ResumeAwardsSection: React.FC<ResumeAwardsSectionProps> = ({
  content,
  onChange,
}) => {
  const addAward = () => {
    const newItem: AwardItem = {
      id: `award-${Date.now()}`,
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    onChange({ items: [...content.items, newItem] });
  };

  const updateAward = (id: string, field: keyof AwardItem, value: string) => {
    const updatedItems = content.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ items: updatedItems });
  };

  const removeAward = (id: string) => {
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
              onClick={() => removeAward(item.id)}
              className="absolute top-2 right-2 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Award Title *</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateAward(item.id, 'title', e.target.value)}
                    placeholder="e.g., Employee of the Year"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Issuer *</Label>
                  <Input
                    value={item.issuer}
                    onChange={(e) => updateAward(item.id, 'issuer', e.target.value)}
                    placeholder="e.g., Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date Received *</Label>
                  <Input
                    type="month"
                    value={item.date}
                    onChange={(e) => updateAward(item.id, 'date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ''}
                  onChange={(e) => updateAward(item.id, 'description', e.target.value)}
                  placeholder="Brief description of the achievement"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addAward} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Award
      </Button>
    </div>
  );
};

export default ResumeAwardsSection;
