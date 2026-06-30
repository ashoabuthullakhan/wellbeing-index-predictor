import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in Authorization header automatically
api.interceptors.request.use(
  (config) => {
    try {
      const userJSON = localStorage.getItem('hdiUser');
      if (userJSON) {
        const user = JSON.parse(userJSON);
        if (user && user.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      console.error('Failed to parse user details for auth header:', e.message);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Auth ──
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Registration failed.';
    throw new Error(errorMessage);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Login failed.';
    throw new Error(errorMessage);
  }
};

// ── Predictions ──
export const predictHDI = async (data) => {
  try {
    const response = await api.post('/predict', data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to get prediction from backend server.';
    throw new Error(errorMessage);
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to retrieve history from backend server.';
    throw new Error(errorMessage);
  }
};

export const deletePrediction = async (id) => {
  try {
    const response = await api.delete(`/predict/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to delete prediction.';
    throw new Error(errorMessage);
  }
};


// ── Chat (Gemini AI) ──
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await api.post('/chat', { message, conversationHistory });
    return response.data;
  } catch (error) {
    if (error.response?.status === 402) {
      throw new Error('OUT_OF_CREDITS');
    }
    const errorMessage = error.response?.data?.error || 'Failed to get AI response.';
    throw new Error(errorMessage);
  }
};

// ── User Profile ──
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch profile.';
    throw new Error(errorMessage);
  }
};

// ── Payments (Phase 3 prep) ──
export const createCheckoutSession = async (packId) => {
  try {
    const response = await api.post('/payments/create-checkout-session', { packId });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to create checkout session.';
    throw new Error(errorMessage);
  }
};

export const verifyCheckoutSession = async (sessionId) => {
  try {
    const response = await api.post('/payments/verify-session', { sessionId });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to verify payment.';
    throw new Error(errorMessage);
  }
};

// ── Blog (Phase 4 prep) ──
export const getBlogPosts = async () => {
  try {
    const response = await api.get('/blog');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch blog posts.';
    throw new Error(errorMessage);
  }
};

export const getBlogPost = async (slug) => {
  try {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch blog post.';
    throw new Error(errorMessage);
  }
};

export default api;
