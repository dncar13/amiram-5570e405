
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { runStorageDiagnostics, StorageReport } from '@/services/diagnostics';
import { clearAllSimulationData } from '@/services/cloudSync';
import { optimizeStorage, cleanupOldProgress } from '@/services/storageUtils';
import { toast } from '@/hooks/use-toast';

export function StorageManager() {
  const [report, setReport] = useState<StorageReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadReport = () => {
    setIsLoading(true);
    try {
      const data = runStorageDiagnostics();
      setReport(data);
    } catch (err) {
      console.error('Error loading storage report:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadReport();
  }, []);
  
  const handleOptimize = async () => {
    setIsLoading(true);
    try {
      const removedCount = cleanupOldProgress();
      const optimized = optimizeStorage();
      
      toast({
        title: "ניקוי אחסון הושלם",
        description: `הוסרו ${removedCount} פריטים ישנים${optimized ? ' ובוצע דחיסה' : ''}`,
        variant: "success"
      });
      
      loadReport();
    } catch (err) {
      console.error('Error optimizing storage:', err);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת ניקוי האחסון",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearAll = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל נתוני הסימולציה? פעולה זו אינה ניתנת לביטול.')) {
      setIsLoading(true);
      try {
        clearAllSimulationData();
        toast({
          title: "הפעולה הושלמה",
          description: "כל נתוני הסימולציה נמחקו בהצלחה",
          variant: "success"
        });
        loadReport();
      } catch (err) {
        console.error('Error clearing simulation data:', err);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בעת מחיקת נתוני הסימולציה",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (!report) {
    return <div>טוען נתוני אחסון...</div>;
  }
  
  // Calculate usage percentage
  const usagePercent = report.browserQuota 
    ? Math.min(100, Math.round((report.totalSize / report.browserQuota) * 100))
    : 0;
  
  const getStatusColor = () => {
    if (usagePercent > 80) return 'bg-red-500';
    if (usagePercent > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ניהול אחסון</h2>
      
      {usagePercent > 80 && (
        <Alert variant="destructive">
          <AlertTitle>אחסון כמעט מלא!</AlertTitle>
          <AlertDescription>
            אחסון הדפדפן שלך כמעט מלא. מומלץ לנקות נתונים ישנים כדי למנוע אובדן מידע.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>ניצול אחסון</span>
          <span>{usagePercent}%</span>
        </div>
        <Progress 
          value={usagePercent} 
          className="h-2" 
          indicatorClassName={getStatusColor()}
        />
        <div className="text-sm text-muted-foreground">
          {(report.simulationSize / 1024 / 1024).toFixed(2)} MB מתוך {(report.browserQuota || 0) / 1024 / 1024} MB
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <div className="text-sm font-medium">סך הכל פריטים באחסון</div>
          <div className="text-2xl font-bold">{report.itemCount}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">פריטי סימולציה</div>
          <div className="text-2xl font-bold">{report.simulationItems}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">הפריטים הגדולים ביותר:</div>
        <ul className="space-y-1">
          {report.largestItems.map((item, i) => (
            <li key={i} className="text-sm">
              {item.key.substring(0, 30)}{item.key.length > 30 ? '...' : ''}: 
              {(item.size / 1024).toFixed(1)} KB
              {item.age > 0 ? ` (${item.age} ימים)` : ''}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Button 
          onClick={handleOptimize} 
          disabled={isLoading}
        >
          ניקוי אחסון
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleClearAll} 
          disabled={isLoading}
        >
          מחק הכל
        </Button>
      </div>
    </div>
  );
}
