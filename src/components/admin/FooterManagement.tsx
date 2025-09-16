import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Settings2, Plus, Trash2 } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FooterLink {
  text: string;
  url: string;
  external: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterSettings {
  companyName: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
  sections: FooterSection[];
  showNewsletter: boolean;
  copyrightText: string;
}

const FooterManagement: React.FC = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const { toast } = useToast();

  const footerSettings = settings?.footer_settings as FooterSettings || {
    companyName: 'Tools Launchify',
    description: 'Discover and launch amazing tools for your business',
    email: 'hello@toolslaunchify.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, City, State 12345',
    socialLinks: {
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: ''
    },
    sections: [
      {
        title: 'Product',
        links: [
          { text: 'Features', url: '/features', external: false },
          { text: 'Pricing', url: '/pricing', external: false },
          { text: 'API', url: '/api', external: false }
        ]
      },
      {
        title: 'Company',
        links: [
          { text: 'About', url: '/about', external: false },
          { text: 'Blog', url: '/blog', external: false },
          { text: 'Careers', url: '/careers', external: false }
        ]
      }
    ],
    showNewsletter: true,
    copyrightText: 'All rights reserved.'
  };

  const [formData, setFormData] = useState<FooterSettings>(footerSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to site_settings table using Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'footer_settings',
          setting_value: formData as any
        });

      if (error) throw error;

      toast({ title: 'Footer settings saved successfully!' });
    } catch (error) {
      toast({
        title: 'Failed to save footer settings',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', links: [] }]
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const updateSection = (index: number, field: keyof FooterSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addLink = (sectionIndex: number) => {
    const newLink: FooterLink = { text: '', url: '', external: false };
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, links: [...section.links, newLink] }
          : section
      )
    }));
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, links: section.links.filter((_, j) => j !== linkIndex) }
          : section
      )
    }));
  };

  const updateLink = (sectionIndex: number, linkIndex: number, field: keyof FooterLink, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              links: section.links.map((link, j) => 
                j === linkIndex ? { ...link, [field]: value } : link
              )
            }
          : section
      )
    }));
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Footer Management</h2>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Basic company details displayed in the footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Social media profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/yourcompany"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/yourcompany"
                value={formData.socialLinks.facebook}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/company/yourcompany"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourcompany"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Footer Sections
            <Button onClick={addSection} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </CardTitle>
          <CardDescription>Organize footer links into sections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                  className="max-w-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(sectionIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center gap-2">
                    <Input
                      placeholder="Link Text"
                      value={link.text}
                      onChange={(e) => updateLink(sectionIndex, linkIndex, 'text', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateLink(sectionIndex, linkIndex, 'url', e.target.value)}
                      className="flex-1"
                    />
                    <Switch
                      checked={link.external}
                      onCheckedChange={(checked) => updateLink(sectionIndex, linkIndex, 'external', checked)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(sectionIndex, linkIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLink(sectionIndex)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Settings</CardTitle>
          <CardDescription>Additional footer configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="newsletter"
              checked={formData.showNewsletter}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showNewsletter: checked }))}
            />
            <Label htmlFor="newsletter">Show newsletter signup</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              placeholder="All rights reserved."
              value={formData.copyrightText}
              onChange={(e) => setFormData(prev => ({ ...prev, copyrightText: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterManagement;