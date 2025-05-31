
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { History, Calendar, Check, X, SkipForward, Clock, Trophy } from "lucide-react";
import { useActivityHistory } from "@/hooks/useActivityHistory";
import { useAuth } from "@/context/AuthContext";
import { topicsData } from "@/data/topics/topicsData";
import { getQuestions } from "@/services/questions/storage";

const HistoryTab = () => {
  const { currentUser } = useAuth();
  const { history, isLoading, refreshHistory } = useActivityHistory();
  
  // Refresh data when component mounts
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);
  
  const topics = topicsData
    .filter(topic => topic.id !== 20)
    .map(topic => ({
      id: topic.id,
      title: topic.title
    }));

  const topicProgress = topics.map(topic => {
    const topicQuestions = getQuestions().filter(q => q.topicId === topic.id);
    const topicHistory = history.filter(item => item.topic === topic.title);
    
    const latestRecord = [...topicHistory]
      .filter(item => 
        (item.questionId === 'final' || item.questionId === 'partial') && 
        item.score !== undefined &&
        item.correctAnswers !== undefined &&
        item.totalAnswered !== undefined
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const totalQuestionsAnswered = topicHistory.filter(item => 
      item.questionId !== 'final' && 
      item.questionId !== 'partial' && 
      (item.status === 'correct' || item.status === 'wrong')
    ).length;
    
    const correctAnswersCount = topicHistory.filter(item => 
      item.questionId !== 'final' && 
      item.questionId !== 'partial' && 
      item.status === 'correct'
    ).length;

    const answeredQuestions = latestRecord?.totalAnswered || totalQuestionsAnswered;
    const correctAnswers = latestRecord?.correctAnswers || correctAnswersCount;
    const totalQuestions = topicQuestions.length;
    
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    
    // Ensure we don't divide by zero when calculating score percentage
    const scorePercentage = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;

    return {
      ...topic,
      correctAnswers,
      answeredQuestions,
      totalQuestions,
      progressPercentage,
      scorePercentage,
      latestRecord
    };
  });

  const lastThreeTopics = topicsData
    .filter(topic => topic.id !== 20)
    .slice(-3)
    .map(topic => topic.title);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          התקדמות
        </CardTitle>
        <CardDescription>
          המעקב אחר ההתקדמות והפעילות שלך בפלטפורמה
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mb-8">
          {topicProgress.map((topic) => (
            <div key={topic.id} className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {topic.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>התקדמות כללית</span>
                  <span className="font-medium">{Math.round(topic.progressPercentage)}%</span>
                </div>
                <Progress value={topic.progressPercentage} className="h-2" />
              </div>

              {topic.answeredQuestions > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>ציון נוכחי</span>
                    <span className={`font-medium ${
                      topic.scorePercentage >= 60 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.round(topic.scorePercentage)}%
                    </span>
                  </div>
                  <Progress 
                    value={topic.scorePercentage} 
                    className="h-2" 
                    indicatorClassName={topic.scorePercentage >= 60 ? 'bg-green-600' : 'bg-red-600'} 
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">שאלות שנענו</div>
                  <div className="text-2xl font-semibold mt-1">{topic.answeredQuestions}/{topic.totalQuestions}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">תשובות נכונות</div>
                  <div className="text-2xl font-semibold mt-1 text-green-600">
                    {topic.correctAnswers}/{topic.answeredQuestions > 0 ? topic.answeredQuestions : 0}
                  </div>
                </div>
                {topic.latestRecord?.score !== undefined && (
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      ציון אחרון
                    </div>
                    <div className="text-2xl font-semibold mt-1 text-blue-600">{topic.latestRecord.score}%</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>טוען היסטוריה...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
            <p className="mb-2 text-muted-foreground">אין היסטורית פעילות</p>
            <p className="text-sm text-muted-foreground mb-4">
              התחל להשתמש בפלטפורמה כדי לראות את ההיסטוריה שלך כאן
            </p>
            <div className="space-y-2">
              <p className="font-medium">נושאים מומלצים להתחלה:</p>
              {lastThreeTopics.map((topic, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {topic}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תאריך</TableHead>
                <TableHead>נושא</TableHead>
                <TableHead>שאלה</TableHead>
                <TableHead>סטטוס תשובה</TableHead>
                <TableHead>זמן מענה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history
                .filter(activity => activity.questionId !== 'final' && activity.questionId !== 'partial')
                .map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.topic}</TableCell>
                  <TableCell>שאלה {activity.questionId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {activity.status === 'correct' && <Check className="h-4 w-4 text-green-500" />}
                      {activity.status === 'wrong' && <X className="h-4 w-4 text-red-500" />}
                      {activity.status === 'skipped' && <SkipForward className="h-4 w-4 text-gray-500" />}
                      {activity.status === 'correct' ? 'נכון ✓' : 
                       activity.status === 'wrong' ? 'שגוי ✘' : 
                       'דילוג ⏭️'}
                    </div>
                  </TableCell>
                  <TableCell>{activity.time} דקות</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
