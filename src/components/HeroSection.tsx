import React, { useState } from 'react';
import { Search, Rocket, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const stats = [
    { label: 'AI Tools', value: '500+', icon: Zap },
    { label: 'Software Listed', value: '1,200+', icon: Rocket },
    { label: 'Daily Visitors', value: '10K+', icon: TrendingUp },
  ];

  const popularSearches = [
    'AI Writing Tools',
    'Design Software',
    'Productivity Apps',
    'Marketing Tools',
    'Developer Tools',
    'Analytics Software'
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover the Latest{' '}
            <span className="text-gradient-primary">AI & Software</span>{' '}
            Launches
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find cutting-edge tools, software, and digital products that boost your productivity and creativity
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8 animate-slide-up">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for AI tools, software, digital products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-background/80 backdrop-blur border-muted focus:border-primary shadow-lg h-14"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 bg-gradient-primary hover:opacity-90"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
          
          {/* Popular Searches */}
          <div className="mb-12 animate-slide-up delay-200">
            <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setSearchQuery(search);
                    onSearch?.(search);
                  }}
                  className="px-3 py-1 text-sm bg-muted/50 hover:bg-muted rounded-full transition-colors hover:text-primary"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex justify-center mb-12 animate-slide-up delay-300">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-gradient-primary hover:opacity-90"
              onClick={() => window.location.href = '/categories'}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Explore Tools
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up delay-500">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mb-3">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-gradient-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;