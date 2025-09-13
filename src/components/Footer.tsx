import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/tools-launchify-logo.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    categories: [
      { label: 'AI Tools', href: '/category/ai-tools' },
      { label: 'Design Software', href: '/category/design' },
      { label: 'Productivity', href: '/category/productivity' },
      { label: 'Marketing Tools', href: '/category/marketing' },
      { label: 'Developer Tools', href: '/category/developer' },
      { label: 'Analytics', href: '/category/analytics' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Free Tools', href: '/free-tools' },
      { label: 'Featured Products', href: '/featured' },
      { label: 'Most Saved', href: '/most-saved' },
      { label: 'Submit Tool', href: '/submit' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/toolslaunchify', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/toolslaunchify', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/toolslaunchify', label: 'GitHub' },
    { icon: Mail, href: 'mailto:hello@toolslaunchify.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gradient-card border-t border-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Tools Launchify" className="h-8 w-8" />
              <span className="text-xl font-bold text-gradient-primary">Tools Launchify</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover the latest AI tools, software launches, and digital products. 
              Find everything from productivity apps to creative tools in one place.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/50"
                />
                <Button variant="hero" className="shrink-0">
                  <Rocket className="h-4 w-4 mr-1" />
                  Subscribe
                </Button>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:text-primary"
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
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-muted mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Tools Launchify. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Made with ❤️ for the tech community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;