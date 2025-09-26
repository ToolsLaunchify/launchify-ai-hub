import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, FileText, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeExporterProps {
  resumeElementId: string;
  resumeTitle: string;
}

const ResumeExporter: React.FC<ResumeExporterProps> = ({ resumeElementId, resumeTitle }) => {
  const { toast } = useToast();

  const exportToPDF = async () => {
    try {
      const element = document.getElementById(resumeElementId);
      if (!element) {
        toast({
          title: "Export Error",
          description: "Resume content not found. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Show loading toast
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your resume...",
      });

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${resumeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.pdf`;
      
      pdf.save(filename);

      toast({
        title: "PDF Downloaded",
        description: "Your resume has been saved successfully!",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const exportToWord = () => {
    try {
      const element = document.getElementById(resumeElementId);
      if (!element) {
        toast({
          title: "Export Error", 
          description: "Resume content not found.",
          variant: "destructive"
        });
        return;
      }

      // Create HTML content for Word export
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${resumeTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #333; }
            .item { margin-bottom: 15px; }
            .item-title { font-weight: bold; }
            .item-subtitle { font-style: italic; color: #666; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${resumeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.doc`;
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Word Document Downloaded",
        description: "Your resume has been saved as a Word document!",
      });
    } catch (error) {
      console.error('Word export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate Word document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareResume = async () => {
    try {
      const url = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: resumeTitle,
          text: 'Check out my resume!',
          url: url
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Resume link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share Failed",
        description: "Unable to share resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={shareResume}>
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={exportToWord}>
        <FileText className="w-4 h-4 mr-2" />
        Word
      </Button>
      <Button size="sm" onClick={exportToPDF}>
        <Download className="w-4 h-4 mr-2" />
        PDF
      </Button>
    </div>
  );
};

export default ResumeExporter;