import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import CombinedLaunchesSection from '@/components/CombinedLaunchesSection';
import ProductsByCategorySection from '@/components/ProductsByCategorySection';
import CategoriesSection from '@/components/CategoriesSection';
import ProductTypeSections from '@/components/ProductTypeSections';

const HomepageClassic: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Browse by Tool Type - Right after Hero */}
      <ProductTypeSections />

      {/* Combined Latest Launches & Featured Products */}
      <CombinedLaunchesSection />

      {/* Products by Category - Main Categories */}
      <ProductsByCategorySection />

      {/* Categories Section */}
      <CategoriesSection />
    </div>
  );
};

export default HomepageClassic;