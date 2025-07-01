import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  clearAllSimulations,
  getSimulationStats,
  exportSimulations,
  importSimulations,
} from "@/services/simulationStorage";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StorageStats {
  totalSimulations: number;
  completedSimulations: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageScore: number;
  totalTimeSpent: number;
  lastSimulationDate: string;
}

const StorageManager = () => {
  const [stats, setStats] = useState<StorageStats>({
    totalSimulations: 0,
    completedSimulations: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    lastSimulationDate: "",
  });
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setStats(getSimulationStats());
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">ניהול אחסון מקומי</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">סטטיסטיקות</h3>
          <p>סה"כ סימולציות: {stats.totalSimulations}</p>
          <p>סימולציות שהושלמו: {stats.completedSimulations}</p>
          <p>שאלות שנענו: {stats.totalQuestionsAnswered}</p>
          <p>תשובות נכונות: {stats.totalCorrectAnswers}</p>
          <p>ציון ממוצע: {stats.averageScore.toFixed(2)}%</p>
          <p>תאריך סימולציה אחרונה: {stats.lastSimulationDate}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">ייצוא נתונים</h3>
          <Button
            onClick={() => {
              const data = exportSimulations();
              setExportData(data);
              toast({
                title: "ייצוא הצליח",
                description: "הנתונים שלך יוצאו בהצלחה",
              });
            }}
            size="sm"
          >
            ייצא נתונים
          </Button>
          {exportData && (
            <Textarea
              value={exportData}
              readOnly
              className="mt-2 h-24"
            />
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">ייבוא נתונים</h3>
          <Label htmlFor="importData">הדבק נתוני JSON:</Label>
          <Textarea
            id="importData"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            className="mt-2 h-24"
          />
          <Button
            onClick={() => {
              const result = importSimulations(importData);
              if (result) {
                setStats(getSimulationStats());
                toast({
                  title: "ייבוא הצליח",
                  description: "הנתונים שלך יובאו בהצלחה",
                });
              } else {
                toast({
                  title: "שגיאת ייבוא",
                  description: "אירעה שגיאה במהלך הייבוא",
                  variant: "destructive",
                });
              }
            }}
            size="sm"
          >
            ייבא נתונים
          </Button>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">אפשרויות ניקוי</h3>
          <Button
            onClick={() => {
              const result = clearAllSimulations();
              if (result) {
                setStats(getSimulationStats());
                // toast success message
              }
            }}
            variant="destructive"
            size="sm"
          >
            נקה הכל
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StorageManager;
