import { Claim } from './claim';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiRequestConfig {
  retryCount?: number;
  timeout?: number;
  cancelToken?: AbortController;
}

export interface ClaimsApiResponse extends ApiResponse<Claim[]> {}
export interface ClaimApiResponse extends ApiResponse<Claim> {}
export interface UploadApiResponse extends ApiResponse<{ url: string }> {} 