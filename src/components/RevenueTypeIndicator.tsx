import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, Gift, Shuffle } from 'lucide-react';

interface RevenueTypeIndicatorProps {
  revenueType: 'affiliate' | 'payment' | 'free';
  size?: 'sm' | 'md' | 'lg';
}

export const RevenueTypeIndicator: React.FC<RevenueTypeIndicatorProps> = ({ 
  revenueType, 
  size = 'sm' 
}) => {
  const getRevenueConfig = (type: string) => {
    switch (type) {
      case 'affiliate':
        return {
          label: 'Affiliate',
          variant: 'secondary' as const,
          icon: DollarSign,
          className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100'
        };
      case 'payment':
        return {
          label: 'Direct Payment Page',
          variant: 'default' as const,
          icon: CreditCard,
          className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100'
        };
      case 'free':
        return {
          label: 'Free',
          variant: 'outline' as const,
          icon: Gift,
          className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100'
        };
      default:
        return {
          label: 'Free',
          variant: 'outline' as const,
          icon: Gift,
          className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100'
        };
    }
  };

  const config = getRevenueConfig(revenueType);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${size === 'lg' ? 'px-3 py-1 text-sm' : size === 'md' ? 'px-2 py-1 text-xs' : 'px-1.5 py-0.5 text-xs'}`}>
      <Icon className={`${size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />
      {config.label}
    </Badge>
  );
};