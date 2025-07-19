
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/utils/auth';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in and redirect to appropriate dashboard
    const user = authService.getCurrentUser();
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      }
    } else {
      // Default to admin login
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
