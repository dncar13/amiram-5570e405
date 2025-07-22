
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SimulationSettingsProvider } from './context/SimulationSettingsContext.tsx'

createRoot(document.getElementById("root")!).render(
  <SimulationSettingsProvider>
    <App />
  </SimulationSettingsProvider>
);
