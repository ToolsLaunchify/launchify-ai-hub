import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  summary?: string;
}

interface ResumePersonalSectionProps {
  content: PersonalInfo;
  onChange: (content: PersonalInfo) => void;
}

const ResumePersonalSection: React.FC<ResumePersonalSectionProps> = ({
  content,
  onChange,
}) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={content.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={content.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={content.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john.doe@email.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={content.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={content.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="New York, NY"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={content.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://johndoe.com"
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={content.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={content.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key achievements and career objectives..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default ResumePersonalSection;