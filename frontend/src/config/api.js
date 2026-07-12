const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://ai-chatbox-2056.onrender.com').replace(/\/$/, '');
export const API_BASE_URL = `${BASE_URL}/api`;
export default API_BASE_URL;
