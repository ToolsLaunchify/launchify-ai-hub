import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface ProductStatusIndicatorProps {
  hasAffiliateLink: boolean;
  hasPaymentLink: boolean;
  revenueType?: 'affiliate' | 'payment' | 'free' | 'mixed';
}

export const ProductStatusIndicator: React.FC<ProductStatusIndicatorProps> = ({
  hasAffiliateLink,
  hasPaymentLink,
  revenueType,
}) => {
  // Determine product status
  const getStatus = () => {
    if (revenueType === 'free') {
      return { label: 'Free', variant: 'secondary' as const, icon: FileText, color: 'text-blue-600' };
    }
    
    if (hasAffiliateLink || hasPaymentLink) {
      return { label: 'Active', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' };
    }
    
    return { label: 'Incomplete', variant: 'outline' as const, icon: AlertCircle, color: 'text-amber-600' };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <Badge variant={status.variant} className="gap-1">
      <Icon className={`h-3 w-3 ${status.color}`} />
      {status.label}
    </Badge>
  );
};
