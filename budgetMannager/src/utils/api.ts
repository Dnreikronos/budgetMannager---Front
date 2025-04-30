export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  console.log('Token from localStorage:', token); // Debug log
  console.log('Token type:', typeof token); // Debug token type
  console.log('Token length:', token ? token.length : 0); // Debug token length
  
  if (!token) {
    console.warn('No auth token found in localStorage');
    throw new Error('No authentication token found');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  console.log('Request headers:', headers); // Debug log
  console.log('Request URL:', url); // Debug URL
  console.log('Request method:', options.method || 'GET'); // Debug method

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    console.log('Error response:', error); // Debug log
    console.log('Response status:', response.status); // Debug status
    throw new Error(error || 'Request failed');
  }

  return response.json();
}; 