const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;