import axios from 'axios';

// Create axios instance with base URL configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Return error message from server or default message
      const errorMessage = data?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
  }
);

// Authentication API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Transaction API functions
export const transactionAPI = {
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  getTransactions: (params) => api.get('/transactions', { params }),
  updateTransaction: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  getMonthlySummary: (params) => api.get('/transactions/monthly-summary', { params }),
};

// Budget API functions
export const budgetAPI = {
  createBudget: (budgetData) => api.post('/budget', budgetData),
  getBudget: (params) => api.get('/budget', { params }),
};

// Subscription API functions
export const subscriptionAPI = {
  createSubscription: (subscriptionData) => api.post('/subscriptions', subscriptionData),
  getSubscriptions: () => api.get('/subscriptions'),
  updateSubscription: (id, subscriptionData) => api.put(`/subscriptions/${id}`, subscriptionData),
  deleteSubscription: (id) => api.delete(`/subscriptions/${id}`),
};

// Portfolio API functions
export const portfolioAPI = {
  createInvestment: (investmentData) => api.post('/portfolio', investmentData),
  getPortfolio: () => api.get('/portfolio'),
};

// Dashboard API functions
export const dashboardAPI = {
  getCategorySpending: (params) => api.get('/dashboard/category-spending', { params }),
  getMonthlyTrends: (params) => api.get('/dashboard/monthly-trends', { params }),
  getIncomeExpense: (params) => api.get('/dashboard/income-expense', { params }),
};

// Category Rule API functions
export const categoryRuleAPI = {
  getCategoryRules: () => api.get('/category-rules'),
  createCategoryRule: (ruleData) => api.post('/category-rules', ruleData),
  updateCategoryRule: (id, ruleData) => api.put(`/category-rules/${id}`, ruleData),
  deleteCategoryRule: (id) => api.delete(`/category-rules/${id}`),
};

// Export the axios instance as default for custom requests
export default api;
