import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'https://mis.minisports.gov.rw/api'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Your session has expired. Please login again.');
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 500) {
      toast.error('An unexpected error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error, customMessage) => {
  console.error('API Error:', error); // Log full error for debugging
  const message = error.response?.data?.message || customMessage || 'An error occurred';
  toast.error(message);
  throw new Error(message);
};

// SportsForAll-related API calls

/** Fetch all sports events */
export const getSportsEvents = async (params = {}) => {
  try {
    const response = await api.get('/sports-for-all', { params });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch sports events');
  }
};

/** Add a new sports event */
export const addSportsEvent = async (data) => {
  try {
    const response = await api.post('/sports-for-all', data);
    toast.success('Sports event added successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to add sports event');
  }
};

/** Edit an existing sports event */
export const editSportsEvent = async (id, data) => {
  try {
    const response = await api.put(`/sports-for-all/${id}`, data);
    toast.success('Sports event updated successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update sports event');
  }
};

/** Delete a sports event */
export const deleteSportsEvent = async (id) => {
  try {
    const response = await api.delete(`/sports-for-all/${id}`);
    toast.success('Sports event deleted successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to delete sports event');
  }
};

// Partner-related API calls

/** Fetch all partners */
export const getPartners = async () => {
  try {
    const response = await api.get('/partners');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch partners');
  }
};

/** Add a new partner */
export const addPartner = async (data) => {
  try {
    const response = await api.post('/partners', data);
    toast.success('Partner created successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to add partner');
  }
};

/** Edit an existing partner */
export const editPartner = async (id, data) => {
  try {
    const response = await api.put(`/partners/${id}`, data);
    toast.success('Partner updated successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to edit partner');
  }
};

/** Delete a partner */
export const deletePartner = async (id) => {
  try {
    const response = await api.delete(`/partners/${id}`);
    toast.success('Partner deleted successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to delete partner');
  }
};

export default api;
