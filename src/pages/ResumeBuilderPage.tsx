import React from 'react';
import { Navigate } from 'react-router-dom';
import ResumeBuilder from '@/components/tools/ResumeBuilder';
import { useAuth } from '@/hooks/useAuth';

const ResumeBuilderPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <ResumeBuilder />;
};

export default ResumeBuilderPage;