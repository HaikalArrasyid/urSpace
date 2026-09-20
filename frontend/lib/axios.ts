import axios from 'axios';
import { parseCookies } from 'nookies';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Auto-inject token
apiClient.interceptors.request.use((config) => {
  // Always attach Maker Key per spec definition (even though Backend won't parse it in our offline variant, it's good practice)
  config.headers['x-maker-key'] = 'mk_local_exam_override';

  const cookies = parseCookies();
  const token = cookies.access_token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Standardize logging or handle 401s globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If not authenticated, we could redirect to /login here or handle it per comp
    return Promise.reject(error);
  }
);

export default apiClient;
