// never ever put your api key in the client side code for a real, production product
// always put it in the server side code
// this is ONLY for this project's demo purposes
export const API_CONFIG = {
  BASE_URL: 'https://sexezjrgbglotgmkdkvt.supabase.co/rest/v1',
  STORAGE_URL: 'https://sexezjrgbglotgmkdkvt.supabase.co/storage/v1',
  TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNleGV6anJnYmdsb3RnbWtka3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxOTI3NjEsImV4cCI6MjA1ODc2ODc2MX0.L-0PcWhJOwv7m-FQ-vCT7b3Bt6_XjjiZoyMibfAZWWY',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, 
} as const;

export const API_ENDPOINTS = {
  CLAIMS: '/claims',
  STORAGE: '/object',
} as const; 