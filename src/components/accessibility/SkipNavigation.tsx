import React from 'react';
import { cn } from '@/lib/utils';

interface SkipNavigationProps {
  className?: string;
}

const SkipNavigation: React.FC<SkipNavigationProps> = ({ className }) => {
  return (
    <div className={cn("skip-navigation", className)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] 
                   bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium
                   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                   transform -translate-y-12 focus:translate-y-0 transition-transform duration-200"
        tabIndex={0}
      >
        דלג לתוכן העיקרי
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-[9999]
                   bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium
                   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                   transform -translate-y-12 focus:translate-y-0 transition-transform duration-200"
        tabIndex={0}
      >
        דלג לניווט
      </a>
      <a
        href="#footer"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-52 focus:z-[9999]
                   bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium
                   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                   transform -translate-y-12 focus:translate-y-0 transition-transform duration-200"
        tabIndex={0}
      >
        דלג לכותרת תחתונה
      </a>
    </div>
  );
};

export default SkipNavigation;