
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that scrolls the page to the top when the route changes
 */
export const useScrollToTop = () => {
  const { pathname, search } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname, search]);
};

export default useScrollToTop;
