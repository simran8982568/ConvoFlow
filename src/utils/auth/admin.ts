// Admin-specific authentication utilities
export type AdminRole = 'admin';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  name: string;
  company: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

class AdminAuthService {
  private static instance: AdminAuthService;
  private currentUser: AdminUser | null = null;

  static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  // Admin login with email and password
  async login(email: string, password: string): Promise<AdminUser> {
    return new Promise((resolve, reject) => {
      // Mock login - replace with actual API call
      setTimeout(() => {
        if (email && password) {
          const mockUser: AdminUser = {
            id: '1',
            email,
            role: 'admin',
            name: 'Admin User',
            company: 'AyuChat Inc.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            phone: '+1 (555) 123-4567',
            createdAt: new Date().toISOString(),
          };
          
          this.currentUser = mockUser;
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('role', 'admin');
          localStorage.setItem('token', 'admin-jwt-token-' + Date.now());
          
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  // Admin signup
  async signup(userData: {
    name: string;
    email: string;
    company: string;
    password: string;
  }): Promise<AdminUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const mockUser: AdminUser = {
            id: Date.now().toString(),
            email: userData.email,
            role: 'admin',
            name: userData.name,
            company: userData.company,
            createdAt: new Date().toISOString(),
          };
          
          this.currentUser = mockUser;
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('role', 'admin');
          localStorage.setItem('token', 'admin-jwt-token-' + Date.now());
          
          resolve(mockUser);
        } catch (error) {
          reject(new Error('Signup failed'));
        }
      }, 1500);
    });
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset link sent to your email',
        });
      }, 1500);
    });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token && newPassword.length >= 6) {
          resolve({
            success: true,
            message: 'Password reset successfully',
          });
        } else {
          reject(new Error('Invalid token or password'));
        }
      }, 1500);
    });
  }

  // Logout
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  }

  // Get current user
  getCurrentUser(): AdminUser | null {
    if (this.currentUser) return this.currentUser;
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === 'admin') {
          this.currentUser = user;
          return this.currentUser;
        }
      }
    } catch (error) {
      console.warn('Error parsing stored admin user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
    }
    
    return null;
  }

  // Get admin role
  getRole(): AdminRole | null {
    try {
      const role = localStorage.getItem('role');
      return role === 'admin' ? 'admin' : null;
    } catch (error) {
      console.warn('Error getting admin role from localStorage:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const role = this.getRole();
    return !!(user && role === 'admin');
  }

  // Get auth token
  getToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.warn('Error getting admin token:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<AdminUser>): Promise<AdminUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.currentUser) {
          const updatedUser = { ...this.currentUser, ...updates };
          this.currentUser = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          resolve(updatedUser);
        } else {
          reject(new Error('No user logged in'));
        }
      }, 800);
    });
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword && newPassword.length >= 6) {
          resolve({
            success: true,
            message: 'Password changed successfully',
          });
        } else {
          reject(new Error('Invalid password'));
        }
      }, 1000);
    });
  }
}

// Export singleton instance
export const adminAuthService = AdminAuthService.getInstance();
export default adminAuthService;
