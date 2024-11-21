import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios'; // Ensure this axios instance is set up with baseURL and interceptors.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get('/users'); // Replace with the correct endpoint
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout(); // Clear token and reset state if auth check fails
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials); // Adjust endpoint as needed
      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Attach token to axios header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state
      setUser(user);

      // Redirect to the dashboard or homepage
      navigate('/');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);

    // Redirect to login page
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
