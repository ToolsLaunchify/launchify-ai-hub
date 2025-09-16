import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Rocket, ExternalLink, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { usePages } from '@/hooks/usePages';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useNewsletterSubscribe } from '@/hooks/useNewsletter';
import logo from '@/assets/tools-launchify-logo.png';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();
  
  const { data: siteSettings = {} } = useSiteSettings();
  const { data: pages = [] } = usePages();
  const { data: categories = [] } = useCategoryStats();
  const subscribeNewsletter = useNewsletterSubscribe();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeNewsletter.mutate(email);
      setEmail('');
    }
  };

  // Get footer settings from site_settings
  const footerSettings = siteSettings?.footer_settings || {
    companyName: 'Tools Launchify',
    description: 'Discover the latest AI tools, software launches, and digital products.',
    email: 'hello@toolslaunchify.com',
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

  const socialLinks = [
    { icon: Twitter, href: footerSettings.socialLinks?.twitter, label: 'Twitter', show: !!footerSettings.socialLinks?.twitter },
    { icon: Linkedin, href: footerSettings.socialLinks?.linkedin, label: 'LinkedIn', show: !!footerSettings.socialLinks?.linkedin },
    { icon: Youtube, href: footerSettings.socialLinks?.youtube, label: 'YouTube', show: !!footerSettings.socialLinks?.youtube },
    { icon: Mail, href: `mailto:${footerSettings.email}`, label: 'Email', show: !!footerSettings.email },
  ].filter(link => link.show);

  const companyPages = pages.filter(page => 
    ['about', 'contact', 'privacy', 'terms'].includes(page.slug)
  );

  const topCategories = categories.slice(0, 6);

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-t border-border/40">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={logo} alt="Tools Launchify" className="h-10 w-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-md opacity-50" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {footerSettings.companyName}
              </span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {footerSettings.description}
            </p>
            
            {/* Newsletter Signup */}
            {footerSettings.showNewsletter && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Stay Updated</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/80 backdrop-blur-sm border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                      disabled={subscribeNewsletter.isPending}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <Button 
                    type="submit" 
                    className="shrink-0 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl px-6 py-2 transition-all hover:shadow-lg hover:shadow-primary/25"
                    disabled={subscribeNewsletter.isPending}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    {subscribeNewsletter.isPending ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              </div>
            )}
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-10 w-10 rounded-xl bg-muted/30 hover:bg-muted/60 hover:text-primary transition-all hover:scale-105"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Dynamic Footer Sections */}
          {footerSettings.sections?.map((section, index) => (
            <div key={index} className="space-y-6">
              <h4 className="font-semibold text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                      >
                        {link.text}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                      >
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Browse/Resources - Always show as fallback */}
          {(!footerSettings.sections || footerSettings.sections.length < 2) && (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg">Browse</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/browse" className="text-muted-foreground hover:text-primary transition-colors">
                    All Tools
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                {companyPages.slice(0, 2).map((page) => (
                  <li key={page.id}>
                    <Link to={`/page/${page.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-border/40 mt-16 pt-8">
          <div className="flex flex-col items-center text-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} {footerSettings.companyName}. {footerSettings.copyrightText}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Made with ❤️ for the tech community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;