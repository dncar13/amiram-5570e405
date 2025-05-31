
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SimulationSettings {
  timerEnabled: boolean;
  timerMinutes: number;
  examMode: boolean;
  showAnswersImmediately: boolean;
  questionsCount: number;
  timePerQuestion?: number; // Added this property as optional
}

interface SimulationSettingsContextType {
  settings: SimulationSettings;
  updateSettings: (newSettings: Partial<SimulationSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: SimulationSettings = {
  timerEnabled: true,
  timerMinutes: 45,
  examMode: false,
  showAnswersImmediately: true,
  questionsCount: 50,
  timePerQuestion: 60 // Default 60 seconds per question
};

const SimulationSettingsContext = createContext<SimulationSettingsContextType | undefined>(undefined);

export function SimulationSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SimulationSettings>(() => {
    try {
      // First check if there are current session settings
      const currentSettings = sessionStorage.getItem('current_simulation_settings');
      if (currentSettings) {
        const parsedSettings = JSON.parse(currentSettings);
        console.log("SimulationSettingsContext - Loading session settings:", parsedSettings);
        return {
          ...defaultSettings, // Always apply defaults first
          ...parsedSettings // Then override with session settings
        };
      }
      
      // Then check for saved settings in localStorage
      const savedSettings = localStorage.getItem('simulation_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        console.log("SimulationSettingsContext - Loading saved settings:", parsedSettings);
        return {
          ...defaultSettings, // Always apply defaults first
          ...parsedSettings // Then override with saved settings
        };
      } else {
        console.log("SimulationSettingsContext - No saved settings found, using defaults");
        return defaultSettings;
      }
    } catch (error) {
      console.error("SimulationSettingsContext - Error loading settings:", error);
      return defaultSettings;
    }
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('simulation_settings', JSON.stringify(settings));
      console.log('SimulationSettingsContext - Settings updated and saved to localStorage:', settings);
      
      // Also update sessionStorage for current simulation
      sessionStorage.setItem('current_simulation_settings', JSON.stringify(settings));
    } catch (error) {
      console.error("SimulationSettingsContext - Error saving settings:", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SimulationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      console.log('SimulationSettingsContext - Updating settings to:', updated);
      
      // Save to both localStorage and sessionStorage
      try {
        localStorage.setItem('simulation_settings', JSON.stringify(updated));
        sessionStorage.setItem('current_simulation_settings', JSON.stringify(updated));
        console.log('SimulationSettingsContext - Settings saved immediately to storage');
      } catch (error) {
        console.error("SimulationSettingsContext - Error saving settings in updateSettings:", error);
      }
      
      return updated;
    });
  };
  
  const resetSettings = () => {
    setSettings(defaultSettings);
    sessionStorage.removeItem('current_simulation_settings');
    localStorage.setItem('simulation_settings', JSON.stringify(defaultSettings));
    console.log('SimulationSettingsContext - Settings reset to defaults');
  };

  return (
    <SimulationSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SimulationSettingsContext.Provider>
  );
}

export function useSimulationSettings() {
  const context = useContext(SimulationSettingsContext);
  if (!context) {
    throw new Error('useSimulationSettings must be used within a SimulationSettingsProvider');
  }
  return context;
}
