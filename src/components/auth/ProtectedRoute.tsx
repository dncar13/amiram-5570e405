import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePremium?: boolean;
  redirectTo?: string;
  showLoading?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requirePremium = false,
  redirectTo,
  showLoading = true
}) => {
  const { currentUser, isPremium, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (isLoading) return;

    // console.log("🛡️ ProtectedRoute: Checking access permissions");
    // console.log("  - Require auth:", requireAuth);
    // console.log("  - Require premium:", requirePremium);
    // console.log("  - Current user:", currentUser?.email || "null");
    // console.log("  - Is premium:", isPremium);

    if (requireAuth && !currentUser) {
      // console.log("🔒 Redirecting to login (auth required)");
      navigate(redirectTo || '/login');
      return;
    }

    if (requirePremium && !isPremium) {
      // console.log("💎 Redirecting to premium (premium required)");
      navigate(redirectTo || '/premium');
      return;
    }

    // console.log("✅ Access granted");
  }, [currentUser, isPremium, isLoading, requireAuth, requirePremium, navigate, redirectTo]);

  // Show loading while auth state is being determined
  if (isLoading && showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mb-6 mx-auto">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-orange-500 border-r-orange-500/50 border-b-orange-500/30 border-l-orange-500/10 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">בודק הרשאות...</h2>
          <p className="text-gray-400">אנא המתן</p>
        </div>
      </div>
    );
  }

  // If auth check failed and redirection is needed, don't render children
  if (!isLoading) {
    if (requireAuth && !currentUser) {
      return null;
    }
    if (requirePremium && !isPremium) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
