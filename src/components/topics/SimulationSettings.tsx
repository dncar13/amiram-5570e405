import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Clock, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { toast } from "@/hooks/use-toast";

interface SimulationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  progress?: number;
  onGoBack?: () => void;
  onStartSimulation?: () => void;
  questionsCount?: number;
}

export function SimulationSettings({
  isOpen,
  onClose,
  isLoading = false,
  progress = 0,
  onGoBack,
  onStartSimulation,
  questionsCount = 50
}: SimulationSettingsProps) {
  const { settings, updateSettings } = useSimulationSettings();
  
  // Use state for UI components
  const [localTimer, setLocalTimer] = useState(settings.timerEnabled);
  const [localTimerMinutes, setLocalTimerMinutes] = useState(settings.timerMinutes.toString());
  const [localPracticeMode, setLocalPracticeMode] = useState(!settings.examMode);
  
  // Sync local state when settings change
  useEffect(() => {
    setLocalTimer(settings.timerEnabled);
    setLocalTimerMinutes(settings.timerMinutes.toString());
    setLocalPracticeMode(!settings.examMode);
    
    console.log("SimulationSettings - Local settings updated from context:", {
      timerEnabled: settings.timerEnabled,
      timerMinutes: settings.timerMinutes,
      examMode: settings.examMode,
      practiceMode: !settings.examMode,
      showAnswersImmediately: settings.showAnswersImmediately
    });
  }, [settings]);
  
  const handleStartSimulation = () => {
    // Parse the timer minutes to ensure it's a valid integer
    const parsedMinutes = parseInt(localTimerMinutes) || 45;
    
    // Create settings object
    const updatedSettings = {
      timerEnabled: localTimer,
      timerMinutes: parsedMinutes,
      examMode: !localPracticeMode,
      showAnswersImmediately: localPracticeMode
    };
    
    console.log("SimulationSettings - Starting simulation with settings:", updatedSettings);
    
    // First, forcefully update the context settings
    updateSettings(updatedSettings);
    
    // Apply settings directly to sessionStorage for immediate access
    sessionStorage.setItem('current_simulation_settings', JSON.stringify(updatedSettings));
    
    // Show confirmation toast
    toast({
      title: "הגדרות נשמרו",
      description: `מצב: ${!localPracticeMode ? 'בחינה' : 'תרגול'}, טיימר: ${localTimer ? `${parsedMinutes} דקות` : 'מושבת'}`,
      duration: 3000,
    });
    
    // Start the simulation
    setTimeout(() => {
      if (onStartSimulation) {
        onStartSimulation();
      } else {
        onClose();
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-electric-navy">הגדרות סימולציה</h2>
          
          <div className="mb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Right column - Setting options */}
                <div className="w-full md:w-1/2 space-y-6 order-2 md:order-1">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-electric-gray/20">
                    <h4 className="font-semibold mb-4 flex items-center text-electric-navy">
                      <BookOpen className="h-5 w-5 ml-2 text-electric-blue" />
                      <span>סוג התרגול</span>
                    </h4>
                    <RadioGroup className="space-y-3 text-right">
                      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                        <Label htmlFor="practice" className="flex-grow text-right">מצב תרגול (הצגת הסברים מיד לאחר כל תשובה)</Label>
                        <RadioGroupItem 
                          value="practice" 
                          id="practice" 
                          checked={localPracticeMode}
                          onClick={() => setLocalPracticeMode(true)}
                        />
                      </div>
                      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                        <Label htmlFor="exam" className="flex-grow text-right">מצב מבחן (תשובות בסיום בלבד)</Label>
                        <RadioGroupItem 
                          value="exam" 
                          id="exam" 
                          checked={!localPracticeMode}
                          onClick={() => setLocalPracticeMode(false)}
                        />
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border border-electric-gray/20">
                    <h4 className="font-semibold mb-4 flex items-center text-electric-navy">
                      <Clock className="h-5 w-5 ml-2 text-electric-blue" />
                      <span>הפעלת טיימר</span>
                    </h4>
                    <RadioGroup className="space-y-3 text-right">
                      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                        <Label htmlFor="timer-enabled" className="flex-grow text-right">הפעל טיימר</Label>
                        <RadioGroupItem 
                          id="timer-enabled"
                          value="enabled"
                          checked={localTimer}
                          onClick={() => setLocalTimer(true)}
                        />
                      </div>

                      {localTimer && (
                        <div className="flex items-center mt-3 mr-8 space-x-2 rtl:space-x-reverse justify-end">
                          <Label htmlFor="timer-minutes" className="text-sm text-electric-slate">דקות</Label>
                          <Input
                            id="timer-minutes"
                            type="number"
                            min="1"
                            max="300"
                            value={localTimerMinutes}
                            onChange={(e) => setLocalTimerMinutes(e.target.value)}
                            className="w-24 text-center"
                            dir="ltr"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                        <Label htmlFor="timer-disabled" className="flex-grow text-right">תרגול ללא הגבלת זמן</Label>
                        <RadioGroupItem 
                          id="timer-disabled"
                          value="disabled"
                          checked={!localTimer}
                          onClick={() => setLocalTimer(false)}
                        />
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons placed at bottom with flipped sides */}
          <div className="flex justify-between mt-6 px-2 md:px-0">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="text-electric-slate hover:text-electric-blue hover:bg-electric-gray/40 order-1"
            >
              <ArrowLeft className="h-4 w-4 ml-1 rtl:rotate-180" />
              סגור
            </Button>

            <Button 
              onClick={handleStartSimulation}
              className="bg-electric-blue hover:bg-blue-600 py-6 px-8 flex items-center justify-center transition-all hover:shadow-md order-2"
            >
              <span>שמור הגדרות</span>
              <CheckCircle className="h-5 w-5 mr-2" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center mt-4">
              <p className="mb-3">טוען את הסימולציה...</p>
              <Progress value={progress} className="mb-4 h-2" />
              <p className="text-sm text-electric-slate">{progress}%</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}