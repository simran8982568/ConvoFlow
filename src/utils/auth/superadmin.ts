// Superadmin-specific authentication utilities
export type SuperAdminRole = 'superadmin';

export interface SuperAdminUser {
  id: string;
  email: string;
  role: SuperAdminRole;
  name: string;
  company: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

class SuperAdminAuthService {
  private static instance: SuperAdminAuthService;
  private currentUser: SuperAdminUser | null = null;

  // Hardcoded superadmin credentials
  private readonly SUPERADMIN_CREDENTIALS = {
    email: 'superadmin@ayuchat.com',
    password: 'superadmin123'
  };

  static getInstance(): SuperAdminAuthService {
    if (!SuperAdminAuthService.instance) {
      SuperAdminAuthService.instance = new SuperAdminAuthService();
    }
    return SuperAdminAuthService.instance;
  }

  // Superadmin login with hardcoded credentials
  async login(email: string, password: string): Promise<SuperAdminUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === this.SUPERADMIN_CREDENTIALS.email && 
            password === this.SUPERADMIN_CREDENTIALS.password) {
          
          const mockUser: SuperAdminUser = {
            id: 'superadmin-1',
            email,
            role: 'superadmin',
            name: 'Super Administrator',
            company: 'AyuChat Platform',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            permissions: ['all'],
            lastLogin: new Date().toISOString(),
          };
          
          this.currentUser = mockUser;
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('role', 'superadmin');
          localStorage.setItem('token', 'superadmin-jwt-token-' + Date.now());
          
          resolve(mockUser);
        } else {
          reject(new Error('Invalid superadmin credentials'));
        }
      }, 1000);
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
  getCurrentUser(): SuperAdminUser | null {
    if (this.currentUser) return this.currentUser;
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === 'superadmin') {
          this.currentUser = user;
          return this.currentUser;
        }
      }
    } catch (error) {
      console.warn('Error parsing stored superadmin user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
    }
    
    return null;
  }

  // Get superadmin role
  getRole(): SuperAdminRole | null {
    try {
      const role = localStorage.getItem('role');
      return role === 'superadmin' ? 'superadmin' : null;
    } catch (error) {
      console.warn('Error getting superadmin role from localStorage:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const role = this.getRole();
    return !!(user && role === 'superadmin');
  }

  // Get auth token
  getToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.warn('Error getting superadmin token:', error);
      return null;
    }
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Superadmin has all permissions
    return user.permissions.includes('all') || user.permissions.includes(permission);
  }

  // Update user profile
  async updateProfile(updates: Partial<SuperAdminUser>): Promise<SuperAdminUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.currentUser) {
          const updatedUser = { ...this.currentUser, ...updates };
          this.currentUser = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          resolve(updatedUser);
        } else {
          reject(new Error('No superadmin logged in'));
        }
      }, 800);
    });
  }

  // Change password (for superadmin)
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === this.SUPERADMIN_CREDENTIALS.password && newPassword.length >= 6) {
          // In a real app, this would update the password in the database
          resolve({
            success: true,
            message: 'Superadmin password changed successfully',
          });
        } else {
          reject(new Error('Invalid current password or new password too short'));
        }
      }, 1000);
    });
  }

  // Get demo credentials (for UI display)
  getDemoCredentials(): { email: string; password: string } {
    return {
      email: this.SUPERADMIN_CREDENTIALS.email,
      password: this.SUPERADMIN_CREDENTIALS.password,
    };
  }

  // Validate superadmin access
  validateAccess(): boolean {
    const user = this.getCurrentUser();
    const role = this.getRole();
    const token = this.getToken();
    
    return !!(user && role === 'superadmin' && token);
  }

  // Get session info
  getSessionInfo(): {
    isValid: boolean;
    user: SuperAdminUser | null;
    expiresAt: string | null;
  } {
    const user = this.getCurrentUser();
    const token = this.getToken();
    
    return {
      isValid: !!(user && token),
      user,
      expiresAt: null, // In a real app, this would be the token expiration
    };
  }
}

// Export singleton instance
export const superAdminAuthService = SuperAdminAuthService.getInstance();
export default superAdminAuthService;
