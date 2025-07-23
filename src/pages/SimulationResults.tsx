import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { SetProgressService, SetProgress } from '@/services/setProgressService';
import { supabase } from '@/integrations/supabase/client';

interface SimulationSession {
  id: string;
  current_question_index: number;
  answers: any[];
  total_questions: number;
  progress_percentage: number;
  is_completed: boolean;
  metadata: any;
  correct_answers: number;
  questions_answered: number;
  time_spent: number;
  created_at: string;
  completed_at?: string;
}

const SimulationResults = () => {
  const navigate = useNavigate();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const [searchParams] = useSearchParams();
  const setId = searchParams.get('set');
  const { currentUser } = useAuth();
  
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [setProgress, setSetProgress] = useState<SetProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, [currentUser, type, difficulty, setId]);

  const loadResults = async () => {
    if (!currentUser || !type || !difficulty || !setId) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Load set progress
      const progressResult = await SetProgressService.getSetProgress(
        currentUser.id,
        parseInt(setId),
        type,
        difficulty
      );

      if (progressResult) {
        setSetProgress(progressResult);
      }

      // Load simulation session for this specific set
      const { data: sessions, error: sessionError } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_completed', true)
        .filter('metadata->>set_id', 'eq', setId)
        .filter('metadata->>set_type', 'eq', type)
        .filter('metadata->>set_difficulty', 'eq', difficulty)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (sessions && sessions.length > 0) {
        setSession(sessions[0]);
      } else {
        setError('לא נמצאו תוצאות עבור הסט הזה');
      }

    } catch (err) {
      console.error('Error loading results:', err);
      setError('שגיאה בטעינת התוצאות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartSet = async () => {
    if (!currentUser || !type || !difficulty || !setId) return;

    try {
      const result = await SetProgressService.resetSetProgress(
        currentUser.id,
        parseInt(setId),
        type,
        difficulty
      );

      if (result.success) {
        // Navigate back to simulation with reset parameter
        navigate(`/simulation/${type}/${difficulty}?set=${setId}&start=${setProgress?.metadata?.start_index || 0}&reset=true`);
      } else {
        throw new Error(result.error || 'Failed to reset progress');
      }
    } catch (error) {
      console.error('Error restarting set:', error);
    }
  };

  const handleBackToSets = () => {
    navigate(`/simulation/type/${type}/${difficulty}/sets`);
  };

  const getTypeInHebrew = (t: string) => {
    switch (t) {
      case 'sentence-completion': return 'השלמת משפטים';
      case 'restatement': return 'ניסוח מחדש';
      case 'vocabulary': return 'אוצר מילים';
      case 'reading-comprehension': return 'הבנת הנקרא';
      default: return t;
    }
  };

  const getDifficultyInHebrew = (d: string) => {
    switch (d) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      default: return d;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-red-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'מעולה', icon: '🏆', color: 'text-yellow-400' };
    if (score >= 80) return { grade: 'טוב מאוד', icon: '🥇', color: 'text-green-400' };
    if (score >= 70) return { grade: 'טוב', icon: '🥈', color: 'text-blue-400' };
    if (score >= 60) return { grade: 'בסדר', icon: '🥉', color: 'text-orange-400' };
    return { grade: 'דורש שיפור', icon: '📚', color: 'text-red-400' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-white">
            <Clock className="h-12 w-12 mx-auto mb-4 animate-spin" />
            <p>טוען תוצאות...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-white">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">שגיאה בטעינת התוצאות</h2>
            <p className="mb-4">{error}</p>
            <Button onClick={handleBackToSets} variant="outline">
              חזרה לסטים
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const scorePercentage = session.total_questions > 0 
    ? Math.round((session.correct_answers / session.total_questions) * 100) 
    : 0;
  const gradeInfo = getGrade(scorePercentage);
  const timeSpentMinutes = Math.round(session.time_spent / 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-grow py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToSets}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            חזרה לסטים
          </button>

          {/* Header Card */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10 text-white mb-6">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`bg-gradient-to-r ${getDifficultyColor(difficulty || '')} rounded-full p-4`}>
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                תוצאות סט {setId} - {getTypeInHebrew(type || '')}
              </CardTitle>
              <p className="text-gray-300">
                רמת קושי: {getDifficultyInHebrew(difficulty || '')}
              </p>
            </CardHeader>
          </Card>

          {/* Score Card */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10 text-white mb-6">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">{gradeInfo.icon}</div>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(scorePercentage)}`}>
                  {scorePercentage}%
                </div>
                <div className={`text-xl ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </div>
                <Progress value={scorePercentage} className="max-w-md mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-sm text-gray-400">תשובות נכונות</div>
                  <div className="text-lg font-semibold">{session.correct_answers}/{session.total_questions}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <div className="text-sm text-gray-400">זמן</div>
                  <div className="text-lg font-semibold">{timeSpentMinutes} דקות</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-sm text-gray-400">סה"כ שאלות</div>
                  <div className="text-lg font-semibold">{session.total_questions}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Award className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                  <div className="text-sm text-gray-400">דיוק</div>
                  <div className="text-lg font-semibold">{scorePercentage}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10 text-white mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                פרטי הסשן
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">תאריך השלמה:</span>
                  <span>{new Date(session.completed_at || session.created_at).toLocaleDateString('he-IL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">שעת השלמה:</span>
                  <span>{new Date(session.completed_at || session.created_at).toLocaleTimeString('he-IL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">זמן ממוצע לשאלה:</span>
                  <span>{Math.round(session.time_spent / session.total_questions)} שניות</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">סטטוס:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    הושלם
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleRestartSet}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              התחל מחדש
            </Button>
            <Button
              onClick={handleBackToSets}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              חזרה לסטים
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SimulationResults;