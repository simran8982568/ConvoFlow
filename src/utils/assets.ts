/**
 * Asset utilities for proper path handling in development and production
 */

/**
 * Get the correct asset path for images, videos, and other static files
 * This ensures compatibility with both development and production builds
 */
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production, assets are served from the root
  // In development, they're served from the public directory
  return `/${cleanPath}`;
};

/**
 * Get template preview image path
 */
export const getTemplatePreviewPath = (templateId?: string): string => {
  if (templateId) {
    return getAssetPath(`assets/templates/${templateId}-preview.svg`);
  }
  return getAssetPath('assets/templates/sample-template.svg');
};

/**
 * Get user avatar path or return default
 */
export const getUserAvatarPath = (avatarUrl?: string): string => {
  if (avatarUrl && !avatarUrl.startsWith('http')) {
    return getAssetPath(`assets/images/${avatarUrl}`);
  }
  return avatarUrl || getAssetPath('assets/images/default-avatar.svg');
};

/**
 * Get business logo path or return default
 */
export const getBusinessLogoPath = (logoUrl?: string): string => {
  if (logoUrl && !logoUrl.startsWith('http')) {
    return getAssetPath(`assets/images/${logoUrl}`);
  }
  return logoUrl || getAssetPath('assets/images/default-logo.svg');
};

/**
 * Validate and process uploaded file for proper storage
 */
export const processUploadedFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('File type not supported'));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error('File size too large (max 10MB)'));
      return;
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    resolve(objectUrl);
  });
};

/**
 * Clean up object URLs to prevent memory leaks
 */
export const cleanupObjectUrl = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Convert file to base64 for storage/transmission
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Download file with proper filename
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Get environment variable with fallback
 */
export const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback;
};
