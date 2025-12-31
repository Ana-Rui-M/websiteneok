import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Language = 'pt' | 'en';

export function getDisplayName(name: string | { pt: string; en: string; } | undefined, language: Language): string {
  if (!name) {
    return "Product Image"; // Default fallback
  }
  if (typeof name === 'string') {
    return name;
  }
  return name[language] || name.pt || "Product Image";
}

// Normalize image URLs to a loadable https form.
export function normalizeImageUrl(image?: string): string {
  const fallback = 'https://placehold.co/600x400.png';
  if (!image || typeof image !== 'string') return fallback;

  const trimmedImage = image.trim();
  if (!trimmedImage) return fallback;

  // Web URL: sanitize Firebase Storage URLs that may be malformed
  if (trimmedImage.startsWith('http://') || trimmedImage.startsWith('https://')) {
    // If it's a Firebase Storage URL, fix common issues:
    if (/^https?:\/\/firebasestorage\.googleapis\.com\//.test(trimmedImage)) {
      const qIndex = trimmedImage.indexOf('?');
      const base = qIndex >= 0 ? trimmedImage.slice(0, qIndex) : trimmedImage;
      const rest = qIndex >= 0 ? trimmedImage.slice(qIndex + 1).split('?')[0] : '';

      const params = new URLSearchParams(rest);
      const token = params.get('token') || '';
      const downloadTokens = params.get('downloadTokens') || '';
      let finalQuery = 'alt=media';
      if (token) {
        finalQuery = `${finalQuery}&token=${token}`;
      } else if (downloadTokens) {
        finalQuery = `${finalQuery}&downloadTokens=${downloadTokens}`;
      }
      return `${base}?${finalQuery}`;
    }
    return trimmedImage;
  }

  // Convert Firebase Storage gs:// URLs to public https URLs
  if (trimmedImage.startsWith('gs://')) {
    const match = trimmedImage.match(/^gs:\/\/([^\/]+)\/(.+)$/);
    if (match) {
      const bucket = match[1];
      const path = match[2];
      const encodedPath = encodeURIComponent(path);
      return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
    }
    return fallback;
  }

  // Handle relative paths (e.g., products/games/image.jpg)
  if (trimmedImage.includes('/')) {
    // Try both common Firebase buckets if it's a relative path
    const bucket = 'biblioangola.firebasestorage.app'; 
    const encodedPath = encodeURIComponent(trimmedImage.replace(/\\/g, '/'));
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
  }

  return fallback;
}

export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
