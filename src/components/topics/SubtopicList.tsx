
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getQuestionsBySubtopic } from "@/data/questionsData";
import { Subtopic, IconObject } from "@/data/topicsData";
import { FileText, ChevronLeft, AlertTriangle, Bookmark, BookText } from "lucide-react";
import React from "react";

interface SubtopicListProps {
  subtopics: Subtopic[];
  topicId: number;
  isComprehensiveExam?: boolean;
}

const SubtopicList = ({ subtopics, topicId, isComprehensiveExam = false }: SubtopicListProps) => {
  const navigate = useNavigate();
  
  if (!subtopics || subtopics.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-center">
        <AlertTriangle className="h-5 w-5 text-amber-500 mx-auto mb-2" />
        <p className="text-sm text-amber-800">אין תתי-נושאים זמינים עבור תחום זה עדיין.</p>
        <p className="text-xs text-amber-600 mt-1">אנחנו עובדים על הוספת תוכן בקרוב.</p>
      </div>
    );
  }
  
  const startSubtopicSimulation = (subtopicId: number) => {
    // In a future implementation, this would navigate to a subtopic-specific simulation
    // For now, we'll just navigate to the topic simulation
    navigate(`/simulation/${topicId}`);
  };
  
  // Helper function to render the icon
  const renderIcon = (icon: React.ReactNode | IconObject | undefined) => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    // If icon is in our object format with type and props
    if (icon && typeof icon === 'object' && 'type' in icon) {
      const iconObj = icon as IconObject;
      const IconComponent = iconObj.type;
      return <IconComponent className="h-4 w-4 text-electric-blue" />;
    }
    
    // Fallback
    return <FileText className="h-4 w-4 text-electric-blue" />;
  };
  
  // אם זהו המבחן המקיף, נציג פורמט קצת שונה
  if (isComprehensiveExam) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-electric-navy mb-4 text-right">חלקי המבחן המקיף - 1000 שאלות</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subtopics.map((subtopic, index) => {
            const questions = getQuestionsBySubtopic(subtopic.id);
            const startQuestionNum = index * 50 + 1;
            const endQuestionNum = (index + 1) * 50;
            const completionPercentage = Math.round((questions.length / 50) * 100);
            
            return (
              <Card key={subtopic.id} className="hover:shadow-md transition-shadow border-l-4 border-l-electric-blue">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-electric-blue/10 flex items-center justify-center ml-2">
                      <BookText className="h-4 w-4 text-electric-blue" />
                    </div>
                    <div className="text-right">
                      <h4 className="font-medium text-electric-navy">חלק {index + 1}</h4>
                      <p className="text-xs text-electric-slate">שאלות {startQuestionNum}-{endQuestionNum}</p>
                    </div>
                    
                    <div className="text-sm">
                      <span className={`font-medium ${
                        questions.length < 10 ? 'text-red-500' : 
                        questions.length < 30 ? 'text-amber-500' : 
                        'text-green-500'
                      }`}>
                        {questions.length}
                      </span>
                      <span className="text-electric-slate">/50</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Progress value={completionPercentage} className="h-1.5" />
                    <p className="text-xs text-electric-slate mt-1 text-center">
                      {completionPercentage}% מושלם
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-electric-blue hover:text-electric-slate"
                      onClick={() => startSubtopicSimulation(subtopic.id)}
                      disabled={questions.length < 5}
                    >
                      {questions.length < 5 ? (
                        'אין מספיק שאלות'
                      ) : (
                        <>
                          <ChevronLeft className="h-4 w-4 ml-1" />
                          <span>התחל תרגול</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
  
  // מציג את פורמט תת-הנושאים הרגיל
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-electric-navy mb-4 text-right">תתי-נושאים זמינים</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subtopics.map((subtopic) => {
          const questions = getQuestionsBySubtopic(subtopic.id);
          const completionPercentage = Math.round((questions.length / subtopic.targetCount) * 100);
          
          return (
            <Card key={subtopic.id} className="hover:shadow-md transition-shadow border-l-4 border-l-electric-blue">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-electric-blue/10 flex items-center justify-center ml-2">
                    {renderIcon(subtopic.icon)}
                  </div>
                  <div className="text-right">
                    <h4 className="font-medium text-electric-navy">{subtopic.title}</h4>
                    <p className="text-xs text-electric-slate">{subtopic.description}</p>
                  </div>
                  
                  <div className="text-sm">
                    <span className={`font-medium ${
                      questions.length < 5 ? 'text-red-500' : 
                      questions.length < 20 ? 'text-amber-500' : 
                      'text-green-500'
                    }`}>
                      {questions.length}
                    </span>
                    <span className="text-electric-slate">/{subtopic.targetCount}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <Progress value={completionPercentage} className="h-1.5" />
                  <p className="text-xs text-electric-slate mt-1 text-center">
                    {completionPercentage}% מושלם
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-electric-blue hover:text-electric-slate"
                    onClick={() => startSubtopicSimulation(subtopic.id)}
                    disabled={questions.length < 5}
                  >
                    {questions.length < 5 ? (
                      'אין מספיק שאלות'
                    ) : (
                      <>
                        <ChevronLeft className="h-4 w-4 ml-1" />
                        <span>התחל תרגול</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SubtopicList;
