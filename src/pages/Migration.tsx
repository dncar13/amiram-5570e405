import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { migrateQuestionsToSupabase } from '@/scripts/migrateQuestionsToSupabase';
import { CheckIcon, AlertTriangleIcon, DatabaseIcon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';

const Migration: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<{
    inProgress: boolean;
    completed: boolean;
    success: number;
    errors: number;
    total: number;
    currentStep: string;
  }>({
    inProgress: false,
    completed: false,
    success: 0,
    errors: 0,
    total: 0,
    currentStep: ''
  });

  const handleMigration = async () => {
    setMigrationStatus({
      inProgress: true,
      completed: false,
      success: 0,
      errors: 0,
      total: 0,
      currentStep: 'מתחיל העברת נתונים...'
    });

    try {
      toast.info('מתחיל העברת השאלות לדאטה-בייס...');
      
      const result = await migrateQuestionsToSupabase();
      
      setMigrationStatus({
        inProgress: false,
        completed: true,
        success: result.successCount,
        errors: result.errorCount,
        total: result.successCount + result.errorCount,
        currentStep: 'הושלם!'
      });

      if (result.errorCount === 0) {
        toast.success(`כל השאלות הועברו בהצלחה! (${result.successCount} שאלות)`);
      } else {
        toast.warning(`הועברו ${result.successCount} שאלות, ${result.errorCount} נכשלו`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus({
        inProgress: false,
        completed: true,
        success: 0,
        errors: 1,
        total: 1,
        currentStep: 'שגיאה בהעברה'
      });
      toast.error('שגיאה בהעברת הנתונים');
    }
  };

  const progressPercentage = migrationStatus.total > 0 
    ? (migrationStatus.success / migrationStatus.total) * 100 
    : 0;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">העברת נתונים ל-Supabase</h1>
        <p className="text-muted-foreground">
          דף זה מאפשר להעביר את כל השאלות מהקוד לדאטה-בייס Supabase
        </p>
      </div>

      <div className="grid gap-6">
        {/* Migration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="h-5 w-5" />
              סטטוס העברה
            </CardTitle>
            <CardDescription>
              מעקב אחר תהליך העברת השאלות לדאטה-בייס
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!migrationStatus.completed && !migrationStatus.inProgress && (
              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  לחץ על הכפתור למטה כדי להתחיל את תהליך העברת השאלות. 
                  <strong> תהליך זה ירוץ פעם אחת בלבד.</strong>
                </AlertDescription>
              </Alert>
            )}

            {migrationStatus.inProgress && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="text-sm">{migrationStatus.currentStep}</span>
                </div>
                <Progress value={33} className="w-full" />
              </div>
            )}

            {migrationStatus.completed && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span className="font-medium">תהליך ההעברה הושלם</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {migrationStatus.success}
                    </div>
                    <div className="text-sm text-muted-foreground">הועברו בהצלחה</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {migrationStatus.errors}
                    </div>
                    <div className="text-sm text-muted-foreground">שגיאות</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {migrationStatus.total}
                    </div>
                    <div className="text-sm text-muted-foreground">סה"כ</div>
                  </div>
                </div>

                {migrationStatus.success > 0 && (
                  <Progress value={progressPercentage} className="w-full" />
                )}
              </div>
            )}

            <Button
              onClick={handleMigration}
              disabled={migrationStatus.inProgress || migrationStatus.completed}
              className="w-full"
            >
              <UploadIcon className="ml-2 h-4 w-4" />
              {migrationStatus.inProgress ? 'מעביר נתונים...' : 
               migrationStatus.completed ? 'העברה הושלמה' : 
               'התחל העברת נתונים'}
            </Button>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>מידע על המערכת</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span>טבלאות דאטה-בייס:</span>
                <div className="flex gap-2">
                  <Badge variant="outline">profiles</Badge>
                  <Badge variant="outline">subscriptions</Badge>
                  <Badge variant="outline">questions</Badge>
                  <Badge variant="outline">user_progress</Badge>
                  <Badge variant="outline">saved_questions</Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>מצב אותנטיקציה:</span>
                <Badge variant="default">Supabase Auth</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span>מצב שאלות:</span>
                <Badge variant="secondary">מוכנות להעברה</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>השלבים הבאים</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>העבר את השאלות לדאטה-בייס (בדף זה)</li>
              <li>עדכן את הקוד להשתמש בשאלות מהדאטה-בייס</li>
              <li>הגדר מערכת תשלומים לפרימיום</li>
              <li>בדוק שכל הפונקציונליות עובדת כמו קודם</li>
              <li>מחק את קבצי השאלות הישנים מהקוד</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Migration;