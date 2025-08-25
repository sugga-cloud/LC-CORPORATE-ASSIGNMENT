export interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
}

export interface ShortenResponse {
  success: boolean;
  shortUrl: string;
  shortCode: string;
}