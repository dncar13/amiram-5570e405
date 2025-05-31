
import { Info } from "lucide-react";

export const SimulationTips = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
      <h2 className="text-xl font-semibold text-electric-navy mb-5 flex items-center justify-end">
        <span>טיפים לפני התחלת הסימולציה</span>
        <div className="mr-3 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-lg">
          <Info className="h-5 w-5" />
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
        <div className="bg-white/60 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-700 mb-2">📚 טיפ למידה</h3>
          <p className="text-sm text-gray-700">
            במצב תרגול תוכל ללמוד בקצב שלך עם משוב מיידי לאחר כל שאלה
          </p>
        </div>
        
        <div className="bg-white/60 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-700 mb-2">⏰ טיפ זמן</h3>
          <p className="text-sm text-gray-700">
            במצב מבחן תתרגל עבודה תחת לחץ זמן כמו במבחן האמיתי
          </p>
        </div>
        
        <div className="bg-white/60 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-700 mb-2">🎯 טיפ הצלחה</h3>
          <p className="text-sm text-gray-700">
            נסה כל סימולציה פעמיים - פעם בתרגול ופעם במבחן
          </p>
        </div>
      </div>
    </div>
  );
};
