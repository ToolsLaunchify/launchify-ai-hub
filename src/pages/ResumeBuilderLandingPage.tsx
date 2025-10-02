import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Wand2, 
  Download, 
  CheckCircle2, 
  Star, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import classicTemplate from '@/assets/template-classic.png';
import modernTemplate from '@/assets/template-modern.png';
import creativeTemplate from '@/assets/template-creative.png';
import executiveTemplate from '@/assets/template-executive.png';
import techTemplate from '@/assets/template-tech.png';
import professionalTemplate from '@/assets/template-professional.png';
import minimalTemplate from '@/assets/template-minimal.png';
import academicTemplate from '@/assets/template-academic.png';
import salesTemplate from '@/assets/template-sales.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ResumeBuilderLandingPage: React.FC = () => {
  const templates = [
    { name: 'Classic Professional', image: classicTemplate, tag: 'Most Popular' },
    { name: 'Modern Minimalist', image: modernTemplate, tag: 'Trending' },
    { name: 'Creative Bold', image: creativeTemplate, tag: 'Creative' },
    { name: 'Executive Premium', image: executiveTemplate, tag: 'Premium' },
    { name: 'Tech/Startup', image: techTemplate, tag: 'Tech' },
    { name: 'Professional', image: professionalTemplate, tag: 'Corporate' },
    { name: 'Minimal', image: minimalTemplate, tag: 'Clean' },
    { name: 'Academic', image: academicTemplate, tag: 'Research' },
    { name: 'Sales', image: salesTemplate, tag: 'Sales' },
  ];

  const features = [
    {
      icon: Wand2,
      title: '9 Professional Templates',
      description: 'Choose from designer-crafted templates that stand out'
    },
    {
      icon: Download,
      title: 'High-Quality PDF Export',
      description: 'Download print-ready PDFs optimized for ATS systems'
    },
    {
      icon: Shield,
      title: 'ATS-Friendly',
      description: 'Pass through Applicant Tracking Systems with ease'
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See changes instantly as you build your resume'
    },
    {
      icon: Sparkles,
      title: 'Smart Formatting',
      description: 'Auto-formatted sections that look professional'
    },
    {
      icon: Users,
      title: 'Multiple Resume Management',
      description: 'Create and save unlimited resumes for different roles'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Choose a Template',
      description: 'Pick from 9 professionally designed templates'
    },
    {
      step: 2,
      title: 'Fill Your Information',
      description: 'Add your experience, education, and skills'
    },
    {
      step: 3,
      title: 'Customize & Preview',
      description: 'See real-time preview and adjust as needed'
    },
    {
      step: 4,
      title: 'Download & Apply',
      description: 'Export as PDF and start applying to jobs'
    }
  ];

  const faqs = [
    {
      question: 'What does the Resume Builder cost?',
      answer: 'Contact us for pricing information. We offer flexible plans to suit your needs.'
    },
    {
      question: 'Are the resumes ATS-friendly?',
      answer: 'Absolutely! All our templates are designed to pass through Applicant Tracking Systems (ATS) used by most companies. We use clean formatting and standard fonts.'
    },
    {
      question: 'Can I edit my resume after creating it?',
      answer: 'Yes! All your resumes are saved to your account. You can edit, update, and download them anytime.'
    },
    {
      question: 'What file format are the downloads?',
      answer: 'Resumes are exported as high-quality PDF files, the industry standard for job applications.'
    },
    {
      question: 'Do I need to create an account?',
      answer: 'Yes, an account is required to save your resumes and access them later. Sign up takes less than 30 seconds.'
    },
    {
      question: 'Can I create multiple resumes?',
      answer: 'Yes! Create unlimited resumes for different job applications, industries, or career stages.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Professional Resume Builder - Online CV Maker | Tools Launchify</title>
        <meta name="description" content="Create professional resumes in minutes with our resume builder. Choose from 9 ATS-friendly templates, real-time preview, and high-quality PDF export." />
        <meta property="og:title" content="Professional Resume Builder - Online CV Maker" />
        <meta property="og:description" content="Build stunning resumes with our online resume builder. 9 professional templates, ATS-friendly, instant PDF download." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/tools/resume-builder`} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6">
              <Badge className="bg-gradient-primary text-primary-foreground text-sm px-4 py-1">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                Professional Resume Builder
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Create Your Perfect Resume in
                <span className="text-gradient-primary"> Minutes</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stand out from the crowd with professionally designed resumes. 
                Choose from 9 stunning templates, all optimized for Applicant Tracking Systems.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button asChild size="lg" variant="hero" className="text-lg px-8 py-6">
                  <Link to="/tools/resume-builder/app">
                    Start Building Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 inline text-success mr-1" />
                  No credit card required
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center items-center pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>9 Professional Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>ATS-Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Instant PDF Export</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Preview Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Professional Templates for Every Career
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From classic corporate to creative tech - find the perfect template that matches your industry and personality
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <Card 
                  key={index} 
                  className="hover-lift overflow-hidden group cursor-pointer border-2"
                >
                  <div className="relative overflow-hidden bg-muted">
                    <img 
                      src={template.image} 
                      alt={`${template.name} Resume Template`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {template.tag && (
                      <Badge className="absolute top-3 right-3 bg-gradient-primary text-primary-foreground">
                        {template.tag}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-foreground">
                      {template.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" variant="premium">
                <Link to="/tools/resume-builder/app">
                  Try All Templates
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-card">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Everything You Need to Land Your Dream Job
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to make resume building simple and effective
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover-lift">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Build Your Resume in 4 Simple Steps
              </h2>
              <p className="text-lg text-muted-foreground">
                From template selection to download - it's that easy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-glow">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" variant="default">
                <Link to="/tools/resume-builder/app">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-gradient-card">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our Resume Builder
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border-2 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 bg-gradient-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <FileText className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Build Your Professional Resume?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of job seekers who've created winning resumes with our builder
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6"
            >
              <Link to="/tools/resume-builder/app">
                Start Building Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <p className="mt-4 text-sm opacity-75">
              No credit card required • Takes less than 5 minutes
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default ResumeBuilderLandingPage;
