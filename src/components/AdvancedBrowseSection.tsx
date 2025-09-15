import React from 'react';
import { ArrowRight, Grid, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useProductStats } from '@/hooks/useProductStats';

const AdvancedBrowseSection: React.FC = () => {
  const { data: stats } = useProductStats();

  const features = [
    {
      icon: Grid,
      title: 'Browse by Category',
      description: 'Explore products organized by categories with intelligent filtering'
    },
    {
      icon: Filter,
      title: 'Advanced Filters',
      description: 'Find exactly what you need with smart filtering options'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Powerful search with autocomplete and suggestions'
    }
  ];

  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Explore Our Complete Product Catalog
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Discover thousands of tools, software, and digital products with our advanced browsing experience
            </p>
            
            {stats && (
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {stats.total.toLocaleString()} Total Products
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {stats.ai_tools.toLocaleString()} AI Tools
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {stats.software.toLocaleString()} Software
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {stats.free_tools.toLocaleString()} Free Tools
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {stats.digital_products.toLocaleString()} Digital Products
                </Badge>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-card rounded-3xl border border-border/50 p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Find Your Perfect Tool?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Access our advanced product browser with category navigation, smart filters, 
              and multiple view options to find exactly what you're looking for.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="min-w-[200px] group">
                  Browse All Products
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/search">
                <Button variant="accent" size="lg" className="min-w-[200px]">
                  <Search className="w-5 h-5 mr-2" />
                  Advanced Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedBrowseSection;