
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
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { SetProgressSummary } from '@/services/setProgressService';
import { RestartConfirmationDialog } from '@/components/dialogs/RestartConfirmationDialog';

interface SetProgressCardProps {
  setId: number;
  setTitle: string;
  setDescription: string;
  questionsCount: number;
  progress?: SetProgressSummary;
  onStart: () => void;
  onContinue: () => void;
  onRestart: () => void;
  isLoading?: boolean;
  difficultyColor?: string;
  className?: string;
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
  isLoading = false,
  difficultyColor = 'from-blue-500 to-purple-600',
  className = ''
}) => {
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

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

  const handleConfirmRestart = async () => {
    setIsRestarting(true);
    try {
      await onRestart();
    } finally {
      setIsRestarting(false);
    }
  };

  const getActionButton = () => {
    if (isLoading || isRestarting) {
      return (
        <Button disabled className="w-full bg-slate-600 text-white">
          {isRestarting ? 'מתחיל מחדש...' : 'טוען...'}
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
              className="flex-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              התחל מחדש
            </Button>
            <Button
              onClick={onStart}
              className={`flex-1 bg-gradient-to-r ${difficultyColor} text-white hover:opacity-90 transition-all duration-200`}
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
              className="flex-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              התחל מחדש
            </Button>
            <Button
              onClick={onContinue}
              className={`flex-1 bg-gradient-to-r ${difficultyColor} text-white hover:opacity-90 transition-all duration-200`}
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
            className={`w-full bg-gradient-to-r ${difficultyColor} text-white hover:opacity-90 transition-all duration-200`}
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
    <>
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
      </Card>

      <RestartConfirmationDialog
        open={showRestartDialog}
        onOpenChange={setShowRestartDialog}
        onConfirm={handleConfirmRestart}
        isLoading={isRestarting}
        title={`התחל מחדש את ${setTitle}?`}
        description={`פעולה זו תמחק את כל ההתקדמות הנוכחית בסט זה ותתחיל אותו מההתחלה. פעולה זו לא ניתנת לביטול.`}
      />
    </>
  );
};

export default SetProgressCard;
