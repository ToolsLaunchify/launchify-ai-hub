import React, { useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  accept?: string;
  maxSizeInMB?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucket = 'blog-images',
  folder = '',
  accept = 'image/*',
  maxSizeInMB = 5,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `File size must be less than ${maxSizeInMB}MB`,
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
      toast({
        title: 'Upload successful',
        description: 'Image has been uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="image-upload">Image Upload</Label>
          <div className="mt-1">
            {!value ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <div className="mt-4">
                  <Label htmlFor="file-input" className="cursor-pointer">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary hover:text-primary/80">
                        Click to upload
                      </span>
                      {' '}or drag and drop
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to {maxSizeInMB}MB
                    </div>
                  </Label>
                  <Input
                    id="file-input"
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={value}
                  alt="Uploaded image"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {!uploading && !value && (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
};