
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SimulationSettingsProvider } from './context/SimulationSettingsContext.tsx'

// Import accessibility checker in development
if (import.meta.env.DEV) {
  import('./utils/accessibilityChecker');
}

// 🔍 Debug Environment Variables
console.table({
  GA_ID: import.meta.env.VITE_GA4_MEASUREMENT_ID,
  GTM_ID: import.meta.env.VITE_GTM_ID,
  ALLOW_DEV: import.meta.env.VITE_ENABLE_ANALYTICS_DEV,
});

createRoot(document.getElementById("root")!).render(
  <SimulationSettingsProvider>
    <App />
  </SimulationSettingsProvider>
);
