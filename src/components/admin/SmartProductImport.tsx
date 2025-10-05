import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SmartProductImportProps {
  onDataExtracted: (data: any) => void;
}

export const SmartProductImport = ({ onDataExtracted }: SmartProductImportProps) => {
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a product URL to extract information",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com/product)",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    setExtractionResult(null);

    try {
      console.log('Starting product extraction for URL:', url);
      
      const { data, error } = await supabase.functions.invoke('extract-product-info', {
        body: { url }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract product information');
      }

      console.log('Extraction successful:', data);
      setExtractionResult(data);
      
      // Auto-fill the form with extracted data
      onDataExtracted(data.data);

      const fieldsExtracted = Object.keys(data.data).length;
      const missingCount = data.missing_fields?.length || 0;

      toast({
        title: "✨ Product Info Extracted!",
        description: `Successfully extracted ${fieldsExtracted} fields. ${missingCount} fields need manual input.`,
      });

    } catch (error) {
      console.error('Error extracting product info:', error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract product information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.9) return <Badge className="bg-green-500">High</Badge>;
    if (score >= 0.7) return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge className="bg-orange-500">Low</Badge>;
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">🪄 Smart Product Import (AI-Powered)</h3>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Input
          type="url"
          placeholder="Enter product URL (e.g., https://example.com/product)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isExtracting}
          className="flex-1"
        />
        <Button 
          onClick={handleExtract} 
          disabled={isExtracting || !url.trim()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Extract Info
            </>
          )}
        </Button>
      </div>

      {isExtracting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>⚡ AI is analyzing the product page... This may take 10-20 seconds</span>
        </div>
      )}

      {extractionResult && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Extraction Complete!</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="text-muted-foreground">Overall Confidence:</span>
              <span className="ml-2 font-semibold">
                {((extractionResult.data.confidence_scores?.overall || 0.85) * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Fields Extracted:</span>
              <span className="ml-2 font-semibold text-green-600">
                {Object.keys(extractionResult.data).length}
              </span>
            </div>
          </div>

          {extractionResult.missing_fields && extractionResult.missing_fields.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-orange-600 dark:text-orange-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Needs manual input:</span>
                <span className="ml-1">{extractionResult.missing_fields.join(', ')}</span>
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              ✓ All form fields below have been auto-filled. Review and adjust as needed before saving.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        <p>💡 <strong>How it works:</strong> Paste any product URL and our AI will automatically extract name, description, pricing, features, FAQ, and more. Saves 90% of manual data entry time!</p>
      </div>
    </Card>
  );
};
