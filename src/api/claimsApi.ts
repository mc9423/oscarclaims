// src/services/claimsApi.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { Claim } from '../types/claim';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { ApiError, ApiRequestConfig, ClaimsApiResponse, ClaimApiResponse, UploadApiResponse } from '../types/api';


const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Authorization': API_CONFIG.TOKEN,
  },
});

// request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.debug(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);
    return Promise.reject(error);
  }
);

const handleApiError = (error: AxiosError): ApiError => {
  const apiError: ApiError = {
    message: error.message || 'An unexpected error occurred',
    status: error.response?.status,
    code: error.code,
  };
  return apiError;
};

const withRetry = async <T>(
  operation: () => Promise<T>,
  config: ApiRequestConfig = {}
): Promise<T> => {
  const { retryCount = 0 } = config;
  
  try {
    return await operation();
  } catch (error) {
    if (retryCount < API_CONFIG.MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return withRetry(operation, { ...config, retryCount: retryCount + 1 });
    }
    throw error;
  }
};

export const claimsApi = {
  getClaims: async (config?: ApiRequestConfig): Promise<Claim[]> => {
    try {
      const response = await withRetry<ClaimsApiResponse>(
        () => api.get(API_ENDPOINTS.CLAIMS, {
          params: { apikey: API_CONFIG.TOKEN },
          timeout: config?.timeout,
          signal: config?.cancelToken?.signal,
        }),
        config
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  getClaimById: async (id: string, config?: ApiRequestConfig): Promise<Claim> => {
    try {
      const response = await withRetry<{ data: Claim[] }>(
        () => api.get(API_ENDPOINTS.CLAIMS, {
          params: {
            apikey: API_CONFIG.TOKEN,
            id: `eq.${id}`,
          },
          timeout: config?.timeout,
          signal: config?.cancelToken?.signal,
        }),
        config
      );
      
      if (!response.data[0]) {
        throw new Error(`Claim with ID ${id} not found`);
      }
      
      return response.data[0];
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  createClaim: async (
    claim: Omit<Claim, 'id' | 'submissionDate' | 'status'>,
    config?: ApiRequestConfig
  ): Promise<Claim> => {
    try {
      const id = Math.random().toString(36).substring(7);
      const fullClaim = {
        ...claim,
        submissionDate: new Date().toISOString(),
        status: 'pending',
        id,
      };

      const response = await withRetry<ClaimApiResponse>(
        () => api.post(`${API_ENDPOINTS.CLAIMS}?apikey=${API_CONFIG.TOKEN}`, fullClaim, {
          timeout: config?.timeout,
          signal: config?.cancelToken?.signal,
        }),
        config
      );

      return { ...response.data, id };
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  updateClaim: async (
    id: string,
    claim: Partial<Claim>,
    config?: ApiRequestConfig
  ): Promise<Claim> => {
    try {
      const response = await withRetry<ClaimApiResponse>(
        () => api.patch(
          `${API_ENDPOINTS.CLAIMS}?apikey=${API_CONFIG.TOKEN}&id=eq.${id}`,
          claim,
          {
            timeout: config?.timeout,
            signal: config?.cancelToken?.signal,
          }
        ),
        config
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  uploadDocument: async (
    claimId: string,
    file: File,
    config?: ApiRequestConfig
  ): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${claimId}/${Date.now()}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await withRetry<UploadApiResponse>(
        () => axios.post(
          `${API_CONFIG.STORAGE_URL}${API_ENDPOINTS.STORAGE}/oscar/${fileName}?apikey=${API_CONFIG.TOKEN}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
              'Content-Type': 'multipart/form-data',
            },
            timeout: config?.timeout,
            signal: config?.cancelToken?.signal,
          }
        ),
        config
      );
      
      if (uploadResponse.status !== 200) {
        throw new Error('Failed to upload file');
      }
      
      const publicUrl = `${API_CONFIG.STORAGE_URL}${API_ENDPOINTS.STORAGE}/public/oscar/${fileName}`;
      
      const claim = await claimsApi.getClaimById(claimId, config);
      const updatedDocuments = claim ? [...(claim.documents || []), publicUrl] : [publicUrl];
      
      await claimsApi.updateClaim(claimId, { documents: updatedDocuments }, config);
      
      return publicUrl;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
};
