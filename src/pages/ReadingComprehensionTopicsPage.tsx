import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadingTopicSelector } from '@/components/reading/ReadingTopicSelector';
import { readingTopicsService } from '@/services/readingTopicsService';
import { getReadingTopicById } from '@/data/readingComprehensionTopics';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export const ReadingComprehensionTopicsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topicCounts, setTopicCounts] = useState<Record<number, number>>({});
  const [userProgress, setUserProgress] = useState<Record<number, { completed: number; total: number }>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTopicData();
  }, [user]);

  const loadTopicData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get question counts for each topic
      const counts = await readingTopicsService.getTopicQuestionCounts();
      setTopicCounts(counts);

      // Get user progress if logged in
      if (user) {
        const progress = await readingTopicsService.getUserTopicProgress(user.id);
        
        // Convert to the format expected by the topic selector
        const formattedProgress: Record<number, { completed: number; total: number }> = {};
        Object.entries(progress).forEach(([topicId, data]) => {
          formattedProgress[Number(topicId)] = {
            completed: data.questionsAnswered,
            total: data.totalQuestions
          };
        });
        
        setUserProgress(formattedProgress);
      }
    } catch (err) {
      console.error('Error loading topic data:', err);
      setError('שגיאה בטעינת נתוני הנושאים. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topicId: number) => {
    const topic = getReadingTopicById(topicId);
    if (topic) {
      console.log('[ReadingComprehensionTopicsPage] Navigating to adaptive simulation with topic:', topic.nameHebrew);
      
      // Navigate to adaptive simulation with selected topic
      navigate('/adaptive-simulation', {
        state: {
          questionType: 'reading-comprehension',
          topicId: topicId,
          topicName: topic.nameHebrew,
          questionLimit: 20,
          difficulty: 'mixed',
          sessionType: 'practice'
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">טוען נושאים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowRight className="h-4 w-4 me-2" />
          חזרה
        </Button>

        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!user && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <AlertDescription>
              התחבר כדי לשמור את ההתקדמות שלך ולקבל המלצות מותאמות אישית
            </AlertDescription>
          </Alert>
        )}

        <ReadingTopicSelector
          onTopicSelect={handleTopicSelect}
          topicCounts={topicCounts}
          userProgress={user ? userProgress : undefined}
        />

        {/* Additional info section */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">אודות תרגול הבנת הנקרא</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • כל נושא מכיל קטעי קריאה ושאלות המותאמות לתחום הספציפי
            </p>
            <p>
              • ניתן לבחור "מעורב" לתרגול מגוון מכל הנושאים
            </p>
            <p>
              • המערכת עוקבת אחר ההתקדמות שלך בכל נושא בנפרד
            </p>
            <p>
              • מומלץ להתמקד בנושא אחד בכל פעם לשיפור מיטבי
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};