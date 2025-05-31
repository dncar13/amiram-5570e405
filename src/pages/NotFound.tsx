
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">העמוד לא נמצא</p>
        <Link 
          to="/" 
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
