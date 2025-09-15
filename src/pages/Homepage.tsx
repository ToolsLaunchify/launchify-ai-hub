import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import CombinedLaunchesSection from '@/components/CombinedLaunchesSection';
import AdvancedProductTypeSection from '@/components/AdvancedProductTypeSection';
import InteractiveCategoryMatrix from '@/components/InteractiveCategoryMatrix';
import SmartCategoryExplorer from '@/components/SmartCategoryExplorer';
import AdvancedBrowseSection from '@/components/AdvancedBrowseSection';
import VersionToggle from '@/components/VersionToggle';
import HomepageClassic from './HomepageClassic';

const Homepage: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState<'classic' | 'enhanced'>('enhanced');

  useEffect(() => {
    // Check for saved preference
    const savedVersion = localStorage.getItem('homepage-version') as 'classic' | 'enhanced' | null;
    if (savedVersion) {
      setCurrentVersion(savedVersion);
    }
  }, []);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  // Render classic version if selected
  if (currentVersion === 'classic') {
    return (
      <>
        <HomepageClassic />
        <VersionToggle onVersionChange={setCurrentVersion} />
      </>
    );
  }

  // Render enhanced version
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection onSearch={handleSearch} />

        {/* Advanced Browse Section - New Premium Experience */}
        <AdvancedBrowseSection />

        {/* Advanced Product Type Section - Modern Interactive Design */}
        <AdvancedProductTypeSection />

        {/* Combined Latest Launches & Featured Products */}
        <CombinedLaunchesSection />

        {/* Interactive Category Matrix - Advanced Product Discovery */}
        <InteractiveCategoryMatrix />

        {/* Smart Category Explorer - Enhanced Categories Section */}
        <SmartCategoryExplorer />
      </div>
      
      {/* Version Toggle */}
      <VersionToggle onVersionChange={setCurrentVersion} />
    </>
  );
};

export default Homepage;