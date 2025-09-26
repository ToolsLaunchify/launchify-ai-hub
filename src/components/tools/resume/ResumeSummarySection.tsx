import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface SummaryContent {
  text: string;
}

interface ResumeSummarySectionProps {
  content: SummaryContent;
  onChange: (content: SummaryContent) => void;
}

const ResumeSummarySection: React.FC<ResumeSummarySectionProps> = ({
  content,
  onChange
}) => {
  const handleChange = (value: string) => {
    onChange({ text: value });
  };

  const generateSample = () => {
    const sampleSummary = "Results-driven professional with 5+ years of experience in software development and project management. Proven track record of delivering high-quality solutions on time and within budget. Skilled in full-stack development, team leadership, and client relationship management. Passionate about leveraging technology to solve complex business challenges and drive organizational growth.";
    handleChange(sampleSummary);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="professional-summary">Professional Summary</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSample}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate Sample
        </Button>
      </div>
      
      <Textarea
        id="professional-summary"
        value={content.text || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write a compelling summary that highlights your key qualifications, experience, and career objectives. This should be a brief overview (3-5 sentences) that captures your professional brand..."
        rows={4}
        className="resize-none"
      />
      
      <div className="text-sm text-muted-foreground">
        <p>💡 <strong>Tip:</strong> Include your years of experience, key skills, and what value you bring to employers.</p>
      </div>
    </div>
  );
};

export default ResumeSummarySection;