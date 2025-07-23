// Route Tracker Component for Global Analytics
// Ensures page view tracking happens on every route change

import { useAnalytics } from '@/hooks/useAnalytics';

const RouteTracker: React.FC = () => {
  // The useAnalytics hook handles all route tracking automatically
  // We just need to call it so the hook is active
  useAnalytics();
  
  // This component doesn't render anything
  return null;
};

export default RouteTracker;