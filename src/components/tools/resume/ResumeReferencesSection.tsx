import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

interface ResumeReferencesSectionProps {
  content: { items: ReferenceItem[] };
  onChange: (content: { items: ReferenceItem[] }) => void;
}

const ResumeReferencesSection: React.FC<ResumeReferencesSectionProps> = ({
  content,
  onChange,
}) => {
  const addReference = () => {
    const newItem: ReferenceItem = {
      id: `ref-${Date.now()}`,
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
    };
    onChange({ items: [...content.items, newItem] });
  };

  const updateReference = (id: string, field: keyof ReferenceItem, value: string) => {
    const updatedItems = content.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ items: updatedItems });
  };

  const removeReference = (id: string) => {
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
              onClick={() => removeReference(item.id)}
              className="absolute top-2 right-2 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateReference(item.id, 'name', e.target.value)}
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateReference(item.id, 'title', e.target.value)}
                    placeholder="e.g., Senior Manager"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={item.company}
                    onChange={(e) => updateReference(item.id, 'company', e.target.value)}
                    placeholder="e.g., ABC Corporation"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={item.email}
                    onChange={(e) => updateReference(item.id, 'email', e.target.value)}
                    placeholder="john.smith@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    value={item.phone}
                    onChange={(e) => updateReference(item.id, 'phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addReference} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Reference
      </Button>
    </div>
  );
};

export default ResumeReferencesSection;
