import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Rating {
  id: string;
  rating: number;
  review?: string;
  created_at: string;
  user_id: string;
  user_email?: string;
}

interface ProductRatingProps {
  productId: string;
  productName: string;
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId, productName }) => {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch product ratings
  const { data: ratingsData, isLoading } = useQuery({
    queryKey: ['product-ratings', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_ratings')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Check if user has already rated this product
  const userExistingRating = ratingsData?.find(r => r.user_id === user?.id);

  useEffect(() => {
    if (userExistingRating) {
      setUserRating(userExistingRating.rating);
      setReview(userExistingRating.review || '');
    }
  }, [userExistingRating]);

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async ({ rating, reviewText }: { rating: number; reviewText: string }) => {
      if (!user) throw new Error('Must be logged in to rate');

      if (userExistingRating) {
        // Update existing rating
        const { error } = await supabase
          .from('product_ratings')
          .update({
            rating,
            review: reviewText.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userExistingRating.id);

        if (error) throw error;
      } else {
        // Create new rating
        const { error } = await supabase
          .from('product_ratings')
          .insert({
            product_id: productId,
            user_id: user.id,
            rating,
            review: reviewText.trim() || null,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-ratings', productId] });
      setShowReviewForm(false);
      toast({
        title: 'Rating submitted',
        description: 'Thank you for your feedback!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit rating',
        variant: 'destructive',
      });
    },
  });

  const handleStarClick = (rating: number) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to rate this product',
        variant: 'destructive',
      });
      return;
    }

    setUserRating(rating);
    if (!showReviewForm) {
      setShowReviewForm(true);
    }
  };

  const handleSubmit = () => {
    if (userRating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a star rating',
        variant: 'destructive',
      });
      return;
    }

    submitRatingMutation.mutate({
      rating: userRating,
      reviewText: review,
    });
  };

  const StarRating = ({ 
    rating, 
    interactive = false, 
    size = 'w-5 h-5' 
  }: { 
    rating: number; 
    interactive?: boolean; 
    size?: string;
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => handleStarClick(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = ratingsData && ratingsData.length > 0
    ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratingsData?.filter(r => r.rating === star).length || 0,
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Ratings & Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-foreground">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
            </div>
            {averageRating > 0 && (
              <>
                <StarRating rating={Math.round(averageRating)} />
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {ratingsData.length} review{ratingsData.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>

          {ratingsData && ratingsData.length > 0 && (
            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{star}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: ratingsData.length > 0 ? `${(count / ratingsData.length) * 100}%` : '0%',
                      }}
                    />
                  </div>
                  <span className="w-8 text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Rating Form */}
        {user && (
          <div className="border-t pt-6">
            <h4 className="font-medium mb-3">
              {userExistingRating ? 'Update your rating' : 'Rate this product'}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Your rating:</span>
                <StarRating 
                  rating={hoverRating || userRating} 
                  interactive 
                />
                {userRating > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {userRating} star{userRating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {showReviewForm && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Write a review (optional)..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSubmit}
                      disabled={submitRatingMutation.isPending || userRating === 0}
                    >
                      {submitRatingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowReviewForm(false);
                        setUserRating(userExistingRating?.rating || 0);
                        setReview(userExistingRating?.review || '');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews List */}
        {ratingsData && ratingsData.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Recent Reviews</h4>
            <div className="space-y-4">
              {ratingsData
                .filter(rating => rating.review && rating.review.trim())
                .slice(0, 5)
                .map((rating) => (
                  <div key={rating.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Anonymous User</span>
                            <StarRating rating={rating.rating} size="w-4 h-4" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {rating.review && (
                      <p className="mt-3 text-sm text-foreground">{rating.review}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {!user && (
          <div className="border-t pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Sign in to rate and review this product
            </p>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductRating;