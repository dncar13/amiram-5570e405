
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSavedQuestions from "@/hooks/useSavedQuestions";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getTopicById } from "@/data/utils/topicUtils";
import { Skeleton } from "@/components/ui/skeleton";

const SavedQuestionsTab = () => {
  const { savedQuestions, removeQuestionById, isInitialized, initializeSavedQuestions, isLoading } = useSavedQuestions();
  const navigate = useNavigate();
  
  // טעינת השאלות השמורות בעת הטעינה הראשונית - אוטומטית לחלוטין
  useEffect(() => {
    // console.log("SavedQuestionsTab mounted, initializing saved questions");
    if (!isInitialized) {
      initializeSavedQuestions();
    }
  }, [isInitialized, initializeSavedQuestions]);

  const handleRemove = (questionId: number) => {
    if (removeQuestionById(questionId)) {
      toast.success("השאלה הוסרה בהצלחה");
    }
  };

  const handleViewQuestion = (questionId?: number) => {
    if (questionId) {
      navigate(`/saved-questions?questionId=${questionId}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      return "תאריך לא ידוע";
    }
  };

  const getTopicName = (topicId?: number) => {
    if (!topicId) return "נושא לא ידוע";
    
    const topic = getTopicById(topicId);
    return topic ? topic.title : `נושא ${topicId}`;
  };

  // הצגת מצב טעינה
  if (isLoading || !isInitialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            שאלות שמורות
          </CardTitle>
          <CardDescription>
            השאלות ששמרת לשימוש מאוחר יותר
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          שאלות שמורות
        </CardTitle>
        <CardDescription>
          השאלות ששמרת לשימוש מאוחר יותר
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm">סה"כ: {savedQuestions.length} שאלות שמורות</div>
        </div>

        {savedQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-2 text-muted-foreground">אין שאלות שמורות</p>
            <p className="text-sm text-muted-foreground">
              שמרו שאלות באמצעות כפתור השמירה בעמוד השאלות
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedQuestions.map((savedQuestion) => (
              <div
                key={savedQuestion.id}
                className="border rounded-md p-4 bg-white hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium">
                    {getTopicName(savedQuestion.question.topicId)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(savedQuestion.savedDate)}
                  </div>
                </div>
                <p className="text-base mb-4 cursor-pointer" 
                   onClick={() => handleViewQuestion(savedQuestion.question.id)}>
                  {savedQuestion.question.text}
                </p>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewQuestion(savedQuestion.question.id)}
                    className="text-electric-blue hover:bg-electric-blue/10"
                  >
                    <ExternalLink className="h-4 w-4 ml-2" />
                    צפה בשאלה
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(savedQuestion.question.id)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    הסר
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedQuestionsTab;
