
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SimulationSettingsProvider } from './context/SimulationSettingsContext.tsx'

// Import accessibility checker in development
if (import.meta.env.DEV) {
  import('./utils/accessibilityChecker');
}

createRoot(document.getElementById("root")!).render(
  <SimulationSettingsProvider>
    <App />
  </SimulationSettingsProvider>
);
