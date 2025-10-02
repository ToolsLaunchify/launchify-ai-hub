import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

interface ResumeCertificationsSectionProps {
  content: { items: CertificationItem[] };
  onChange: (content: { items: CertificationItem[] }) => void;
}

const ResumeCertificationsSection: React.FC<ResumeCertificationsSectionProps> = ({
  content,
  onChange,
}) => {
  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      url: '',
    };
    onChange({ items: [...content.items, newItem] });
  };

  const updateCertification = (id: string, field: keyof CertificationItem, value: string) => {
    const updatedItems = content.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ items: updatedItems });
  };

  const removeCertification = (id: string) => {
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
              onClick={() => removeCertification(item.id)}
              className="absolute top-2 right-2 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Certification Name *</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateCertification(item.id, 'name', e.target.value)}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-2">
                <Label>Issuing Organization *</Label>
                <Input
                  value={item.issuer}
                  onChange={(e) => updateCertification(item.id, 'issuer', e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div className="space-y-2">
                <Label>Issue Date *</Label>
                <Input
                  type="month"
                  value={item.date}
                  onChange={(e) => updateCertification(item.id, 'date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Credential ID</Label>
                <Input
                  value={item.credentialId || ''}
                  onChange={(e) => updateCertification(item.id, 'credentialId', e.target.value)}
                  placeholder="e.g., ABC123XYZ"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Credential URL</Label>
                <Input
                  value={item.url || ''}
                  onChange={(e) => updateCertification(item.id, 'url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addCertification} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
};

export default ResumeCertificationsSection;
