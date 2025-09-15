import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Rocket, ExternalLink } from 'lucide-react';
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

  const socialMedia = siteSettings.social_media || {};
  const footerSections = siteSettings.footer_sections || {};

  const socialLinks = [
    { icon: Twitter, href: socialMedia.twitter, label: 'Twitter', show: !!socialMedia.twitter },
    { icon: Linkedin, href: socialMedia.linkedin, label: 'LinkedIn', show: !!socialMedia.linkedin },
    { icon: Github, href: socialMedia.github, label: 'GitHub', show: !!socialMedia.github },
    { icon: Mail, href: `mailto:${socialMedia.email}`, label: 'Email', show: !!socialMedia.email },
  ].filter(link => link.show);

  const companyPages = pages.filter(page => 
    ['about', 'contact', 'privacy', 'terms'].includes(page.slug)
  );

  const topCategories = categories.slice(0, 6);
  const resourceLinks = footerSections.resources || [
    { label: 'Browse All', href: '/browse' },
    { label: 'AI Tools', href: '/type/ai-tools' },
    { label: 'Software', href: '/type/software' },
    { label: 'Free Tools', href: '/type/free-tools' },
  ];

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
                Tools Launchify
              </span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Discover the latest AI tools, software launches, and digital products. 
              Find everything from productivity apps to creative tools in one curated platform.
            </p>
            
            {/* Newsletter Signup */}
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
          
          {/* Company Links */}
          {companyPages.length > 0 && (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg">Company</h4>
              <ul className="space-y-3">
                {companyPages.map((page) => (
                  <li key={page.id}>
                    <Link
                      to={`/page/${page.slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                    >
                      {page.title}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Categories */}
          {topCategories.length > 0 && (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg">Categories</h4>
              <ul className="space-y-3">
                {topCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                    >
                      <span className="text-sm">{category.icon}</span>
                      {category.name}
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {category.product_count}
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    to="/categories"
                    className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    View all categories
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          
          {/* Resources */}
          {resourceLinks.length > 0 && (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg">Resources</h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              © {currentYear} Tools Launchify. All rights reserved.
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