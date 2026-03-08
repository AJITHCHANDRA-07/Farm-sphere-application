import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute - Auth state:', { user: !!user, loading });

  // Show loading spinner while checking auth
  // This ensures auth state is properly loaded on page refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center 
                      bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 
                          border-b-4 border-green-600 mx-auto mb-4">
          </div>
          <p className="text-green-700 font-semibold text-lg">
            Loading FarmSphere...
          </p>
          <p className="text-green-600 text-sm mt-2">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  // Save the page they were trying to visit
  if (!user) {
    console.log('🔐 ProtectedRoute - No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in → show the page
  console.log('🔐 ProtectedRoute - User authenticated, showing protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
