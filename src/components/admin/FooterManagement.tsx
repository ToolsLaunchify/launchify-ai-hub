import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Settings2, Plus, GripVertical, Sparkles, Layout } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';
import { DraggableFooterSection } from './DraggableFooterSection';
import { ContentBrowser } from './ContentBrowser';

interface FooterLink {
  text: string;
  url: string;
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
    youtube: string;
  };
  sections: FooterSection[];
  showNewsletter: boolean;
  copyrightText: string;
}

interface SortableSectionProps {
  section: FooterSection;
  index: number;
  onUpdateSection: (index: number, field: keyof FooterSection, value: any) => void;
  onRemoveSection: (index: number) => void;
  onAddLink: (sectionIndex: number) => void;
  onUpdateLink: (sectionIndex: number, linkIndex: number, field: keyof FooterLink, value: string) => void;
  onRemoveLink: (sectionIndex: number, linkIndex: number) => void;
  onReorderLinks: (sectionIndex: number, oldIndex: number, newIndex: number) => void;
}

function SortableSection({ 
  section, 
  index, 
  onUpdateSection, 
  onRemoveSection, 
  onAddLink, 
  onUpdateLink, 
  onRemoveLink, 
  onReorderLinks 
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `section-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative">
        <div 
          {...listeners} 
          className="absolute -left-8 top-4 cursor-grab hover:cursor-grabbing p-2 rounded-md hover:bg-muted/50 transition-colors"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <DraggableFooterSection
          section={section}
          sectionIndex={index}
          onUpdateSection={onUpdateSection}
          onRemoveSection={onRemoveSection}
          onAddLink={onAddLink}
          onUpdateLink={onUpdateLink}
          onRemoveLink={onRemoveLink}
          onReorderLinks={onReorderLinks}
        />
      </div>
    </div>
  );
}

const SECTION_TEMPLATES = [
  {
    title: 'Company',
    links: [
      { text: 'About Us', url: '/about' },
      { text: 'Contact', url: '/contact' },
      { text: 'Careers', url: '/careers' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { text: 'Privacy Policy', url: '/privacy' },
      { text: 'Terms of Service', url: '/terms' },
      { text: 'Cookie Policy', url: '/cookies' }
    ]
  },
  {
    title: 'Support',
    links: [
      { text: 'Help Center', url: '/help' },
      { text: 'FAQ', url: '/faq' },
      { text: 'Contact Support', url: '/support' }
    ]
  }
];

const FooterManagement: React.FC = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSiteSettings = useUpdateSiteSettings();
  const { toast } = useToast();
  const [showExternalLinkDialog, setShowExternalLinkDialog] = useState(false);
  const [newExternalLink, setNewExternalLink] = useState({ text: '', url: '' });
  const [currentSectionForLink, setCurrentSectionForLink] = useState<number>(0);

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
      instagram: '',
      youtube: ''
    },
    sections: [],
    showNewsletter: true,
    copyrightText: 'All rights reserved.'
  };

  const [formData, setFormData] = useState<FooterSettings>(footerSettings);

  useEffect(() => {
    setFormData(footerSettings);
  }, [settings]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSave = async () => {
    try {
      await updateSiteSettings.mutateAsync({
        key: 'footer_settings',
        value: formData
      });
      
      toast({ 
        title: 'Footer settings saved successfully!',
        description: 'Your changes have been applied to the website.'
      });
    } catch (error: any) {
      toast({
        title: 'Failed to save footer settings',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const addSection = (template?: FooterSection) => {
    const newSection = template || { title: '', links: [] };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
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

  const addLink = (sectionIndex: number, link?: FooterLink) => {
    const newLink: FooterLink = link || { text: '', url: '' };
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

  const updateLink = (sectionIndex: number, linkIndex: number, field: keyof FooterLink, value: string) => {
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

  const reorderSections = (oldIndex: number, newIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: arrayMove(prev.sections, oldIndex, newIndex)
    }));
  };

  const reorderLinks = (sectionIndex: number, oldIndex: number, newIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, links: arrayMove(section.links, oldIndex, newIndex) }
          : section
      )
    }));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeIndex = parseInt(active.id.split('-')[1]);
      const overIndex = parseInt(over.id.split('-')[1]);
      
      reorderSections(activeIndex, overIndex);
    }
  };

  const handlePageSelect = (page: { title: string; url: string }, sectionIndex: number) => {
    addLink(sectionIndex, { text: page.title, url: page.url });
    toast({
      title: 'Page added!',
      description: `"${page.title}" has been added to the footer section.`
    });
  };

  const handleExternalLinkAdd = (sectionIndex: number) => {
    setCurrentSectionForLink(sectionIndex);
    setShowExternalLinkDialog(true);
  };

  const addExternalLink = () => {
    if (newExternalLink.text && newExternalLink.url) {
      addLink(currentSectionForLink, newExternalLink);
      setNewExternalLink({ text: '', url: '' });
      setShowExternalLinkDialog(false);
      toast({
        title: 'External link added!',
        description: `"${newExternalLink.text}" has been added to the footer section.`
      });
    }
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
          <Layout className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Footer Management</h2>
          <div className="ml-2 px-2 py-1 bg-gradient-primary text-primary-foreground text-xs rounded-full font-medium">
            Enhanced
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={updateSiteSettings.isPending}
          className="shadow-glow"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSiteSettings.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Footer Sections
          </TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-6">
          {/* Enhanced Header with Prominent Add Section Area */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Layout className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Footer Sections Manager</h3>
              </div>
              <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                Create organized footer sections with drag-and-drop functionality. Start with templates or build custom sections.
              </p>
            </div>

            {/* Prominent Add Section Buttons */}
            <div className="bg-background/80 backdrop-blur border-2 border-dashed border-primary/30 rounded-lg p-6">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add New Footer Section
                </h4>
                <p className="text-sm text-muted-foreground">
                  Choose a pre-built template or create a custom section from scratch
                </p>
              </div>

              {/* Template Buttons - More Prominent */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                {SECTION_TEMPLATES.map((template, index) => (
                  <Button
                    key={index}
                    onClick={() => addSection(template)}
                    variant="outline"
                    className="h-16 flex-col gap-2 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 text-primary" />
                    <span className="font-medium">{template.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {template.links.length} links included
                    </span>
                  </Button>
                ))}
                
                {/* Custom Section Button */}
                <Button
                  onClick={() => addSection()}
                  variant="default"
                  className="h-16 flex-col gap-2 bg-gradient-primary hover:shadow-glow transition-all duration-200"
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Custom Section</span>
                  <span className="text-xs opacity-90">
                    Start from scratch
                  </span>
                </Button>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">
                  💡 Quick Tips:
                </h5>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Use templates for common sections like Company, Legal, or Support</li>
                  <li>• Drag sections to reorder them in your footer</li>
                  <li>• Add pages from your site or external links to any section</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="relative pl-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={formData.sections.map((_, i) => `section-${i}`)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6">
                  {formData.sections.map((section, index) => (
                    <div key={`section-${index}`} className="space-y-4">
                      <SortableSection
                        section={section}
                        index={index}
                        onUpdateSection={updateSection}
                        onRemoveSection={removeSection}
                        onAddLink={addLink}
                        onUpdateLink={updateLink}
                        onRemoveLink={removeLink}
                        onReorderLinks={reorderLinks}
                      />
                      
                      <Card className="bg-muted/20 border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-muted-foreground">
                            Add Links to "{section.title || 'Section'}"
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>How to add links:</strong> Click "Copy Link" on any page below to copy its URL, then paste it in the footer link URL field. All footer links will open in new tabs.
                            </p>
                          </div>
                          <ContentBrowser 
                            onContentSelect={(content) => handlePageSelect(content, index)}
                            onExternalLinkAdd={() => handleExternalLinkAdd(index)}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {formData.sections.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Layout className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to organize your footer!</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Your footer sections will appear here once you add them using the buttons above.
              </p>
              <p className="text-sm text-primary font-medium">
                ↑ Click any "Add Section" button above to get started
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
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
              <CardDescription>Social media profiles for your brand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/@yourcompany"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
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
        </TabsContent>
      </Tabs>

      {/* External Link Dialog */}
      {showExternalLinkDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add External Link</CardTitle>
              <CardDescription>Add a link to an external website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-text">Link Text</Label>
                <Input
                  id="link-text"
                  placeholder="Enter link text"
                  value={newExternalLink.text}
                  onChange={(e) => setNewExternalLink(prev => ({ ...prev, text: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={newExternalLink.url}
                  onChange={(e) => setNewExternalLink(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowExternalLinkDialog(false);
                    setNewExternalLink({ text: '', url: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addExternalLink}>
                  Add Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FooterManagement;