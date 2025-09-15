import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface VersionToggleProps {
  onVersionChange?: (version: 'classic' | 'enhanced') => void;
}

const VersionToggle: React.FC<VersionToggleProps> = ({ onVersionChange }) => {
  const [currentVersion, setCurrentVersion] = useState<'classic' | 'enhanced'>('enhanced');

  useEffect(() => {
    // Check for saved preference
    const savedVersion = localStorage.getItem('homepage-version') as 'classic' | 'enhanced' | null;
    if (savedVersion) {
      setCurrentVersion(savedVersion);
    }
  }, []);

  const handleVersionChange = (version: 'classic' | 'enhanced') => {
    setCurrentVersion(version);
    localStorage.setItem('homepage-version', version);
    onVersionChange?.(version);
    
    // Reload page to apply version changes
    window.location.reload();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur border-border/50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Version
          <Badge variant="secondary" className="ml-2">
            {currentVersion === 'enhanced' ? 'New' : 'Classic'}
          </Badge>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 mr-6 mb-2" align="end">
        <Card className="border-none shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Homepage Version
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose between the classic or enhanced homepage experience
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Enhanced Version */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-medium">Enhanced</span>
                  <Badge variant="default" className="text-xs">New</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Advanced browse section, improved search, better product showcase
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Advanced product browser with sidebar</li>
                  <li>• Enhanced search with filters</li>
                  <li>• Better product organization</li>
                  <li>• Modern design improvements</li>
                </ul>
              </div>
              <Switch
                checked={currentVersion === 'enhanced'}
                onCheckedChange={() => handleVersionChange('enhanced')}
              />
            </div>

            {/* Classic Version */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Classic</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Original simple homepage layout
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Simple product sections</li>
                  <li>• Basic search functionality</li>
                  <li>• Original design</li>
                  <li>• Faster loading</li>
                </ul>
              </div>
              <Switch
                checked={currentVersion === 'classic'}
                onCheckedChange={() => handleVersionChange('classic')}
              />
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Your preference is saved locally and will persist across visits.
              </p>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default VersionToggle;