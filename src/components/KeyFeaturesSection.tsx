import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  Clock, 
  Smartphone, 
  Settings,
  Check,
  Sparkles,
  Target,
  Lightbulb
} from 'lucide-react';

interface Product {
  name: string;
  description?: string;
  rich_description?: string;
  is_free: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_newly_launched: boolean;
  is_editors_choice: boolean;
  product_type?: string;
}

interface KeyFeaturesProps {
  product: Product;
}

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes('fast') || lowerFeature.includes('speed') || lowerFeature.includes('quick')) {
    return <Zap className="h-5 w-5" />;
  }
  if (lowerFeature.includes('secure') || lowerFeature.includes('security') || lowerFeature.includes('safe')) {
    return <Shield className="h-5 w-5" />;
  }
  if (lowerFeature.includes('global') || lowerFeature.includes('worldwide') || lowerFeature.includes('web')) {
    return <Globe className="h-5 w-5" />;
  }
  if (lowerFeature.includes('user') || lowerFeature.includes('team') || lowerFeature.includes('collaborate')) {
    return <Users className="h-5 w-5" />;
  }
  if (lowerFeature.includes('time') || lowerFeature.includes('24/7') || lowerFeature.includes('instant')) {
    return <Clock className="h-5 w-5" />;
  }
  if (lowerFeature.includes('mobile') || lowerFeature.includes('responsive') || lowerFeature.includes('app')) {
    return <Smartphone className="h-5 w-5" />;
  }
  if (lowerFeature.includes('custom') || lowerFeature.includes('configur') || lowerFeature.includes('setting')) {
    return <Settings className="h-5 w-5" />;
  }
  if (lowerFeature.includes('easy') || lowerFeature.includes('simple') || lowerFeature.includes('user-friendly')) {
    return <Check className="h-5 w-5" />;
  }
  if (lowerFeature.includes('ai') || lowerFeature.includes('smart') || lowerFeature.includes('intelligent')) {
    return <Sparkles className="h-5 w-5" />;
  }
  if (lowerFeature.includes('target') || lowerFeature.includes('focus') || lowerFeature.includes('precise')) {
    return <Target className="h-5 w-5" />;
  }
  
  return <Lightbulb className="h-5 w-5" />;
};

const extractFeatures = (description: string): string[] => {
  if (!description) return [];
  
  // Extract features from description using various patterns
  const features = [];
  
  // Look for bullet points or numbered lists
  const bulletPattern = /[•\-\*]\s*([^•\-\*\n]+)/g;
  const numberedPattern = /\d+\.\s*([^\d\n]+)/g;
  
  let match;
  while ((match = bulletPattern.exec(description)) !== null) {
    features.push(match[1].trim());
  }
  
  while ((match = numberedPattern.exec(description)) !== null) {
    features.push(match[1].trim());
  }
  
  // If no bullet points found, try to extract key phrases
  if (features.length === 0) {
    const sentences = description.split(/[.!?]/).filter(s => s.trim().length > 10);
    features.push(...sentences.slice(0, 4).map(s => s.trim()));
  }
  
  return features.slice(0, 6); // Limit to 6 features
};

const getDefaultFeatures = (product: Product): string[] => {
  const features = [];
  
  if (product.is_free) {
    features.push("100% Free to Use");
  }
  
  if (product.is_featured) {
    features.push("Featured Product");
  }
  
  if (product.is_newly_launched) {
    features.push("Latest Technology");
  }
  
  if (product.is_trending) {
    features.push("Trending & Popular");
  }
  
  if (product.is_editors_choice) {
    features.push("Editor's Choice");
  }
  
  // Add product type specific features
  switch (product.product_type) {
    case 'software':
      features.push("Easy to Install", "Cross-Platform Support", "Regular Updates");
      break;
    case 'web_app':
      features.push("No Installation Required", "Browser-Based", "Cloud Storage");
      break;
    case 'mobile_app':
      features.push("Mobile Optimized", "Offline Support", "Push Notifications");
      break;
    case 'saas':
      features.push("Subscription Based", "Scalable Solution", "24/7 Support");
      break;
    case 'api':
      features.push("Developer Friendly", "RESTful API", "Comprehensive Documentation");
      break;
    default:
      features.push("Professional Quality", "User-Friendly Interface", "Reliable Performance");
  }
  
  return features.slice(0, 6);
};

export const KeyFeaturesSection: React.FC<KeyFeaturesProps> = ({ product }) => {
  // Try to extract features from description first
  let features = [];
  
  if (product.rich_description) {
    features = extractFeatures(product.rich_description);
  } else if (product.description) {
    features = extractFeatures(product.description);
  }
  
  // If no features extracted, use default ones
  if (features.length === 0) {
    features = getDefaultFeatures(product);
  }
  
  // Ensure we have at least 3 features
  if (features.length < 3) {
    const defaultFeatures = getDefaultFeatures(product);
    features = [...features, ...defaultFeatures].slice(0, 6);
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold">Key Features</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what makes {product.name} the perfect choice for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    {getFeatureIcon(feature)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {product.is_free && (
            <Badge className="bg-gradient-primary shadow-lg">Free</Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-gradient-accent shadow-lg">Featured</Badge>
          )}
          {product.is_trending && (
            <Badge variant="outline" className="shadow-lg">Trending</Badge>
          )}
          {product.is_newly_launched && (
            <Badge variant="secondary" className="shadow-lg">New Launch</Badge>
          )}
          {product.is_editors_choice && (
            <Badge className="bg-gradient-hero shadow-lg">Editor's Choice</Badge>
          )}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;