// src/services/AuthService.ts
export const authService = {
  // Return parsed logged-in user from localStorage
  getCurrentUser: () => {
    try {
      // Check userData first (set by login), fallback to user
      const userStr = localStorage.getItem("userData") || localStorage.getItem("user");
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      return user && user.id ? user : null;
    } catch {
      return null;
    }
  },

  // Generate a user-specific storage key
  getNamespacedKey: (key: string) => {
    const userStr = localStorage.getItem("userData") || localStorage.getItem("user");
    if (!userStr) return `guest_${key}`;
    
    try {
      const user = JSON.parse(userStr);
      const userId = user?.id || "guest";
      return `${userId}_${key}`;
    } catch {
      return `guest_${key}`;
    }
  },

  // ✅ FIXED: Only clear *auth/session* data, not form data
  clearUserSession: () => {
    // Remove only auth tokens / login session info
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("role");
  },

  // (optional) Use only if you need to completely nuke that user's saved form data
  clearUserFormData: () => {
    const userStr = localStorage.getItem("userData") || localStorage.getItem("user");
    if (!userStr) return;
    
    try {
      const user = JSON.parse(userStr);
      const userId = user?.id || "guest";
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(`${userId}_`)) {
          localStorage.removeItem(k);
        }
      });
    } catch {
      // Ignore errors
    }
  },
};

// Example usage on logout:
export const handleLogout = () => {
  authService.clearUserSession(); // Only clears login info
  // ❌ Do NOT call clearUserFormData() unless you really want to reset the form
  window.location.href = "/login";
};
