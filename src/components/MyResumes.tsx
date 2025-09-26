import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Download, 
  Share2,
  Clock,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useResumes, useDeleteResume } from '@/hooks/useResumes';
import { formatDistance } from 'date-fns';

const MyResumes: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);
  
  const { data: resumes, isLoading } = useResumes();
  const deleteResume = useDeleteResume();

  const handleCreateResume = () => {
    navigate('/tools/resume-builder');
  };

  const handleEditResume = (resumeId: string) => {
    navigate(`/tools/resume-builder?id=${resumeId}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteResumeId) return;

    try {
      await deleteResume.mutateAsync(deleteResumeId);
      toast({
        title: "Resume Deleted",
        description: "Your resume has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteResumeId(null);
    }
  };

  const handleExport = (resumeId: string) => {
    toast({
      title: "Export Feature",
      description: "Export functionality will be available soon!",
    });
  };

  const handleShare = (resumeId: string) => {
    toast({
      title: "Share Feature", 
      description: "Sharing functionality will be available soon!",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground">
            Create and manage your professional resumes
          </p>
        </div>
        <Button onClick={handleCreateResume}>
          <Plus className="w-4 h-4 mr-2" />
          Create Resume
        </Button>
      </div>

      {/* Resumes Grid */}
      {resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{resume.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {resume.templates?.name || 'No Template'}
                      </Badge>
                      {resume.is_public && (
                        <Badge variant="secondary" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditResume(resume.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(resume.id)}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(resume.id)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteResumeId(resume.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent onClick={() => handleEditResume(resume.id)}>
                {/* Resume Preview */}
                <div className="aspect-[8.5/11] bg-gradient-subtle rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                    <div className="text-center w-full">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-primary/50" />
                      <div className="space-y-2">
                        <div className="w-full h-2 bg-primary/20 rounded"></div>
                        <div className="w-3/4 h-2 bg-primary/15 rounded mx-auto"></div>
                        <div className="w-1/2 h-2 bg-primary/15 rounded mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Meta Information */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDistance(new Date(resume.created_at), new Date(), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatDistance(new Date(resume.updated_at), new Date(), { addSuffix: true })}</span>
                  </div>
                  <div className="text-xs">
                    {resume.sections.length} sections
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gradient-subtle rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first professional resume to get started
            </p>
            <Button onClick={handleCreateResume}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Resume
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteResumeId} onOpenChange={() => setDeleteResumeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyResumes;