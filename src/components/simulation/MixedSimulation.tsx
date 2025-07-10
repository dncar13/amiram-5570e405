/**
 * Mixed Simulation Component
 * 
 * Combines topic selection with adaptive simulation flow.
 * Handles reading comprehension topic selection and ensures consecutive reading questions.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { RTLWrapper } from '@/components/ui/rtl-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { SimulationModeSelector } from './SimulationModeSelector';
import { StoryTopicSelector } from './StoryTopicSelector';
import { AdaptiveSimulation } from './AdaptiveSimulation';
import { 
  DifficultyLevel, 
  SessionType, 
  SimulationSessionResult 
} from '@/services/adaptiveQuestions/types';
import { getReadingTopicById } from '@/data/readingComprehensionTopics';
import { questionCountService } from '@/services/questionCountService';
import { useAuth } from '@/context/AuthContext';

interface MixedSimulationProps {
  initialDifficulty?: DifficultyLevel;
  questionLimit?: number;
  enableTimer?: boolean;
  timePerQuestion?: number;
  className?: string;
}

type SimulationStep = 'mode-selection' | 'topic-selection' | 'simulation' | 'results';

export const MixedSimulation: React.FC<MixedSimulationProps> = ({
  initialDifficulty = 'medium',
  questionLimit = 10,
  enableTimer = false,
  timePerQuestion = 90,
  className = ''
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Simulation flow state
  const [currentStep, setCurrentStep] = useState<SimulationStep>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<'practice' | 'exam'>('practice');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [sessionType, setSessionType] = useState<SessionType>('quick');
  const [simulationResult, setSimulationResult] = useState<SimulationSessionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle mode selection
  const handleModeSelect = useCallback((mode: 'practice' | 'exam') => {
    setSelectedMode(mode);
    setSessionType(mode === 'exam' ? 'full' : 'quick');
  }, []);

  // Handle topic selection
  const handleTopicSelect = useCallback((topicId: number | null) => {
    setSelectedTopicId(topicId);
    setError(null);
  }, []);

  // Handle continue to simulation
  const handleContinueToSimulation = useCallback(async () => {
    if (!selectedTopicId) {
      setError('אנא בחר נושא לפני המשך');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if there are sufficient questions for the selected topic
      const sufficiency = await questionCountService.checkTopicSufficiency(
        selectedTopicId, 
        questionLimit, 
        'reading-comprehension'
      );
      
      if (!sufficiency.hasSufficient && !sufficiency.fallbackAvailable) {
        setError(`לא נמצאו מספיק שאלות לנושא שנבחר. נדרשות ${questionLimit} שאלות, נמצאו ${sufficiency.actualCount}.`);
        setIsLoading(false);
        return;
      }
      
      // If insufficient questions but fallback is available, show warning
      if (!sufficiency.hasSufficient && sufficiency.fallbackAvailable) {
        const selectedTopic = getReadingTopicById(selectedTopicId);
        toast({
          title: "מספר שאלות מוגבל",
          description: `לנושא ${selectedTopic?.nameHebrew} יש ${sufficiency.actualCount} שאלות בלבד. יתווספו שאלות מנושאים אחרים להשלמת הסימולציה.`,
          duration: 5000,
        });
      }
      
      setCurrentStep('simulation');
      
      // Add small delay to show loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error checking question sufficiency:', error);
      setError('שגיאה בבדיקת זמינות השאלות. אנא נסה שוב.');
      setIsLoading(false);
    }
  }, [selectedTopicId, questionLimit]);

  // Handle simulation completion
  const handleSimulationComplete = useCallback((result: SimulationSessionResult) => {
    setSimulationResult(result);
    setCurrentStep('results');
    
    // Show completion toast
    const selectedTopic = getReadingTopicById(selectedTopicId || 0);
    toast({
      title: "סימולציה הושלמה!",
      description: `סיימת את הסימולציה בנושא ${selectedTopic?.nameHebrew || 'לא ידוע'}`,
      duration: 5000,
    });
  }, [selectedTopicId]);

  // Handle simulation error
  const handleSimulationError = useCallback((error: Error) => {
    setError(error.message);
    toast({
      title: "שגיאה בסימולציה",
      description: error.message,
      variant: "destructive",
      duration: 5000,
    });
  }, []);

  // Handle restart
  const handleRestart = useCallback(() => {
    setCurrentStep('mode-selection');
    setSelectedMode('practice');
    setSelectedTopicId(null);
    setSessionType('quick');
    setSimulationResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    switch (currentStep) {
      case 'topic-selection':
        setCurrentStep('mode-selection');
        break;
      case 'simulation':
        setCurrentStep('topic-selection');
        break;
      case 'results':
        setCurrentStep('simulation');
        break;
      default:
        navigate('/simulations-entry');
    }
  }, [currentStep, navigate]);

  // Get current step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 'mode-selection':
        return 'בחירת מצב סימולציה';
      case 'topic-selection':
        return 'בחירת נושא לקריאה';
      case 'simulation':
        return 'סימולציה מותאמת';
      case 'results':
        return 'תוצאות הסימולציה';
      default:
        return 'סימולציה מעורבת';
    }
  };

  // Progress indicator
  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'mode-selection':
        return 25;
      case 'topic-selection':
        return 50;
      case 'simulation':
        return 75;
      case 'results':
        return 100;
      default:
        return 0;
    }
  };

  // If we're in simulation mode, render the AdaptiveSimulation component
  if (currentStep === 'simulation') {
    return (
      <RTLWrapper>
        <div className={`w-full max-w-none min-h-screen ${className}`}>
          <AdaptiveSimulation
            initialDifficulty={initialDifficulty}
            sessionType={sessionType}
            questionLimit={questionLimit}
            topicId={selectedTopicId || undefined}
            onComplete={handleSimulationComplete}
            onError={handleSimulationError}
            enableTimer={enableTimer}
            timePerQuestion={timePerQuestion}
            className="w-full"
          />
        </div>
      </RTLWrapper>
    );
  }

  return (
    <RTLWrapper>
      <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
        {/* Header with back button and progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-300 hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </Button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                {getProgressPercentage()}% הושלם
              </span>
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-100 text-center">
            {getStepTitle()}
          </h1>
        </div>

        {/* Error state */}
        {error && (
          <Card className="mb-6 border-red-500/50 bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-300">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step content */}
        {currentStep === 'mode-selection' && (
          <Card className="bg-slate-800/60 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-center text-slate-200">
                בחר מצב סימולציה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimulationModeSelector
                selectedMode={selectedMode}
                onModeSelect={handleModeSelect}
                timerMinutes={Math.floor((questionLimit * timePerQuestion) / 60)}
              />
              
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setCurrentStep('topic-selection')}
                  disabled={!selectedMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                >
                  המשך לבחירת נושא
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'topic-selection' && (
          <StoryTopicSelector
            selectedTopicId={selectedTopicId}
            onTopicSelect={handleTopicSelect}
            onContinue={handleContinueToSimulation}
            isLoading={isLoading}
            showQuestionCounts={true}
            className="w-full"
          />
        )}

        {currentStep === 'results' && simulationResult && (
          <Card className="bg-slate-800/60 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-center text-slate-200 flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                סימולציה הושלמה!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Results summary */}
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-blue-400">
                  {simulationResult.finalScore || 0}/{simulationResult.totalQuestions || 0}
                </div>
                <div className="text-lg text-slate-300">
                  {Math.round(((simulationResult.finalScore || 0) / Math.max(simulationResult.totalQuestions || 1, 1)) * 100)}% הצלחה
                </div>
                <div className="text-sm text-slate-400">
                  נושא: {getReadingTopicById(selectedTopicId || 0)?.nameHebrew || 'לא ידוע'}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  התחל סימולציה חדשה
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/simulations-entry')}
                  className="border-slate-500 text-slate-200 hover:bg-slate-700"
                >
                  חזרה לרשימת הסימולציות
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </RTLWrapper>
  );
};

export default MixedSimulation;