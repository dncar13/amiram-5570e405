
// This file is no longer needed - premium simulations now use the unified simulation system
// All premium functionality has been integrated into the main SimulationPage component
// Users are redirected to the unified simulation with premium question filtering

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PremiumSetPractice = () => {
  const navigate = useNavigate();
  const { setId } = useParams();

  useEffect(() => {
    // Redirect to unified simulation system
    if (setId) {
      navigate(`/simulation/type/mixed/medium?premium_set=${setId}`);
    } else {
      navigate('/premium');
    }
  }, [setId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
    </div>
  );
};

export default PremiumSetPractice;
