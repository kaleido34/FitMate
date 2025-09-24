const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fitmate-backend.vercel.app';

export const apiUrl = (endpoint) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('🔗 API Call to:', fullUrl);
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('⚙️ API_BASE_URL:', API_BASE_URL);
  return fullUrl;
};

// add some lines