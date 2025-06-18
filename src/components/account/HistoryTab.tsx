
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActivityHistory } from "@/hooks/useActivityHistory";
import { Clock, CheckCircle, XCircle, SkipForward, Flag, Calendar } from "lucide-react";

const HistoryTab = () => {
  const { history, isLoading } = useActivityHistory();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            היסטוריית פעילות
          </CardTitle>
          <CardDescription>מעקב אחר כל השאלות שענית עליהן</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">טוען היסטוריה...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'wrong':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <SkipForward className="h-4 w-4 text-yellow-500" />;
      case 'flagged':
        return <Flag className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'correct':
        return 'נכון';
      case 'wrong':
        return 'שגוי';
      case 'skipped':
        return 'דולג';
      case 'flagged':
        return 'סומן בדגל';
      default:
        return 'לא ידוע';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'wrong':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'flagged':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader className="text-right">
        <CardTitle className="flex items-center gap-2 justify-end">
          <Clock className="h-5 w-5" />
          היסטוריית פעילות
        </CardTitle>
        <CardDescription className="text-right">
          מעקב אחר כל השאלות שענית עליהן ושסימנת בדגל
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">אין פעילות קודמת</p>
            <p className="text-sm text-muted-foreground">
              התחל לפתור שאלות כדי לראות את ההיסטוריה שלך כאן
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-electric-gray/30 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <div className="text-right">
                    <p className="font-medium">שאלה מספר {record.questionId}</p>
                    <p className="text-sm text-muted-foreground">{record.topic}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(record.status)}
                  >
                    {getStatusText(record.status)}
                  </Badge>
                  <div className="text-left text-sm text-muted-foreground">
                    <p>{record.date}</p>
                    {record.time && record.time !== "0" && (
                      <p>{record.time} דקות</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
