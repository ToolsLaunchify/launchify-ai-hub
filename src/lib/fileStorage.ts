import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface VideoAttachment {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export const uploadFileToStorage = async (
  file: File,
  bucket: string = 'product-files'
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload file');
      return null;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    toast.error('Failed to upload file');
    return null;
  }
};

export const deleteFileFromStorage = async (
  url: string,
  bucket: string = 'product-files'
): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('File delete error:', error);
    return false;
  }
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const generateYouTubeThumbnail = (url: string): string => {
  const videoId = extractYouTubeVideoId(url);
  return videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : '/placeholder.svg';
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.includes(type));
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSize;
};