/**
 * Set Progress Card Component
 * Displays progress information for a question set
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  RotateCcw,
  Trophy,
  Target,
  ArrowRight
} from 'lucide-react';
import { SetProgressSummary } from '@/services/setProgressService';
import RestartConfirmationDialog from '@/components/dialogs/RestartConfirmationDialog';
import { useToast } from '@/hooks/use-toast';

interface SetProgressCardProps {
  setId: number;
  setTitle: string;
  setDescription: string;
  questionsCount: number;
  progress?: SetProgressSummary;
  onStart: () => void;
  onContinue: () => void;
  onRestart: () => Promise<void>;
  onViewResults?: () => void;
  isLoading?: boolean;
  difficultyColor?: string;
  className?: string;
  questionType?: string;
  difficulty?: string;
}

export const SetProgressCard: React.FC<SetProgressCardProps> = ({
  setId,
  setTitle,
  setDescription,
  questionsCount,
  progress,
  onStart,
  onContinue,
  onRestart,
  onViewResults,
  isLoading = false,
  difficultyColor = 'from-blue-500 to-purple-600',
  className = '',
  questionType,
  difficulty
}) => {
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const { toast } = useToast();
  const getStatusIcon = () => {
    switch (progress?.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (progress?.status) {
      case 'completed':
        return 'הושלם';
      case 'in_progress':
        return 'בהתקדמות';
      default:
        return 'לא התחיל';
    }
  };

  const getStatusColor = () => {
    switch (progress?.status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleRestartClick = () => {
    setShowRestartDialog(true);
  };

  const handleRestartConfirm = async () => {
    try {
      await onRestart();
      toast({
        title: "הסט אופס בהצלחה",
        description: "ההתקדמות נמחקה ותוכל להתחיל מחדש",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "שגיאה באיפוס הסט",
        description: "אירעה שגיאה בעת איפוס הסט. נסה שוב.",
        variant: "destructive",
      });
    }
  };

  const getActionButton = () => {
    if (isLoading) {
      return (
        <Button disabled className="w-full">
          טוען...
        </Button>
      );
    }

    switch (progress?.status) {
      case 'completed':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={handleRestartClick}
              variant="outline"
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              התחל מחדש
            </Button>
            <Button
              onClick={onViewResults || onStart}
              className={`flex-1 bg-gradient-to-r ${difficultyColor} text-white`}
            >
              <Trophy className="w-4 h-4 mr-2" />
              צפה בתוצאות
            </Button>
          </div>
        );
      
      case 'in_progress':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={handleRestartClick}
              variant="outline"
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              התחל מחדש
            </Button>
            <Button
              onClick={onContinue}
              className={`flex-1 bg-gradient-to-r ${difficultyColor} text-white`}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              המשך
            </Button>
          </div>
        );
      
      default:
        return (
          <Button
            onClick={onStart}
            className={`w-full bg-gradient-to-r ${difficultyColor} text-white`}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            התחל סט
          </Button>
        );
    }
  };

  const progressPercentage = progress?.progress_percentage || 0;
  const currentQuestion = progress?.current_question || 0;
  const scorePercentage = progress?.score_percentage || 0;
  const timeSpent = progress?.time_spent || 0;

  return (
    <Card className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 text-white ${className}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white">
            {setTitle}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <Badge className={`${getStatusColor()} backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium`}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
        
        {progress?.status === 'in_progress' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>התקדמות</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-gray-400">
              שאלה {currentQuestion + 1} מתוך {questionsCount}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          {setDescription}
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400">שאלות</div>
            <div className="text-sm font-semibold">{questionsCount}</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-gray-400">זמן משוער</div>
            <div className="text-sm font-semibold">~{Math.ceil(questionsCount * 1.5)} דקות</div>
          </div>
          
          {progress?.status === 'completed' && (
            <>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-400">ציון</div>
                <div className={`text-sm font-semibold ${scorePercentage >= 70 ? 'text-green-400' : scorePercentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {scorePercentage}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-400">זמן בפועל</div>
                <div className="text-sm font-semibold">
                  {Math.round(timeSpent / 60)} דקות
                </div>
              </div>
            </>
          )}
          
          {progress?.status === 'in_progress' && (
            <>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-400">ציון נוכחי</div>
                <div className={`text-sm font-semibold ${scorePercentage >= 70 ? 'text-green-400' : scorePercentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {scorePercentage}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-400">זמן עד כה</div>
                <div className="text-sm font-semibold">
                  {Math.round(timeSpent / 60)} דקות
                </div>
              </div>
            </>
          )}
        </div>
        
        {progress?.last_activity && (
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            פעילות אחרונה: {new Date(progress.last_activity).toLocaleDateString('he-IL')}
          </div>
        )}
        
        <div className="pt-2">
          {getActionButton()}
        </div>
      </CardContent>
      
      <RestartConfirmationDialog
        isOpen={showRestartDialog}
        onClose={() => setShowRestartDialog(false)}
        onConfirm={handleRestartConfirm}
        setName={setTitle}
        questionType={questionType}
        difficulty={difficulty}
      />
    </Card>
  );
};

export default SetProgressCard;