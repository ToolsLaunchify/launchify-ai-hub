import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type ProductType = 'ai_tools' | 'software' | 'free_tools' | 'paid_tools';

interface UseProductTypeFilterOptions {
  defaultType?: ProductType;
  syncWithUrl?: boolean;
}

export const useProductTypeFilter = (options: UseProductTypeFilterOptions = {}) => {
  const { defaultType = 'ai_tools', syncWithUrl = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialType = (): ProductType => {
    if (!syncWithUrl) return defaultType;
    
    const urlType = searchParams.get('tab') as ProductType;
    // Don't allow paid_tools tab for now (hidden until we have paid products)
    if (urlType === 'paid_tools') return defaultType;
    
    const validTypes: ProductType[] = ['ai_tools', 'software', 'free_tools', 'paid_tools'];
    return validTypes.includes(urlType) ? urlType : defaultType;
  };

  const [activeType, setActiveType] = useState<ProductType>(getInitialType());

  const handleTypeChange = (type: ProductType) => {
    setActiveType(type);
    
    if (syncWithUrl) {
      setSearchParams({ tab: type });
    }
  };

  // Sync with URL changes
  useEffect(() => {
    if (!syncWithUrl) return;
    
    const urlType = searchParams.get('tab') as ProductType;
    if (urlType && urlType !== activeType && urlType !== 'paid_tools') {
      const validTypes: ProductType[] = ['ai_tools', 'software', 'free_tools'];
      if (validTypes.includes(urlType)) {
        setActiveType(urlType);
      }
    }
  }, [searchParams, syncWithUrl, activeType]);

  return {
    activeType,
    setActiveType: handleTypeChange,
  };
};
