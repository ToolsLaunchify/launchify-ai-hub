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
    // Validate file size before upload
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.isValid) {
      console.error('File size validation failed:', sizeValidation.message);
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log(`Uploading file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB) to bucket: ${bucket}`);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      console.error('File details:', { name: file.name, size: file.size, type: file.type });
      return null;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log(`File uploaded successfully: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    console.error('File details:', { name: file.name, size: file.size, type: file.type });
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

export const getFileSizeLimit = (fileType: string): number => {
  // Size limits in MB based on file type
  if (fileType.includes('video') || fileType.includes('mp4') || fileType.includes('mov') || fileType.includes('avi')) {
    return 200; // 200MB for video files
  }
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z') || 
      fileType.includes('exe') || fileType.includes('msi') || fileType.includes('dmg')) {
    return 500; // 500MB for software/archives
  }
  if (fileType.includes('pdf') || fileType.includes('doc') || fileType.includes('ppt') || 
      fileType.includes('xls') || fileType.includes('txt')) {
    return 100; // 100MB for documents
  }
  return 100; // 100MB default for other files
};

export const validateFileSize = (file: File, customMaxSizeMB?: number): { isValid: boolean; message: string } => {
  const maxSizeMB = customMaxSizeMB || getFileSizeLimit(file.type);
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  const isValid = file.size <= maxSize;
  
  if (!isValid) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      message: `File size (${fileSizeMB}MB) exceeds the limit of ${maxSizeMB}MB for ${file.type} files`
    };
  }
  
  return { isValid: true, message: '' };
};