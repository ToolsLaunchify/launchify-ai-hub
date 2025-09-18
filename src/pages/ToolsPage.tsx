import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Activity, Wrench, ExternalLink } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const ToolsPage = () => {
  const tools = [
    {
      id: 'percentage-calculator',
      name: 'Percentage Calculator',
      description: 'Calculate percentages, percentage changes, and percentage of totals with ease.',
      icon: Calculator,
      category: 'Math & Finance',
      path: '/tools/percentage-calculator',
      features: ['Basic percentage calculation', 'Percentage change', 'Percent of total'],
      isFree: true
    },
    {
      id: 'bmi-calculator',
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index using metric or imperial units.',
      icon: Activity,
      category: 'Health & Fitness',
      path: '/tools/bmi-calculator',
      features: ['Metric and Imperial units', 'BMI categories', 'Health recommendations'],
      isFree: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Free Online Tools - Tools Launchify"
        metaDescription="Access a collection of free online tools including calculators, converters, and utilities. No registration required."
        keywords={['free tools', 'online calculators', 'web tools', 'utilities']}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2">
            <Wrench className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Free Online Tools</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access our collection of free, easy-to-use online tools. No registration required, 
            works on all devices, and completely free forever.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              ✓ No Registration Required
            </span>
            <span className="flex items-center gap-1">
              ✓ Mobile Friendly
            </span>
            <span className="flex items-center gap-1">
              ✓ Always Free
            </span>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {tool.name}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    {tool.isFree && (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Free
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-3">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link to={tool.path} className="flex items-center gap-2">
                        Use Tool
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>More Tools Coming Soon</CardTitle>
            <CardDescription>
              We're constantly adding new tools to help you be more productive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-secondary/50">
                <Calculator className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Unit Converter</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <Activity className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Password Generator</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <Wrench className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Color Palette</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <Calculator className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">QR Code Generator</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Tool?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have an idea for a tool that would help you and others? Let us know and we might build it next!
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Request a Tool</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;