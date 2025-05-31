
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-electric-slate">טוען...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
