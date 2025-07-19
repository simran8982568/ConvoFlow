
// Authentication utilities for role-based access
export type UserRole = 'admin' | 'superadmin' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  company?: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // TODO: Integrate with backend authentication
  login(email: string, password: string, role: UserRole): Promise<User> {
    return new Promise((resolve) => {
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        role: role!,
        name: role === 'admin' ? 'Admin User' : 'Super Admin',
        company: role === 'admin' ? 'AyuChat Inc.' : undefined
      };
      
      this.currentUser = mockUser;
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('role', role!);
      
      setTimeout(() => resolve(mockUser), 1000);
    });
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }
    
    return null;
  }

  getRole(): UserRole {
    return localStorage.getItem('role') as UserRole;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.getRole() === role;
  }
}

export const authService = AuthService.getInstance();
