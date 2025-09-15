import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Settings } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';

const SiteSettingsManagement: React.FC = () => {
  const { data: siteSettings = {}, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();

  const [socialMedia, setSocialMedia] = useState(siteSettings.social_media || {});
  const [newsletterSettings, setNewsletterSettings] = useState(siteSettings.newsletter_settings || {});
  const [footerSections, setFooterSections] = useState(siteSettings.footer_sections || {});

  React.useEffect(() => {
    if (siteSettings) {
      setSocialMedia(siteSettings.social_media || {});
      setNewsletterSettings(siteSettings.newsletter_settings || {});
      setFooterSections(siteSettings.footer_sections || {});
    }
  }, [siteSettings]);

  const handleSaveSocialMedia = async () => {
    try {
      await updateSettings.mutateAsync({ key: 'social_media', value: socialMedia });
      toast({ title: 'Social media settings updated successfully!' });
    } catch (error) {
      toast({ 
        title: 'Failed to update social media settings',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveNewsletterSettings = async () => {
    try {
      await updateSettings.mutateAsync({ key: 'newsletter_settings', value: newsletterSettings });
      toast({ title: 'Newsletter settings updated successfully!' });
    } catch (error) {
      toast({
        title: 'Failed to update newsletter settings',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveFooterSections = async () => {
    try {
      await updateSettings.mutateAsync({ key: 'footer_sections', value: footerSections });
      toast({ title: 'Footer settings updated successfully!' });
    } catch (error) {
      toast({
        title: 'Failed to update footer settings',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const addResourceLink = () => {
    const currentResources = footerSections.resources || [];
    setFooterSections({
      ...footerSections,
      resources: [...currentResources, { label: '', href: '' }]
    });
  };

  const updateResourceLink = (index: number, field: 'label' | 'href', value: string) => {
    const currentResources = [...(footerSections.resources || [])];
    currentResources[index] = { ...currentResources[index], [field]: value };
    setFooterSections({
      ...footerSections,
      resources: currentResources
    });
  };

  const removeResourceLink = (index: number) => {
    const currentResources = [...(footerSections.resources || [])];
    currentResources.splice(index, 1);
    setFooterSections({
      ...footerSections,
      resources: currentResources
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Site Settings</h2>
      </div>

      <Tabs defaultValue="social" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="footer">Footer Links</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage your social media links displayed in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/username"
                    value={socialMedia.twitter || ''}
                    onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/company/company-name"
                    value={socialMedia.linkedin || ''}
                    onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    value={socialMedia.github || ''}
                    onChange={(e) => setSocialMedia({ ...socialMedia, github: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    placeholder="hello@company.com"
                    value={socialMedia.email || ''}
                    onChange={(e) => setSocialMedia({ ...socialMedia, email: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveSocialMedia} disabled={updateSettings.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Settings</CardTitle>
              <CardDescription>
                Configure newsletter subscription settings and messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="newsletter-enabled"
                  checked={newsletterSettings.enabled || false}
                  onCheckedChange={(checked) => setNewsletterSettings({ ...newsletterSettings, enabled: checked })}
                />
                <Label htmlFor="newsletter-enabled">Enable newsletter subscription</Label>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea
                    id="success-message"
                    placeholder="Thanks for subscribing! Check your email for confirmation."
                    value={newsletterSettings.success_message || ''}
                    onChange={(e) => setNewsletterSettings({ ...newsletterSettings, success_message: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="error-message">Error Message</Label>
                  <Textarea
                    id="error-message"
                    placeholder="Something went wrong. Please try again."
                    value={newsletterSettings.error_message || ''}
                    onChange={(e) => setNewsletterSettings({ ...newsletterSettings, error_message: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNewsletterSettings} disabled={updateSettings.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Resource Links</CardTitle>
              <CardDescription>
                Manage the links displayed in the Resources section of the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(footerSections.resources || []).map((link: any, index: number) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Link Text</Label>
                      <Input
                        placeholder="e.g., Blog"
                        value={link.label}
                        onChange={(e) => updateResourceLink(index, 'label', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>URL</Label>
                      <Input
                        placeholder="e.g., /blog"
                        value={link.href}
                        onChange={(e) => updateResourceLink(index, 'href', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeResourceLink(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={addResourceLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
                <Button onClick={handleSaveFooterSections} disabled={updateSettings.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsManagement;