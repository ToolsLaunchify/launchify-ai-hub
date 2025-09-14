import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, Filter } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import CombinedLaunchesSection from '@/components/CombinedLaunchesSection';
import ProductsByCategorySection from '@/components/ProductsByCategorySection';
import CategoriesSection from '@/components/CategoriesSection';
import ProductTypeSections from '@/components/ProductTypeSections';
import ProductCard from '@/components/ProductCard';
import { useProducts, useFreeToolsByCategory } from '@/hooks/useProducts';

const Homepage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Combined Latest Launches & Featured Products */}
      <CombinedLaunchesSection />

      {/* Products by Category - Main Categories */}
      <ProductsByCategorySection />

      {/* Browse by Tool Type - Moved before Categories */}
      <ProductTypeSections />

      {/* Categories Section */}
      <CategoriesSection />
    </div>
  );
};

export default Homepage;