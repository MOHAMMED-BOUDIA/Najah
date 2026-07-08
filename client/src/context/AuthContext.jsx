import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      id: userData.id || userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department || '',
      avatar: userData.avatar || '',
    };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }
    // Login already set the user — skip redundant /auth/me fetch
    if (user) {
      setLoading(false);
      return;
    }

    // Load cached user instantly so dashboard doesn't skeleton-spin
    const cached = localStorage.getItem('cachedUser');
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch { /* ignore corrupt cache */ }
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/auth/me', { timeout: 15000 });
        const normalized = normalizeUser(response.data);
        setUser(normalized);
        localStorage.setItem('cachedUser', JSON.stringify(normalized));
      } catch (error) {
        const status = error.response?.status;
        console.error('Error fetching current user:', status || error.message);
        if (status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('cachedUser');
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token: receivedToken, user: userData } = response.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      const normalized = normalizeUser(userData);
      setUser(normalized);
      return { success: true, user: normalized };
    } catch (error) {
      console.error('Login error:', error);
      console.log('Login error response:', error.response?.data);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return {
        success: false,
        message,
        emailError: error.response?.data?.emailError || null,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfileState = (updatedUser) => {
    setUser(normalizeUser(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
