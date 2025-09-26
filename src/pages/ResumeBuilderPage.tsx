import React from 'react';
import { Link } from 'react-router-dom';
import ResumeBuilder from '@/components/tools/ResumeBuilder';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, LogIn } from 'lucide-react';

const ResumeBuilderPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Resume Builder</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to create and manage your professional resumes.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/auth?mode=signin">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/auth?mode=signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ResumeBuilder />;
};

export default ResumeBuilderPage;