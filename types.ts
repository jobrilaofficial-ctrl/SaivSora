export interface VideoMetadata {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  resolutions: VideoResolution[];
}

export interface VideoResolution {
  label: string; // e.g., "1080p", "4K"
  size: string;  // e.g., "12.5 MB"
  format: string; // e.g., "MP4"
  url: string;
}

export enum FetchState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ApiError {
  message: string;
  code?: string;
}