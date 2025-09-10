/**
 * Frontend Integration Examples for Railway Backend
 * 
 * This file shows how to integrate your frontend with the backend API
 * Works with React, Vue, Angular, or vanilla JavaScript
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Token management
const TokenManager = {
  get: () => localStorage.getItem('auth_token'),
  set: (token) => localStorage.setItem('auth_token', token),
  remove: () => localStorage.removeItem('auth_token'),
  isValid: () => {
    const token = TokenManager.get();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
};

// HTTP Client with automatic token handling
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.get();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message, response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, { error: error.message });
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Custom error class
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Initialize API client
const api = new ApiClient();

// Authentication Service
const AuthService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.success) {
      TokenManager.set(response.data.token);
    }
    return response;
  },

  async login(identifier, password) {
    const response = await api.post('/auth/login', { identifier, password });
    if (response.success) {
      TokenManager.set(response.data.token);
    }
    return response;
  },

  async logout() {
    TokenManager.remove();
    // Optional: Call backend logout endpoint if you implement it
    // await api.post('/auth/logout');
  },

  async getCurrentUser() {
    return await api.get('/auth/me');
  },

  async updateProfile(profileData) {
    return await api.put('/auth/update-profile', profileData);
  },

  async changePassword(currentPassword, newPassword) {
    return await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  isAuthenticated() {
    return TokenManager.isValid();
  },
};

// User Service
const UserService = {
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/users${queryString ? `?${queryString}` : ''}`);
  },

  async getUserById(id) {
    return await api.get(`/users/${id}`);
  },

  async updateUserStatus(id, isActive) {
    return await api.put(`/users/${id}/status?isActive=${isActive}`);
  },

  async updateUserRole(id, role) {
    return await api.put(`/users/${id}/role?role=${role}`);
  },

  async deleteUser(id) {
    return await api.delete(`/users/${id}`);
  },

  async getUserStats() {
    return await api.get('/users/stats/overview');
  },
};

// File Upload Service
const FileService = {
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return await api.post('/upload/profile-picture', formData);
  },

  async uploadFiles(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return await api.post('/upload/files', formData);
  },

  async deleteProfilePicture() {
    return await api.delete('/upload/profile-picture');
  },

  async deleteFile(filename) {
    return await api.delete(`/upload/file/${filename}`);
  },

  async getFileInfo(filename) {
    return await api.get(`/upload/info/${filename}`);
  },
};

// Usage Examples

// 1. Registration Example
async function registerUser() {
  try {
    const userData = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'SecurePass123',
      firstName: 'John',
      lastName: 'Doe',
    };

    const response = await AuthService.register(userData);
    console.log('Registration successful:', response.data.user);
    // Redirect to dashboard or update UI
  } catch (error) {
    console.error('Registration failed:', error.message);
    // Show error message to user
  }
}

// 2. Login Example
async function loginUser() {
  try {
    const response = await AuthService.login('john@example.com', 'SecurePass123');
    console.log('Login successful:', response.data.user);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
    // Show error message
  }
}

// 3. Protected Route Check
function checkAuth() {
  if (!AuthService.isAuthenticated()) {
    // Redirect to login page
    window.location.href = '/login';
  }
}

// 4. Profile Picture Upload
async function uploadProfilePicture(fileInput) {
  try {
    const file = fileInput.files[0];
    if (!file) return;

    // Optional: Show loading state
    const response = await FileService.uploadProfilePicture(file);
    console.log('Profile picture uploaded:', response.data.url);
    // Update UI with new profile picture
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

// 5. Fetch and Display Users (Admin)
async function loadUsers() {
  try {
    const response = await UserService.getUsers({
      page: 1,
      limit: 10,
      search: '',
    });
    
    console.log('Users:', response.data.users);
    console.log('Pagination:', response.data.pagination);
    // Update UI with user list
  } catch (error) {
    console.error('Failed to load users:', error.message);
  }
}

// 6. Error Handling with UI Feedback
async function handleApiCall(apiFunction, successMessage) {
  try {
    const response = await apiFunction();
    showSuccessMessage(successMessage);
    return response;
  } catch (error) {
    if (error.status === 401) {
      // Token expired or invalid
      AuthService.logout();
      window.location.href = '/login';
    } else if (error.status === 403) {
      showErrorMessage('You do not have permission for this action');
    } else if (error.status === 400 && error.data.errors) {
      // Validation errors
      showValidationErrors(error.data.errors);
    } else {
      showErrorMessage(error.message || 'An error occurred');
    }
    throw error;
  }
}

// UI Helper Functions (implement based on your frontend framework)
function showSuccessMessage(message) {
  // Implement toast notification or alert
  console.log('Success:', message);
}

function showErrorMessage(message) {
  // Implement error notification
  console.error('Error:', message);
}

function showValidationErrors(errors) {
  // Display field-specific validation errors
  errors.forEach(error => {
    console.error(`${error.param}: ${error.msg}`);
  });
}

// React Hook Example (if using React)
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (AuthService.isAuthenticated()) {
        try {
          const response = await AuthService.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          AuthService.logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (identifier, password) => {
    const response = await AuthService.login(identifier, password);
    setUser(response.data.user);
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
}

// Export for use in your application
export {
  ApiClient,
  AuthService,
  UserService,
  FileService,
  TokenManager,
  ApiError,
};

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ApiClient,
    AuthService,
    UserService,
    FileService,
    TokenManager,
    ApiError,
  };
}