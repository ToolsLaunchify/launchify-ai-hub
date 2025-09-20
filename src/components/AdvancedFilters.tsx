import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface AdvancedFiltersProps {
  showFeaturedOnly: boolean;
  onShowFeaturedOnlyChange: (value: boolean) => void;
  showNewOnly: boolean;
  onShowNewOnlyChange: (value: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  showFreeOnly: boolean;
  onShowFreeOnlyChange: (value: boolean) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  showFeaturedOnly,
  onShowFeaturedOnlyChange,
  showNewOnly,
  onShowNewOnlyChange,
  priceRange,
  onPriceRangeChange,
  showFreeOnly,
  onShowFreeOnlyChange
}) => {
  return (
    <div className="space-y-6">
      <Separator />
      
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Advanced Filters</h3>
        
        {/* Featured Filter */}
        <div className="flex items-center justify-between">
          <Label htmlFor="featured-filter" className="text-sm">
            Featured Only
          </Label>
          <Switch
            id="featured-filter"
            checked={showFeaturedOnly}
            onCheckedChange={onShowFeaturedOnlyChange}
          />
        </div>

        {/* New Products Filter */}
        <div className="flex items-center justify-between">
          <Label htmlFor="new-filter" className="text-sm">
            Newly Launched
          </Label>
          <Switch
            id="new-filter"
            checked={showNewOnly}
            onCheckedChange={onShowNewOnlyChange}
          />
        </div>

        {/* Free Only Filter */}
        <div className="flex items-center justify-between">
          <Label htmlFor="free-filter" className="text-sm">
            Free Tools Only
          </Label>
          <Switch
            id="free-filter"
            checked={showFreeOnly}
            onCheckedChange={onShowFreeOnlyChange}
          />
        </div>

        {/* Price Range Filter */}
        {!showFreeOnly && (
          <div className="space-y-3">
            <Label className="text-sm">Price Range</Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilters;