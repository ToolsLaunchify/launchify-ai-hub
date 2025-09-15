import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (leadId: string) => void;
  productId: string;
  productName: string;
}

export const EmailCollectionModal: React.FC<EmailCollectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced source detection
  const getSourceInfo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let source = urlParams.get('utm_source');
    let medium = urlParams.get('utm_medium');
    let campaign = urlParams.get('utm_campaign');

    // Check session storage for persisted UTM parameters
    if (!source) {
      const storedSource = sessionStorage.getItem('utm_source');
      const storedMedium = sessionStorage.getItem('utm_medium');
      const storedCampaign = sessionStorage.getItem('utm_campaign');
      
      if (storedSource) {
        source = storedSource;
        medium = storedMedium;
        campaign = storedCampaign;
      } else {
        // Detect source from referrer
        const referrer = document.referrer;
        if (referrer) {
          if (referrer.includes('youtube.com') || referrer.includes('youtu.be')) {
            source = 'youtube';
            medium = 'referral';
          } else if (referrer.includes('facebook.com') || referrer.includes('fb.com')) {
            source = 'facebook';
            medium = 'referral';
          } else if (referrer.includes('instagram.com')) {
            source = 'instagram';
            medium = 'referral';
          } else if (referrer.includes('linkedin.com')) {
            source = 'linkedin';
            medium = 'referral';
          } else if (referrer.includes('google.com')) {
            source = 'google';
            medium = 'search';
          } else if (referrer.includes('twitter.com') || referrer.includes('t.co')) {
            source = 'twitter';
            medium = 'referral';
          } else {
            source = 'referral';
            medium = 'website';
          }
        } else {
          source = 'direct';
          medium = 'none';
        }
      }
    }

    // Store UTM parameters for future use
    if (source) sessionStorage.setItem('utm_source', source);
    if (medium) sessionStorage.setItem('utm_medium', medium);
    if (campaign) sessionStorage.setItem('utm_campaign', campaign);

    return { utm_source: source, utm_medium: medium, utm_campaign: campaign };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const sourceInfo = getSourceInfo();
      
      const leadData = {
        product_id: productId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        utm_source: sourceInfo.utm_source,
        utm_medium: sourceInfo.utm_medium,
        utm_campaign: sourceInfo.utm_campaign,
        ip_address: null, // Will be handled by backend if needed
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) {
        console.error('Error saving lead:', error);
        toast.error('Failed to save your information. Please try again.');
        return;
      }

      toast.success('Thank you! Redirecting to the product page...');
      onSuccess(data.id);
      
      // Reset form
      setFormData({ name: '', email: '', phone: '' });
      onClose();

    } catch (error) {
      console.error('Error in email collection:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Get Instant Access to {productName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Access'
              )}
            </Button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          We respect your privacy. Your information will only be used to provide you with the requested product access.
        </p>
      </DialogContent>
    </Dialog>
  );
};